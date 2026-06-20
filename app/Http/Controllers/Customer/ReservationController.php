<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Customer Dashboard
     */
    public function dashboard(): Response
    {
        $user = auth()->user();
        $myReservations = Reservation::where('user_id', $user->id)
            ->orderBy('reservation_date', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'reservation_date' => $r->reservation_date->format('Y-m-d'),
                    'reservation_time' => $r->reservation_time,
                    'guests' => $r->guests,
                    'status' => $r->status,
                    'review_note' => $r->review_note,
                    'created_at' => $r->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'userName' => $user->name,
            'myReservations' => $myReservations,
            'activeCount' => Reservation::where('user_id', $user->id)->whereIn('status', ['pending', 'approved'])->count(),
        ]);
    }

    /**
     * Show the reservation form
     */
    public function create(): Response
    {
        return Inertia::render('Customer/Reserve', [
            'userName' => auth()->user()->name,
            'userEmail' => auth()->user()->email,
        ]);
    }

    /**
     * Store a new reservation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'reservation_date' => 'required|date|date_format:Y-m-d',
            'reservation_time' => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1|max:50',
            'special_requests' => 'nullable|string|max:1000',
        ]);

        // Check if the time slot is already booked
        $existingBooking = Reservation::where('reservation_date', $validated['reservation_date'])
            ->where('reservation_time', $validated['reservation_time'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingBooking) {
            return back()->withErrors([
                'reservation_time' => 'This time slot is already booked. Please choose a different time.',
            ]);
        }

        Reservation::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'guests' => $validated['guests'],
            'special_requests' => $validated['special_requests'] ?? null,
            'status' => 'pending',
        ]);

        return redirect()->route('customer.dashboard')
            ->with('success', 'Reservation submitted successfully! Waiting for admin approval.');
    }

    /**
     * Get available time slots for a given date
     */
    public function availableTimes(Request $request)
    {
        $request->validate([
            'date' => 'required|date|date_format:Y-m-d',
        ]);

        $date = $request->input('date');

        // Define all possible time slots
        $allSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
            '21:00',
        ];

        // Get booked slots for this date
        $bookedSlots = Reservation::where('reservation_date', $date)
            ->whereIn('status', ['pending', 'approved'])
            ->pluck('reservation_time')
            ->toArray();

        $availableSlots = array_values(array_diff($allSlots, $bookedSlots));

        return response()->json([
            'available' => $availableSlots,
            'booked' => $bookedSlots,
            'all' => $allSlots,
        ]);
    }

    /**
     * Cancel a reservation (customer can only cancel their own)
     */
    public function cancel(Reservation $reservation)
    {
        // Ensure the customer can only cancel their own reservation
        if ($reservation->user_id !== auth()->id()) {
            abort(403, 'You can only cancel your own reservations.');
        }

        if (in_array($reservation->status, ['declined', 'cancelled'])) {
            return back()->withErrors([
                'status' => 'This reservation is already ' . $reservation->status . ' and cannot be cancelled.',
            ]);
        }

        $reservation->update([
            'status' => 'cancelled',
        ]);

        return redirect()->back()->with('success', 'Reservation cancelled successfully.');
    }

    /**
     * Show customer's reservations
     */
    public function myReservations(): Response
    {
        $user = auth()->user();
        $reservations = Reservation::where('user_id', $user->id)
            ->orderBy('reservation_date', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'name' => $r->name,
                    'email' => $r->email,
                    'phone' => $r->phone,
                    'reservation_date' => $r->reservation_date->format('Y-m-d'),
                    'reservation_time' => $r->reservation_time,
                    'guests' => $r->guests,
                    'special_requests' => $r->special_requests,
                    'status' => $r->status,
                    'review_note' => $r->review_note,
                    'created_at' => $r->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Customer/MyReservations', [
            'reservations' => $reservations,
            'userName' => $user->name,
        ]);
    }
}
