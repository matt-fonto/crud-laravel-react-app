<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// When we hit the /signup route with a post method, we should get the signup method from the AuthController 
Route::post("/signup", [AuthController::class, 'signup']);
Route::post("/login", [AuthController::class, 'login']);
Route::post("/logout", [AuthController::class, 'logout']);

// 1:18:24
// 1:24:36