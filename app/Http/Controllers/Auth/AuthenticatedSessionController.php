<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Check if user is active (for sub_admin)
        $user = $request->user();
        if ($user->role === 'sub_admin' && !($user->is_active ?? true)) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'Your account has been suspended or deactivated. Please contact the super admin.',
            ]);
        }

        // Role-based redirect
        $redirectPath = match($user->role) {
            'super_admin' => '/super/dashboard',
            'sub_admin' => '/sub/dashboard',
            'customer' => '/customer/dashboard',
            default => '/customer/dashboard',
        };

        return redirect()->intended($redirectPath);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Explicitly forget session and XSRF cookies to help browsers and clients
        $cookieName = config('session.cookie', 'laravel_session');
        Cookie::queue(Cookie::forget($cookieName));
        Cookie::queue(Cookie::forget('XSRF-TOKEN'));

        // If this is an Inertia request, instruct the client to perform a location visit
        if ($request->header('X-Inertia')) {
            return Inertia::location(route('login'));
        }

        // Return JSON when requested (plain AJAX/SPA clients) or redirect to login for normal requests
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['message' => 'Logged out successfully']);
        }

        return redirect()->route('login');
    }
}
