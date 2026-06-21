param(
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$deployRoot = Join-Path $root 'deploy_infinityfree'
$htdocs = Join-Path $deployRoot 'htdocs'
$laravel = Join-Path $htdocs 'laravel'

function Invoke-Robocopy {
    param(
        [string]$Source,
        [string]$Destination,
        [string[]]$ExtraArgs = @()
    )

    & robocopy $Source $Destination /E /NFL /NDL /NJH /NJS /NP @ExtraArgs
    if ($LASTEXITCODE -gt 7) {
        throw "Robocopy failed copying $Source to $Destination with exit code $LASTEXITCODE"
    }
}

function Get-EnvValue {
    param([string]$Name)

    $envPath = Join-Path $root '.env'
    if (-not (Test-Path $envPath)) {
        return ''
    }

    $line = Get-Content $envPath | Where-Object { $_ -match "^$([regex]::Escape($Name))=" } | Select-Object -First 1
    if (-not $line) {
        return ''
    }

    return ($line -replace "^$([regex]::Escape($Name))=", '').Trim()
}

if (-not $SkipBuild) {
    Push-Location $root
    try {
        npm run build
    }
    finally {
        Pop-Location
    }
}

if (Test-Path $deployRoot) {
    $resolvedDeployRoot = (Resolve-Path $deployRoot).Path
    $resolvedRoot = (Resolve-Path $root).Path
    if (-not $resolvedDeployRoot.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove unexpected path: $resolvedDeployRoot"
    }
    Remove-Item -LiteralPath $deployRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $htdocs, $laravel | Out-Null

Invoke-Robocopy (Join-Path $root 'public') $htdocs @('/XD', 'storage', '/XF', 'hot')

$appDirectories = @(
    'app',
    'bootstrap',
    'config',
    'database',
    'resources',
    'routes',
    'storage',
    'vendor'
)

foreach ($directory in $appDirectories) {
    Invoke-Robocopy (Join-Path $root $directory) (Join-Path $laravel $directory)
}

$rootFiles = @(
    'artisan',
    'composer.json',
    'composer.lock'
)

foreach ($file in $rootFiles) {
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $laravel $file) -Force
}

Invoke-Robocopy (Join-Path $root 'storage\app\public') (Join-Path $htdocs 'storage')

$runtimeDirs = @(
    'storage\framework\cache\data',
    'storage\framework\sessions',
    'storage\framework\views',
    'storage\framework\testing',
    'storage\logs'
)

foreach ($directory in $runtimeDirs) {
    New-Item -ItemType Directory -Force -Path (Join-Path $laravel $directory) | Out-Null
}

$appKey = Get-EnvValue 'APP_KEY'
if (-not $appKey) {
    $appKey = 'base64:PASTE_YOUR_APP_KEY_HERE'
}

@"
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists(`$maintenance = __DIR__.'/laravel/storage/framework/maintenance.php')) {
    require `$maintenance;
}

require __DIR__.'/laravel/vendor/autoload.php';

/** @var Application `$app */
`$app = require_once __DIR__.'/laravel/bootstrap/app.php';
`$app->usePublicPath(__DIR__);

`$app->handleRequest(Request::capture());
"@ | Set-Content -Path (Join-Path $htdocs 'index.php') -Encoding ASCII

@"
<IfModule mod_authz_core.c>
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    Deny from all
</IfModule>
"@ | Set-Content -Path (Join-Path $laravel '.htaccess') -Encoding ASCII

@"
APP_NAME="Restaurant Menu"
APP_ENV=production
APP_KEY=$appKey
APP_DEBUG=false
APP_URL=https://restaurant-menu.kesug.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12

LOG_CHANNEL=single
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=sql312.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42234943_restaurantdb
DB_USERNAME=if0_42234943
DB_PASSWORD=Naty47Naty

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
CACHE_STORE=file

MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="`${APP_NAME}"

VITE_APP_NAME="`${APP_NAME}"

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=
"@ | Set-Content -Path (Join-Path $laravel '.env') -Encoding ASCII

@"
# InfinityFree Deployment

Upload the contents of this `htdocs` folder into the InfinityFree `htdocs` directory.

Keep this structure:

```text
htdocs/
  index.php
  .htaccess
  build/
  storage/
  laravel/
    app/
    bootstrap/
    config/
    database/
    resources/
    routes/
    storage/
    vendor/
    .env
```

After uploading:

1. Edit `htdocs/laravel/.env`.
2. Set `APP_URL` to your real InfinityFree domain.
3. Replace `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` with the MySQL details from your InfinityFree control panel.
4. Export your local database from phpMyAdmin and import it into the InfinityFree database.
5. Do not upload `node_modules`, `.git`, or the root development files.

The `laravel/.htaccess` file blocks direct browser access to the application source files.
"@ | Set-Content -Path (Join-Path $deployRoot 'README.md') -Encoding UTF8

Write-Host "InfinityFree deploy folder created at: $deployRoot"
