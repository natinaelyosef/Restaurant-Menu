<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\RestaurantSetting;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
     public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        // 👇 If the user is logged in, redirect them to their dashboard immediately
        if (auth()->check()) {
            return redirect(auth()->user()->getDashboardRoute());
        }

        $settings = Schema::hasTable('restaurant_settings') ? \App\Models\RestaurantSetting::first() : null;
        
        return Inertia::render('Home', [
            'menuItems' => Schema::hasTable('menu_items') ? MenuItem::latest()->get() : [],
            'restaurantSettings' => $settings,
        ]);
    }
}