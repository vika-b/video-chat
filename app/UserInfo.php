<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{

    protected $table = 'user_info';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'phone',
        'university',
        'about_me',
        'address',
        'facebook',
        'linkedin',
        'google_plus',
        'github',
        'profile_pic'
    ];
}
