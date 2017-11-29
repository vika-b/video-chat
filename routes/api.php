<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('auth/register', 'UserController@register');
Route::post('auth/register/student', 'UserController@register_student');
Route::post('auth/register/teacher', 'UserController@register_teacher');
Route::post('auth/login', 'UserController@login');
Route::get('user/verify/{verification_code}', 'UserController@verifyUser');

Route::group(['middleware' => 'jwt.auth'], function () {
    Route::get('user', 'UserController@getAuthUser');
    Route::get('user/get/profile/data', 'UserController@getProfileData');
    Route::post('user/update/profile/data', 'UserController@updateProfileData');
    Route::post('user/update/update/avatar', 'UserController@updateAvatar');
    Route::post('user/create/class', 'UserController@createClass');
    Route::get('class', 'UserController@getClass');
});