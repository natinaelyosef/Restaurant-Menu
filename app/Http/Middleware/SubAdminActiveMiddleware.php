<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SubAdminActiveMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only apply to sub_admin role
        if ($user && ($user->role ?? '') === 'sub_admin') {
            // Check if account is active
            if (!($user->is_active ?? true) || in_array($user->status ?? 'active', ['suspended', 'banned'])) {
                // Log the user out
                auth()->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect('/login')->withErrors([
                    'email' => 'Your account has been ' . ($user->status ?? 'suspended') . '. Please contact the super admin.',
                ]);
            }
        }

        return $next($request);
    }
}
