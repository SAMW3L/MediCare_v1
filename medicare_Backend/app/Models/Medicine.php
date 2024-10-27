<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    // Specify table name if different from 'medicines'
    protected $table = 'medicines';
    
    // Add the fields that are fillable
    protected $fillable = ['name', 'price', 'quantity'];
}
