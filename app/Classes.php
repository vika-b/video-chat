<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    protected $table = 'classes';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'picture', 'name', 'description', 'enroll_date', 'schedule_date', 'finish_date'
    ];

    public function users() {
        return $this->belongsToMany('App\User');
    }
}
