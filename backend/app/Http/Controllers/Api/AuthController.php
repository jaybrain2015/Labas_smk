<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $user->createToken('smk-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'student_id' => $user->student_id,
                    'role' => $user->role,
                    'language_preference' => $user->language_preference,
                ],
                'token' => $token,
            ],
            'message' => 'Login successful',
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:student,lecturer',
            'student_id' => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role === 'lecturer' ? 'admin' : 'student',
            'student_id' => $request->student_id,
            'language_preference' => 'lt',
        ]);


        $token = $user->createToken('smk-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'student_id' => $user->student_id,
                    'role' => $user->role,
                    'language_preference' => $user->language_preference,
                ],
                'token' => $token,
            ],
            'message' => 'Registration successful',
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'role' => $user->role,
                'language_preference' => $user->language_preference,
            ],
            'message' => 'User profile',
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'language_preference' => 'sometimes|string|in:en,lt,ru',
            'current_password' => 'required_with:new_password|current_password',
            'new_password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($validated['new_password'])) {
            $validated['password'] = $validated['new_password'];
            unset($validated['new_password']);
            unset($validated['current_password']);
        }

        $user->update($validated);


        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'role' => $user->role,
                'language_preference' => $user->language_preference,
            ],
            'message' => 'Profile updated',
        ]);
    }
}
