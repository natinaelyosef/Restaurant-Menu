# Restaurant-Menu

A React and Laravel (v12) application for managing a restaurant menu, reservations, and basic restaurant settings. Built with PHP ^8.2, Inertia + React, Tailwind CSS, and Vite. Includes utilities for PDF generation and a simple public view.

**Features**
- **Menu management:** add, edit, and remove menu items (`app/Models/MenuItem.php`).
- **Reservations:** store and manage reservations (`app/Models/Reservation.php`).
- **Restaurant settings:** site-wide settings (`app/Models/RestaurantSetting.php`).
- **Auth:** user authentication scaffolding and routes (`routes/auth.php`).
- **PDF export:** server-side/JS helpers for generating PDFs (`generate_pdf.js`, `pdfkit`).
- **Inertia + React frontend:** modern single-page experience with Vite and Tailwind.

**Requirements**
- PHP ^8.2
- Composer
- Node.js (recommend 18+)
- npm (or pnpm/yarn)
- SQLite, MySQL, or other supported database

## Quick Start
Clone the repo and install dependencies:

```bash
git clone <repo-url> Restaurant-Menu
cd Restaurant-Menu
composer install
```

Create the environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

If using SQLite (convenient for local testing):

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
```

Run migrations and optional seeders:

```bash
php artisan migrate --seed
```

Install JS dependencies and build assets:

```bash
npm install
npm run build   # production
# or for development
npm run dev
```

Start the application (development):

```bash
php artisan serve
```

The app should now be available at `http://127.0.0.1:8000` (or the URL shown by the serve command).

## Useful Composer / NPM Scripts
- `composer run setup` — runs initial composer + artisan + npm setup as defined in `composer.json`.
- `composer test` — run application tests via `php artisan test`.
- `npm run dev` — start Vite dev server.
- `npm run build` — build production assets with Vite.

## Configuration
Edit the `.env` file to configure your database connection, mailer, and other credentials. Typical keys to set:

- `APP_URL`
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`

For local development an SQLite DB is easiest (see Quick Start).

## Testing
Run the test suite with:

```bash
composer test
# or
php artisan test
```

## Important Files
- `artisan` — Laravel CLI entry point
- `composer.json` — PHP deps and scripts
- `package.json` — frontend deps and scripts
- `app/Http/Controllers/` — controllers
- `resources/js/` — Inertia/React frontend
- `resources/views/` — Blade templates
- `generate_pdf.js` — PDF helper script

## Deployment
- Ensure `.env` is configured for production values.
- Run migrations: `php artisan migrate --force`.
- Build assets: `npm run build`.
- Configure a process manager (supervisor) for queues if needed and a proper web server (Apache/Nginx + PHP-FPM).

## Contributing
Contributions are welcome. Please open issues for bugs or feature requests, and submit pull requests for changes.

## License
This project is released under the MIT License (see `composer.json`).

---

If you'd like, I can also add example `.env` notes, update the repo README with badges, or generate a short developer checklist.

---
## Login account and Password

superadmin@example.com    
12345678

subadmin@example.com   
12345678

admin4@gmail.com     
12345678

---

