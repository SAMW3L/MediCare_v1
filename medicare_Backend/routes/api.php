<?php

use App\Http\Controllers\MedicineController;

Route::get('/medicines', [MedicineController::class, 'index']);
