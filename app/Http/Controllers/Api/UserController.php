<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // collection:
        // includes metadata, such as: links, pagination, etc.
        return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        try {
            // validate the request
            $data = $request->validated();
            // encrypt the password
            $data['password'] = bcrypt($data['password']);

            $user = User::create($data);

            return response(new UserResource($user), 201);
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(['message' => 'There was an error creating the user: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            // validate the request
            $data = $request->validated();

            // encrypt the password if it is present in the request
            if (isset($data['password'])) {
                // encrypt the password
                $data['password'] = bcrypt($data['password']);
            }

            $user->update($data);

            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            // return a more meaningful response to the client
            return response()->json(['message' => 'There was an error updating the user'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // delete the user from the database
        $user->delete();

        // return a 204 response
        return response("", 204);
    }
}
