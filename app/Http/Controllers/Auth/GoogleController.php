<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google and log in.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            Log::error('Google authentication callback failed: ' . $e->getMessage());
            return redirect()->route('login')->withErrors([
                'email' => 'Failed to authenticate with Google. Please try again.',
            ]);
        }

        // Find or create the user
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Update Google ID if not set
            if (empty($user->google_id)) {
                $user->google_id = $googleUser->getId();
                $user->save();
            }
        } else {
            // Register a new user
            $user = User::create([
                'name' => $googleUser->getName() ?? 'Google User',
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'role' => 'customer',
                'is_active' => true,
                'status' => 'active',
                'password' => Hash::make(Str::random(24)), // Generate secure random password
            ]);

            // Send welcome email
            try {
                Mail::to($user->email)->send(new \App\Mail\WelcomeUserMail($user));
            } catch (\Exception $e) {
                Log::error('Failed to send welcome email to ' . $user->email . ' after Google sign up: ' . $e->getMessage());
            }
        }

        // Log the user in
        Auth::login($user, true);

        // Redirect based on role
        return redirect()->intended($user->getDashboardRoute());
    }
}
