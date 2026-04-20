<?php
/**
 * File: backend/app/Http/Controllers/Api/PasswordResetController.php
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // We return success even if user not found to prevent email enumeration
            return response()->json([
                'success' => true,
                'message' => 'If your email is in our system, you will receive a reset link shortly.',
            ]);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Simulation: Log the reset link instead of sending it
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') . "/reset-password?token={$token}&email=" . urlencode($user->email);
        Log::info("Password reset request for {$user->email}. Link: {$resetUrl}");

        return response()->json([
            'success' => true,
            'message' => 'If your email is in our system, you will receive a reset link shortly.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $resetData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetData || !Hash::check($request->token, $resetData->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token or email.',
            ], 422);
        }

        // Check if token expired (e.g., 60 minutes)
        if (now()->parse($resetData->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Token has expired.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        // Update password (using model to trigger 'hashed' cast)
        $user->password = $request->password;
        $user->save();

        // Delete the token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Your password has been reset successfully.',
        ]);
    }
}
