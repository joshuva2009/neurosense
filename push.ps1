# Push NeuroSense to GitHub
param(
    [string]$RepoUrl = "https://github.com/artbyjazi/neurosense.git"
)

Write-Host "Configuring remote origin: $RepoUrl" -ForegroundColor Cyan
git remote set-url origin $RepoUrl

Write-Host "Pushing branch 'main' to GitHub..." -ForegroundColor Green
git push -u origin main
