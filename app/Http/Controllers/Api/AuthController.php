<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        // Retrieve the validated data from the request
        $data = $request->validated();

        // Create a new user record in the database
        $user = User::create([
            // name is equal to the name from the validated data
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data["password"])
        ]);

        /** @var \App\Models\User $user */
        // Generate a token for the user
        // Token: a string that is used to authenticate a user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user details and token
        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request)
    {
        // Retrieve the validated data from the request
        $credentials = $request->validated();


        // Check if credentials are correct
        if (!Auth::attempt($credentials)) {
            // If credentials are incorrect, return an error message
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        // Retrieve the authenticated user
        $user = Auth::user();

        // Generate a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user details and token
        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user === null) {
            return response('No authenticated user', 401);
        }

        $user->currentAccessToken()->delete();

        return response('Logged out successfully', 200);
    }
}
