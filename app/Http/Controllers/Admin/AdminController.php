<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Shared Admin Dashboard - accessible by both super_admin and sub_admin
     */
    public function dashboard(): Response
    {
        $user = auth()->user();
        $totalReservations = Reservation::count();
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $approvedReservations = Reservation::where('status', 'approved')->count();
        $todayReservations = Reservation::whereDate('reservation_date', today())->count();

        $extraData = [];

        // Super Admin gets sub-admin stats
        if ($user->role === 'super_admin') {
            $extraData['totalSubAdmins'] = User::where('role', 'sub_admin')->count();
            $extraData['activeSubAdmins'] = User::where('role', 'sub_admin')->where('status', 'active')->count();
            $extraData['suspendedSubAdmins'] = User::where('role', 'sub_admin')->where('status', 'suspended')->count();
        }

        return Inertia::render('Admin/Dashboard', array_merge([
            'userName' => $user->name,
            'userRole' => $user->role,
            'totalReservations' => $totalReservations,
            'pendingReservations' => $pendingReservations,
            'approvedReservations' => $approvedReservations,
            'todayReservations' => $todayReservations,
        ], $extraData));
    }

    /**
     * Manage Menu page (shared)
     */
    public function manageMenu(): Response
    {
        return Inertia::render('Admin/ManageMenu', [
            'userName' => auth()->user()->name,
            'userRole' => auth()->user()->role,
        ]);
    }

    /**
     * Menu Data page (shared)
     */
    public function menuData(): Response
    {
        return Inertia::render('Admin/MenuData', [
            'userName' => auth()->user()->name,
            'userRole' => auth()->user()->role,
        ]);
    }

    /**
     * Orders page (shared)
     */
    public function orders(): Response
    {
        return Inertia::render('Admin/Orders', [
            'userName' => auth()->user()->name,
            'userRole' => auth()->user()->role,
        ]);
    }

    /**
     * Reservations page (shared) - list all reservations with approve/decline
     */
    public function reservations(): Response
    {
        $reservations = Reservation::with(['user:id,name,email', 'reviewer:id,name'])
            ->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'asc')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'name' => $reservation->name,
                    'email' => $reservation->email,
                    'phone' => $reservation->phone,
                    'reservation_date' => $reservation->reservation_date->format('Y-m-d'),
                    'reservation_time' => $reservation->reservation_time,
                    'guests' => $reservation->guests,
                    'special_requests' => $reservation->special_requests,
                    'status' => $reservation->status,
                    'review_note' => $reservation->review_note,
                    'customer_name' => $reservation->user?->name ?? 'N/A',
                    'reviewer_name' => $reservation->reviewer?->name ?? null,
                    'created_at' => $reservation->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Admin/Reservations', [
            'reservations' => $reservations,
            'userName' => auth()->user()->name,
            'userRole' => auth()->user()->role,
        ]);
    }

    /**
     * Approve a reservation
     */
    public function approveReservation(Request $request, Reservation $reservation)
    {
        $request->validate([
            'note' => 'nullable|string|max:500',
        ]);

        $reservation->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'review_note' => $request->input('note', 'Reservation approved.'),
        ]);

        return redirect()->back()->with('success', 'Reservation approved successfully!');
    }

    /**
     * Decline a reservation
     */
    public function declineReservation(Request $request, Reservation $reservation)
    {
        $request->validate([
            'note' => 'required|string|max:500',
        ]);

        $reservation->update([
            'status' => 'declined',
            'reviewed_by' => auth()->id(),
            'review_note' => $request->input('note'),
        ]);

        return redirect()->back()->with('success', 'Reservation declined successfully!');
    }

    /**
     * Settings page (shared)
     */
    public function settings(): Response
    {
        return Inertia::render('Admin/Settings', [
            'userName' => auth()->user()->name,
            'userRole' => auth()->user()->role,
        ]);
    }
}
