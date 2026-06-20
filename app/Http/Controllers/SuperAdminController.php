<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RestaurantSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;

class SuperAdminController extends Controller
{
    public function index(): Response
    {
        $totalSubAdmins = User::where('role', 'sub_admin')->count();
        $active = User::where('role', 'sub_admin')->where('status', 'active')->count();
        $suspended = User::where('role', 'sub_admin')->where('status', 'suspended')->count();
        $banned = User::where('role', 'sub_admin')->where('status', 'banned')->count();
        
        $recentSubAdmins = User::where('role', 'sub_admin')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'email', 'status', 'created_at']);

        return Inertia::render('SuperAdmin/Dashboard', [
            'totalSubAdmins' => $totalSubAdmins,
            'active' => $active,
            'suspended' => $suspended,
            'banned' => $banned,
            'recentSubAdmins' => $recentSubAdmins,
        ]);
    }

    /**
     * Show the change password form for super admin.
     */
    public function showChangePassword(): Response
    {
        return Inertia::render('SuperAdmin/ChangePassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Update the super admin's own password.
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

    // Sub-admin management methods

    /**
     * Display the sub-admins management page.
     */
    public function subAdmins(): Response
    {
        $subAdmins = User::where('role', 'sub_admin')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'status', 'created_at']);

        return Inertia::render('SuperAdmin/SubAdmins', [
            'subAdmins' => $subAdmins,
        ]);
    }

    /**
     * Store a newly created sub-admin.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'sub_admin',
            'status' => 'active',
        ]);

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin created successfully.');
    }

    /**
     * Update the specified sub-admin.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin updated successfully.');
    }

    /**
     * Reset the password for a sub-admin.
     */
    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        return redirect()->route('super.sub-admins')->with('success', 'Password reset successfully.');
    }

    /**
     * Suspend a sub-admin.
     */
    public function suspend(User $user)
    {
        $user->status = 'suspended';
        $user->save();

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin suspended.');
    }

    /**
     * Ban a sub-admin.
     */
    public function ban(User $user)
    {
        $user->status = 'banned';
        $user->save();

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin banned.');
    }

    /**
     * Activate a sub-admin.
     */
    public function activate(User $user)
    {
        $user->status = 'active';
        $user->save();

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin activated.');
    }

    /**
     * Remove the specified sub-admin.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('super.sub-admins')->with('success', 'Sub-admin deleted.');
    }

    /**
     * Show the restaurant settings edit page.
     */
    public function editRestaurantSettings(): Response
    {
        $settings = RestaurantSetting::first();
        
        if (!$settings) {
            $settings = RestaurantSetting::create([
                'name' => 'Dola Grill',
                'logo' => '🍔',
                'sections' => $this->getDefaultSections(),
            ]);
        }

        return Inertia::render('SuperAdmin/RestaurantSettings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the restaurant settings.
     */
    public function updateRestaurantSettings(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'logo_url' => 'nullable|string|max:2048',
            'logo_text' => 'nullable|string|max:255',
            'logo_type' => 'required|string|in:upload,url,text',
            'sections' => 'nullable', // accept JSON string or array
        ]);

        $settings = RestaurantSetting::first();
        
        if (!$settings) {
            $settings = new RestaurantSetting();
        }

        $settings->name = $validated['name'];

        // Handle logo
        if ($validated['logo_type'] === 'upload' && $request->hasFile('logo')) {
            // Delete old logo if exists
            if ($settings->logo && !str_starts_with($settings->logo, 'http') && !str_starts_with($settings->logo, '🍔')) {
                Storage::disk('public')->delete($settings->logo);
            }
            $settings->logo = $request->file('logo')->store('restaurant_logos', 'public');
        } elseif ($validated['logo_type'] === 'url' && !empty($validated['logo_url'])) {
            $settings->logo = $validated['logo_url'];
        } elseif ($validated['logo_type'] === 'text' && !empty($validated['logo_text'])) {
            $settings->logo = $validated['logo_text'];
        }

        // Prepare sections (accept JSON string or array)
        $sections = $settings->sections ?? [];

        if ($request->has('sections')) {
            $sectionsInput = $request->input('sections');

            if (is_string($sectionsInput)) {
                $decoded = json_decode($sectionsInput, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $sections = $decoded;
                }
            } elseif (is_array($sectionsInput)) {
                $sections = $sectionsInput;
            }
        }

        // Handle uploaded About image (overrides sections.about.image)
        if ($request->hasFile('about_image')) {
            // delete old about image if it was stored locally
            if (!empty($sections['about']['image']) && !str_starts_with($sections['about']['image'], 'http') && !str_starts_with($sections['about']['image'], '/')) {
                Storage::disk('public')->delete($sections['about']['image']);
            }

            $aboutPath = $request->file('about_image')->store('section_images', 'public');
            $sections['about'] = $sections['about'] ?? [];
            $sections['about']['image'] = $aboutPath;
        }

        $settings->sections = $sections;

        $settings->save();

        return redirect()->back()->with('success', 'Restaurant settings updated successfully!');
    }

    /**
     * Upload a section image (used by the structured editor).
     */
    public function uploadSectionImage(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $path = $request->file('image')->store('section_images', 'public');
        $url = Storage::url($path);

        return response()->json(['path' => $path, 'url' => $url]);
    }

    /**
     * Get default sections structure.
     */
    private function getDefaultSections()
    {
        return [
            'specials' => [
                'heading' => "Today's Specials",
                'title' => "Chef's Recommendations",
                'description' => 'Limited-time offers crafted by our head chef using seasonal ingredients.',
                'items' => [
                    [
                        'icon' => '🍔',
                        'title' => 'The Dola Classic',
                        'desc' => 'Double Angus patty, melted cheddar, caramelized onions, pickles, secret sauce on brioche bun.',
                        'price' => '$14.99',
                        'oldPrice' => '$19.99',
                    ],
                    [
                        'icon' => '🥩',
                        'title' => 'Smoky BBQ Burger',
                        'desc' => 'Smoked beef patty, BBQ sauce, crispy onion rings, pepper jack cheese, jalapeños.',
                        'price' => '$16.99',
                        'oldPrice' => '$22.99',
                    ],
                    [
                        'icon' => '🌿',
                        'title' => 'Garden Veggie Burger',
                        'desc' => 'Plant-based patty, avocado, sprouts, tomato, red onion, herb aioli on whole grain bun.',
                        'price' => '$12.99',
                        'oldPrice' => '$17.99',
                    ],
                ],
            ],
            'about' => [
                'heading' => 'Our Story',
                'title' => 'Crafted With Love Since 2009',
                'text' => 'At Dola Grill House, we believe that a great burger is more than just food — it\'s an experience. We source the finest Angus beef, bake our brioche buns fresh daily, and craft every sauce from scratch.',
                'image' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=700&fit=crop',
                'years' => '15+',
                'features' => [
                    ['icon' => '🥩', 'label' => 'Premium Angus Beef'],
                    ['icon' => '🍞', 'label' => 'Fresh Baked Buns'],
                    ['icon' => '🌿', 'label' => 'Farm Fresh Veggies'],
                    ['icon' => '👨‍🍳', 'label' => 'Expert Chefs'],
                ],
            ],
            'testimonials' => [
                'heading' => 'Testimonials',
                'title' => 'What Our Guests Say',
                'items' => [
                    [
                        'stars' => '⭐⭐⭐⭐⭐',
                        'text' => "The best burger I've ever had! The cheese was perfectly melted and the patty was so juicy. I come here every weekend now.",
                        'name' => 'James Davidson',
                        'role' => 'Food Blogger',
                        'avatar' => 'JD',
                    ],
                    [
                        'stars' => '⭐⭐⭐⭐⭐',
                        'text' => "Amazing atmosphere and even better food. The Dola Classic is out of this world. The staff is incredibly friendly too!",
                        'name' => 'Sarah Mitchell',
                        'role' => 'Regular Customer',
                        'avatar' => 'SM',
                    ],
                    [
                        'stars' => '⭐⭐⭐⭐⭐',
                        'text' => "I've tried burgers all over the city and nothing comes close to Dola Grill House. The quality is consistently outstanding.",
                        'name' => 'Robert Kim',
                        'role' => 'Food Critic',
                        'avatar' => 'RK',
                    ],
                ],
            ],
            'reservation' => [
                'titleSmall' => 'Reservation',
                'titleLarge' => 'Book Your Table Today',
                'text' => 'Reserve your spot at Dola Grill House and enjoy an unforgettable dining experience with family and friends.',
                'info' => [
                    ['icon' => '📍', 'label' => 'Location', 'value' => '123 Grill Street, Food City, FC 10001'],
                    ['icon' => '🕐', 'label' => 'Hours', 'value' => 'Mon–Sun: 11:00 AM – 11:00 PM'],
                    ['icon' => '📞', 'label' => 'Phone', 'value' => '+1 (555) 123-4567'],
                    ['icon' => '✉️', 'label' => 'Email', 'value' => 'hello@dolagrillhouse.com'],
                ],
            ],
        ];
    }
}