Init and push helper

This folder contains a PowerShell helper to initialize a git repository, commit, add a remote, and push to GitHub.

Usage

1. Open PowerShell in the project root (e.g., `C:\xampp\htdocs\Restaurant-Menu`).
2. Run:

```powershell
scripts\init_and_push.ps1
```

The script will prompt for missing information such as commit message and remote URL. Requires Git installed and on `PATH`. If you prefer using `gh` (GitHub CLI), create the repository with:

```powershell
gh repo create <YOUR_USER>/<REPO> --public --source=. --remote=origin --push
```
