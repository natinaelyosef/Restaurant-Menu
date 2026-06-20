<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAccessMiddleware
{
    /**
     * Handle an incoming request.
     * Only super_admin and sub_admin roles can access.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role ?? '', ['super_admin', 'sub_admin'])) {
            abort(403, 'Forbidden - Admin access required');
        }

        // Check if sub_admin is suspended or banned
        if ($user->role === 'sub_admin') {
            if (!($user->is_active ?? true) || in_array($user->status ?? 'active', ['suspended', 'banned'])) {
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
