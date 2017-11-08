<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_s = new Role();
        $role_s->name = 'student';
        $role_s->save();

        $role_t = new Role();
        $role_t->name = 'teacher';
        $role_t->save();
    }
}
