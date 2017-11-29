<?php

namespace App\Http\Controllers;

use App\Classes;
use App\UserInfo;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use JWTAuth;
use App\User;
use App\Role;
use JWTAuthException;
use Validator;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => bcrypt($request->get('password')),
        ]);

        $user->roles()->attach(Role::where('name', 'student')->first());

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    public function register_student(Request $request)
    {
        $rules = [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6',
        ];
        $input = $request->only(
            'name',
            'email',
            'password'
        );
        $validator = Validator::make($input, $rules);

        if($validator->fails()) {
            $error = $validator->messages()->toJson();
            return response()->json(['success'=> false, 'error'=> $error]);
        }

        $name = $request->get('name');
        $email = $request->get('email');
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($request->get('password')),
            'is_verified' => 1,
        ]);

        $user->roles()->attach(Role::where('name', 'student')->first());

        /*$verification_code = str_random(30);
        DB::table('user_verifications')->insert([
            'user_id'=>$user->id,
            'token'=>$verification_code
        ]);*/

        /*$subject = "Please verify your email address.";
        Mail::send('email.verify', ['name' => $name, 'verification_code' => $verification_code],
            function($mail) use ($email, $name, $subject){
                $mail->from(getenv('FROM_EMAIL_ADDRESS'), "From User/Company Name Goes Here");
                $mail->to($email, $name);
                $mail->subject($subject);
            });*/

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    public function register_teacher(Request $request)
    {
        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => bcrypt($request->get('password')),
        ]);

        $user->roles()->attach(Role::where('name', 'teacher')->first());

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $token = null;

        try
        {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['invalid_email_or_password'], 422);
            }
        }
        catch (JWTAuthException $e)
        {
            return response()->json(['failed_to_create_token'], 500);
        }

        return response()->json(compact('token'));
    }

    public function getAuthUser(Request $request)
    {
        $user = JWTAuth::toUser($request->token);
        $role = DB::table('role_user')->select('*')->where('user_id', $user->id)->get()->first();

        return response()->json([
            'result' => $user,
            'role' => $role
        ]);
    }

    public function verifyUser($verification_code)
    {
        $check = DB::table('user_verifications')->where('token',$verification_code)->first();

        if(!is_null($check)){
            $user = User::find($check->user_id);
            if($user->is_verified == 1){
                return response()->json([
                    'success'=> true,
                    'message'=> 'Account already verified..'
                ]);
            }
            $user->update(['is_verified' => 1]);
            DB::table('user_verifications')->where('token',$verification_code)->delete();
            return response()->json([
                'success'=> true,
                'message'=> 'You have successfully verified your email address.'
            ]);
        }
        return response()->json(['success'=> false, 'error'=> "Verification code is invalid."]);
    }

    public function getProfileData(Request $request)
    {
//        die($request->token);
        $check = DB::table('user_info')->where('user_id', $request->id)->first();

        if(!is_null($check))
        {
            return response()->json([
                'success'=> true,
                'data'=> $check
            ]);
        }
        return response()->json(['error'=> "Empty Data!", 'id' => $request->id]);
    }

    public function updateProfileData(Request $request)
    {
        $user_info = UserInfo::updateOrCreate(
            ['user_id' => $request->get('user_id')],
            [
                'user_id' => $request->get('user_id'),
                'phone' => $request->get('phone'),
                'university' => $request->get('university'),
                'about_me' => $request->get('about_me'),
                'address' => $request->get('address'),
                'facebook' => $request->get('facebook'),
                'twitter' => $request->get('twitter'),
                'linkedin' => $request->get('linkedin'),
                'google_plus' => $request->get('google_plus'),
                'github' => $request->get('github'),
            ]);

        User::where('id', $request->get('user_id'))
            ->update([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
            ]);

        return response()->json([
            'status' => true,
            'message' => 'Updated successfully'
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $avatar = $request->get('avatar');
        $user_id = $request->get('user_id');

        $png_name = "user_" . $user_id . "_" . time() . ".png";
        $png_name_cropped = "user_" . $user_id . "_" . time() . "_300X300.png";
        $png_path = 'img/profiles/' . $user_id . '/';

        $path = public_path($png_path . $png_name);
        $path_cropped = public_path($png_path . $png_name_cropped);

        if (!File::isDirectory(public_path($png_path)))
            File::MakeDirectory(public_path($png_path), 0777, true);

        Image::make($avatar)->save($path);
        Image::make($avatar)->crop(300, 300)->save($path_cropped);

        $user_info = UserInfo::updateOrCreate(
            ['user_id' => $user_id],
            [
                'user_id' => $user_id,
                'profile_pic' => $user_id . '/' . $png_name_cropped
            ]
        );

        return response()->json([
            'status' => true,
            'message' => 'Updated successfully',
            'profile_pic' => 'img/profiles/' . $user_id . '/' . $png_name_cropped,
        ]);
    }

    public function getClass(Request $request)
    {
    }

    public function createClass(Request $request)
    {
        $req_data = $request->get('data');
        $avatar = $request->get('picture');

        $user_id = $req_data['user_id'];
        $png_name = "class_" . $user_id . "_" . time() . ".png";
        $png_path = 'img/classes/' . $user_id . '/';
        $path = public_path($png_path . $png_name);

        if (!File::isDirectory(public_path($png_path)))
            File::MakeDirectory(public_path($png_path), 0777, true);

        Image::make($avatar)->save($path);

        $classes = Classes::create([
            'picture' => $user_id . '/' . $png_name,
            'name' => $req_data['class_name'],
            'description' => $req_data['class_description'],
            'enroll_date' => $req_data['date_range'][0],
            'finish_date' => $req_data['date_range'][1]
        ]);

        $classes->users()->attach($user_id);

        return response()->json([
            'status' => true,
            'message' => 'Updated successfully',
            'picture' => 'img/classes/' . $user_id . '/' . $png_name,
        ]);
    }
}
