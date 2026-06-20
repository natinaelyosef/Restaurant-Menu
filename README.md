# BestBuy_Book Project

This is a Laravel application for BestBuy Book management.

## Project Structure

```
C:.
├── .editorconfig
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── .styleci.yml
├── artisan
├── CHANGELOG.md
├── composer.json
├── composer.lock
├── directory_structure.txt
├── generate_code_pdf.js
├── jsconfig.json
├── package-lock.json
├── package.json
├── phpunit.xml
├── postcss.config.js
├── project_source_code.pdf
├── README.md
├── server.php
├── tailwind.config.js
├── vite.config.js
├── .github/
│   └── workflows/
│       ├── issues.yml
│       ├── pull-requests.yml
│       ├── tests.yml
│       └── update-changelog.yml
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── ProfileController.php
│   │   │   └── Auth/
│   │   │       ├── AuthenticatedSessionController.php
│   │   │       ├── ConfirmablePasswordController.php
│   │   │       ├── EmailVerificationNotificationController.php
│   │   │       ├── EmailVerificationPromptController.php
│   │   │       ├── NewPasswordController.php
│   │   │       ├── PasswordController.php
│   │   │       ├── PasswordResetLinkController.php
│   │   │       ├── RegisteredUserController.php
│   │   │       └── VerifyEmailController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   │       ├── ProfileUpdateRequest.php
│   │       └── Auth/
│   │           └── LoginRequest.php
│   ├── Models/
│   │   └── User.php
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   ├── app.php
│   ├── providers.php
│   └── cache/
│       ├── .gitignore
│       ├── packages.php
│       └── services.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── services.php
│   └── session.php
├── database/
│   ├── .gitignore
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   └── 2026_03_07_195250_add_role_to_users_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── public/
│   ├── .htaccess
│   ├── favicon.ico
│   ├── hot
│   ├── index.php
│   ├── robots.txt
│   └── build/
│       └── manifest.json
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.jsx
│   │   ├── bootstrap.js
│   │   ├── Components/
│   │   ├── Contexts/
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   └── ...
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── auth.php
│   ├── console.php
│   └── web.php
├── storage/
│   ├── app/
│   │   ├── private/
│   │   └── public/
│   ├── framework/
│   │   ├── cache/
│   │   ├── sessions/
│   │   ├── testing/
│   │   └── views/
│   └── logs/
├── tests/
│   ├── TestCase.php
│   ├── Feature/
│   │   ├── ExampleTest.php
│   │   └── ProfileTest.php
│   └── Unit/
│       └── ExampleTest.php
└── vendor/
    └── ... (Composer dependencies)
```

## Installation

1. Clone the repository
2. Run `composer install`
3. Run `npm install`
4. Copy `.env.example` to `.env` and configure your environment
5. Run `php artisan key:generate`
6. Run `php artisan migrate`
7. Run `npm run dev` for development or `npm run build` for production

## Usage

- Start the development server: `php artisan serve`
- Build assets: `npm run build`
- Run tests: `php artisan test`

## Technologies Used

- Laravel (PHP Framework)
- React (Frontend Framework)
- Inertia.js (SPA Framework)
- Tailwind CSS (Styling)
- Vite (Build Tool)

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
"# restaurant-menu" 
"# Restaurant-Menu" 
