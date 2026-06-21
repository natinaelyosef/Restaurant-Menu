<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'status',
        'google_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Helper methods to check user role
    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    public function isStoreOwner()
    {
        return $this->role === 'store_owner';
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isSubAdmin()
    {
        return $this->role === 'sub_admin';
    }

    public function isActive()
    {
        return $this->is_active ?? true;
    }

    // Status helper methods
    public function isSuspended()
    {
        return $this->status === 'suspended';
    }

    public function isBanned()
    {
        return $this->status === 'banned';
    }

    public function isActiveStatus()
    {
        return $this->status === 'active';
    }

    // Get dashboard route based on role
    public function getDashboardRoute()
    {
        return match($this->role) {
            'super_admin' => '/super/dashboard',
            'sub_admin' => '/sub/dashboard',
            'customer' => '/customer/dashboard',
            default => '/customer/dashboard',
        };
    }
}
