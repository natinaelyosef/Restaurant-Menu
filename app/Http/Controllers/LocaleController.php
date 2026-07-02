<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;

class LocaleController extends Controller
{
    public function update(Request $request)
    {
        $supported = array_keys(Config::get('locale.supported', ['en']));

        $locale = $request->validate([
            'locale' => ['required', 'string', 'in:' . implode(',', $supported)],
        ])['locale'];

        if (!in_array($locale, $supported, true)) {
            $locale = Config::get('app.locale', 'en');
        }

        $request->session()->put('locale', $locale);
        App::setLocale($locale);

        return redirect()->back();
    }
}
