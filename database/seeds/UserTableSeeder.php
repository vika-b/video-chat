<?php

use Illuminate\Database\Seeder;
use App\Role;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        $role_student = Role::where('name', 'student')->first();
        $role_teacher = Role::where('name', 'teacher')->first();

        $user_student = new User();
        $user_student->name = $faker->name;
        $user_student->email = $faker->email;
        $user_student->password = bcrypt('123456');
        $user_student->save();
        $user_student->roles()->attach($role_student);

        $user_teacher = new User();
        $user_teacher->name = $faker->name;
        $user_teacher->email = $faker->email;
        $user_teacher->password = bcrypt('123456');
        $user_teacher->save();
        $user_teacher->roles()->attach($role_teacher);
    }
}
