<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'cover_image', 'price'];

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
