<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicine; // Import the Medicine model

class MedicineController extends Controller
{
    // Method to fetch all medicines
    public function index()
    {
        try {
            $medicines = Medicine::all(); // Fetch all medicines from the database
            return response()->json($medicines, 200); // Return the medicines as JSON
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch medicines'], 500);
        }
    }
}
