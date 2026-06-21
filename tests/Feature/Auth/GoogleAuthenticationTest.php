<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Tests\TestCase;
use Mockery;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_works(): void
    {
        $response = $this->get('/auth/google');
        $response->assertRedirect();
        $this->assertStringContainsString('accounts.google.com', $response->getTargetUrl());
    }

    public function test_google_callback_creates_user_and_logs_in(): void
    {
        Mail::fake();

        $googleUserMock = Mockery::mock('Laravel\Socialite\Two\User');
        $googleUserMock->shouldReceive('getId')->andReturn('1234567890');
        $googleUserMock->shouldReceive('getName')->andReturn('Google User');
        $googleUserMock->shouldReceive('getEmail')->andReturn('googleuser@gmail.com');

        $providerMock = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $providerMock->shouldReceive('user')->andReturn($googleUserMock);

        Socialite::shouldReceive('driver')->with('google')->andReturn($providerMock);

        $response = $this->get('/auth/google/callback');

        $this->assertAuthenticated();
        
        $user = User::where('email', 'googleuser@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('1234567890', $user->google_id);
        $this->assertEquals('customer', $user->role);

        $response->assertRedirect('/customer/dashboard');

        // Check if welcome mail was sent
        Mail::assertSent(\App\Mail\WelcomeUserMail::class);
    }
}
