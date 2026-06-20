<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;

class SubAdminController extends Controller
{
    /**
     * Sub Admin Dashboard
     */
    public function dashboard(): Response
    {
        $user = auth()->user();

        return Inertia::render('SubAdmin/Dashboard', [
            'userName' => $user->name,
            'userEmail' => $user->email,
            'userStatus' => $user->status ?? 'active',
        ]);
    }

    /**
     * Show the change password form.
     */
    public function showChangePassword(): Response
    {
        return Inertia::render('SubAdmin/ChangePassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Update the sub admin's own password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', 'Password updated successfully!');
    }
}
