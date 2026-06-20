# Initialize and push this project to GitHub
# Usage: Open PowerShell in the project root and run this script.

function Write-Err { param($m) Write-Host $m -ForegroundColor Red }
function Write-Ok  { param($m) Write-Host $m -ForegroundColor Green }

Write-Host "Working directory: $(Get-Location)"

# Check for git
& git --version > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Git not found. Install Git from https://git-scm.com/download/win and re-run this script."
    exit 1
}
Write-Ok "Git detected."

# Are we inside a git repo?
$inside = & git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -eq 0 -and $inside -eq 'true') {
    Write-Host "Repository already initialized."
} else {
    $confirm = Read-Host "Initialize a new Git repository here? (Y/N)"
    if ($confirm -match '^[Yy]') {
        git init
        git checkout -b main 2>$null
        Write-Ok "Initialized repository and switched to 'main' branch."
    } else {
        Write-Err "Initialization canceled."
        exit 1
    }
}

# Stage all changes
git add .
$changes = & git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "No changes to commit."
} else {
    $commitMessage = Read-Host "Commit message (default: Initial commit)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) { $commitMessage = 'Initial commit' }

    $userName = (& git config user.name)
    $userEmail = (& git config user.email)
    if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
        Write-Host "Git user name/email are not configured for commits."
        $setLocal = Read-Host "Set local user.name/user.email for this repo now? (Y/N)"
        if ($setLocal -match '^[Yy]') {
            if ([string]::IsNullOrWhiteSpace($userName)) {
                $userName = Read-Host "Enter name (e.g. 'Your Name')"
                git config user.name "$userName"
            }
            if ([string]::IsNullOrWhiteSpace($userEmail)) {
                $userEmail = Read-Host "Enter email (e.g. you@example.com)"
                git config user.email "$userEmail"
            }
            Write-Ok "Configured local user.name and user.email."
        } else {
            Write-Err "Commit aborted. Configure Git user identity or set local values to continue."
            exit 1
        }
    }

    git commit -m "$commitMessage"
    if ($LASTEXITCODE -eq 0) { Write-Ok "Committed changes." } else { Write-Err "Commit failed."; exit 1 }
}

# Remote handling
$existingRemote = (& git remote get-url origin 2>$null)
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote 'origin' already set to: $existingRemote"
    $choice = Read-Host "Use existing remote? (Y to use / R to replace / S to skip push)"
    if ($choice -match '^[Ss]') { Write-Host "Skipping push."; exit 0 }
    if ($choice -match '^[Rr]') {
        $newUrl = Read-Host "Enter new remote URL (HTTPS/SSH)"
        if (-not [string]::IsNullOrWhiteSpace($newUrl)) {
            git remote remove origin
            git remote add origin $newUrl
            Write-Ok "Replaced origin remote."
        } else { Write-Err "No URL provided. Aborting."; exit 1 }
    }
} else {
    $remoteUrl = Read-Host "Enter Git remote URL to add as 'origin' (leave empty to skip)"
    if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        git remote add origin $remoteUrl
        Write-Ok "Added remote 'origin'."
    } else {
        Write-Host "No remote added. You can add one later with 'git remote add origin <url>'."
        exit 0
    }
}

# Push
Write-Host "Pushing 'main' to remote 'origin'..."
git push -u origin main
if ($LASTEXITCODE -eq 0) { Write-Ok "Push successful." } else { Write-Err "Push failed. Check remote, network, or credentials and try again."; exit 1 }
