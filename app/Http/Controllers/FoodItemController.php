<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FoodItemController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::all();
        return response()->json($menuItems);
    }

    public function menuData()
    {
        $menuItems = MenuItem::orderBy('created_at', 'desc')->get();
        return Inertia::render('MenuData', [
            'menuItems' => $menuItems
        ]);
    }

    public function create()
    {
        return Inertia::render('FoodItemForm');
    }

    public function edit(MenuItem $menuItem)
    {
        return Inertia::render('FoodItemForm', [
            'menuItem' => $menuItem
        ]);
    }














  
public function store(Request $request)
    {
        // ✅ Use $request->validate() so Inertia automatically catches errors
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_url' => 'nullable|string|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menu_images', 'public');
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $request->input('image_url');
        }

        MenuItem::create($validated);

        // ✅ Return a standard redirect, NOT a JSON response
        return redirect()->route('admin.menu-data')->with('success', 'Menu item created successfully!');
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_url' => 'nullable|string|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menu_images', 'public');
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $request->input('image_url');
        } else {
            // Do not overwrite existing image if none was provided
            unset($validated['image']);
        }

        $menuItem->update($validated);

        return redirect()->route('admin.menu-data')->with('success', 'Menu item updated successfully!');
    }































    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        
        if (request()->wantsJson() || request()->ajax()) {
            return response()->json(null, 204);
        }
        
        return redirect()->back()->with('success', 'Menu item deleted successfully!');
    }

    public function rate(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
        ]);

        $menuItem->rating = $validated['rating'];
        $menuItem->save();

        return redirect()->back()->with('success', 'Thank you for your rating!');
    }

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem);
    }
}