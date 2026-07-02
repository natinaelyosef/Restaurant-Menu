<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleControllerTest extends TestCase
{
    public function test_inertia_locale_change_returns_redirect_response(): void
    {
        $response = $this->withSession(['locale' => 'en'])
            ->post('/locale', ['locale' => 'am'], ['X-Inertia' => 'true']);

        $response->assertStatus(302);
        $this->assertEquals('am', session('locale'));
    }
}
