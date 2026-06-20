<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     * Only customer role can access.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || ($user->role ?? '') !== 'customer') {
            abort(403, 'Forbidden - Customer access required');
        }

        return $next($request);
    }
}
