<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\MenuController;
use App\Http\Controllers\FoodItemController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\SubAdminController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Customer\ReservationController;

// Home page
Route::get('/', [MenuController::class, 'index'])->name('home');
Route::post('/menu-items/{menuItem}/rate', [FoodItemController::class, 'rate'])->name('menu-items.rate');

// ============================================
// Authenticated Routes (all logged-in users)
// ============================================
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function (Request $request) {
        return redirect($request->user()->getDashboardRoute());
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Legacy dashboard menu management routes
    Route::get('/dashboard/menu-items', [FoodItemController::class, 'index'])->name('dashboard.menu-items');
    Route::get('/dashboard/menu-items/{menuItem}/edit', [FoodItemController::class, 'edit'])->name('dashboard.menu-items.edit');
    Route::get('/dashboard/menu-data', [FoodItemController::class, 'menuData'])->name('dashboard.menu-data');
    Route::post('/dashboard/menu-items', [FoodItemController::class, 'store']);
    Route::post('/dashboard/menu-items/{menuItem}', [FoodItemController::class, 'update']);
    Route::delete('/dashboard/menu-items/{menuItem}', [FoodItemController::class, 'destroy']);
});

// ============================================
// Super Admin Only Routes
// ============================================
Route::middleware(['auth', \App\Http\Middleware\SuperAdminMiddleware::class])->prefix('super')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'index'])->name('super.dashboard');
    Route::get('/change-password', [SuperAdminController::class, 'showChangePassword'])->name('super.change-password');
    Route::post('/change-password', [SuperAdminController::class, 'updatePassword'])->name('super.update-password');
    Route::get('/sub-admins', [SuperAdminController::class, 'subAdmins'])->name('super.sub-admins');
    Route::post('/sub-admins', [SuperAdminController::class, 'store'])->name('super.sub-admins.store');
    Route::put('/sub-admins/{user}', [SuperAdminController::class, 'update'])->name('super.sub-admins.update');
    Route::post('/sub-admins/{user}/reset-password', [SuperAdminController::class, 'resetPassword'])->name('super.sub-admins.reset-password');
    Route::post('/sub-admins/{user}/suspend', [SuperAdminController::class, 'suspend'])->name('super.sub-admins.suspend');
    Route::post('/sub-admins/{user}/ban', [SuperAdminController::class, 'ban'])->name('super.sub-admins.ban');
    Route::post('/sub-admins/{user}/activate', [SuperAdminController::class, 'activate'])->name('super.sub-admins.activate');
    Route::delete('/sub-admins/{user}', [SuperAdminController::class, 'destroy'])->name('super.sub-admins.destroy');
    Route::get('/restaurant-settings', [SuperAdminController::class, 'editRestaurantSettings'])->name('super.restaurant-settings.edit');
    Route::post('/restaurant-settings', [SuperAdminController::class, 'updateRestaurantSettings'])->name('super.restaurant-settings.update');
    Route::post('/restaurant-settings/upload-image', [SuperAdminController::class, 'uploadSectionImage'])->name('super.restaurant-settings.upload-image');
});

// ============================================
// Sub Admin Only Routes
// ============================================
Route::middleware(['auth', \App\Http\Middleware\SubAdminActiveMiddleware::class])->prefix('sub')->group(function () {
    Route::get('/dashboard', [SubAdminController::class, 'dashboard'])->name('sub.dashboard');
    Route::get('/change-password', [SubAdminController::class, 'showChangePassword'])->name('sub.change-password');
    Route::post('/change-password', [SubAdminController::class, 'updatePassword'])->name('sub.update-password');
});

// ============================================
// Shared Admin Routes (Super Admin + Sub Admin)
// ============================================
Route::middleware(['auth', \App\Http\Middleware\AdminAccessMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/manage-menu', [AdminController::class, 'manageMenu'])->name('admin.manage-menu');
    Route::get('/menu-data', [AdminController::class, 'menuData'])->name('admin.menu-data');
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/reservations', [AdminController::class, 'reservations'])->name('admin.reservations');
    Route::post('/reservations/{reservation}/approve', [AdminController::class, 'approveReservation'])->name('admin.reservations.approve');
    Route::post('/reservations/{reservation}/decline', [AdminController::class, 'declineReservation'])->name('admin.reservations.decline');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');

    // Menu item management (shared)
    Route::get('/menu-items', [FoodItemController::class, 'index'])->name('admin.menu-items');
    Route::get('/menu-items/{menuItem}/edit', [FoodItemController::class, 'edit'])->name('admin.menu-items.edit');
    Route::post('/menu-items', [FoodItemController::class, 'store'])->name('admin.menu-items.store');
    Route::post('/menu-items/{menuItem}', [FoodItemController::class, 'update'])->name('admin.menu-items.update');
    Route::delete('/menu-items/{menuItem}', [FoodItemController::class, 'destroy'])->name('admin.menu-items.destroy');
    Route::get('/menu-data-list', [FoodItemController::class, 'menuData'])->name('admin.menu-data-list');
});

// ============================================
// Customer Routes
// ============================================
Route::middleware(['auth', \App\Http\Middleware\CustomerMiddleware::class])->prefix('customer')->group(function () {
    Route::get('/dashboard', [ReservationController::class, 'dashboard'])->name('customer.dashboard');
    Route::get('/reserve', [ReservationController::class, 'create'])->name('customer.reserve');
    Route::post('/reserve', [ReservationController::class, 'store'])->name('customer.reserve.store');
    Route::get('/available-times', [ReservationController::class, 'availableTimes'])->name('customer.available-times');
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('customer.reservations.cancel');
    Route::get('/my-reservations', [ReservationController::class, 'myReservations'])->name('customer.my-reservations');
});

// Inside the Super Admin routes group
Route::middleware(['auth', \App\Http\Middleware\SuperAdminMiddleware::class])->prefix('super')->group(function () {
    // ... existing routes ...
    
    Route::get('/restaurant-settings', [SuperAdminController::class, 'editRestaurantSettings'])
        ->name('super.restaurant-settings.edit');
    Route::post('/restaurant-settings', [SuperAdminController::class, 'updateRestaurantSettings'])
        ->name('super.restaurant-settings.update');
    Route::post('/restaurant-settings/upload-image', [SuperAdminController::class, 'uploadSectionImage'])
        ->name('super.restaurant-settings.upload-image');
});

// API route for food items (legacy)
Route::post('/api/owner/food-items', [FoodItemController::class, 'store'])->middleware('auth');

require __DIR__.'/auth.php';

// Simple endpoint for SPA/frontend to verify session status
Route::get('/auth/check', function (Request $request) {
    if (Auth::check()) {
        return response()->json(['authenticated' => true, 'user' => $request->user()]);
    }

    return response()->json(['authenticated' => false], 401);
})->name('auth.check');
