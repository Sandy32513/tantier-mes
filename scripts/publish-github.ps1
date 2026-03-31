param(
  [string]$ProjectPath = "A:\SS-MES\tantier-mes"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ProjectPath)) {
  throw "Project path not found: $ProjectPath"
}

$gitCmd = "git"
$ghCmd = "gh"

if (-not (Get-Command $gitCmd -ErrorAction SilentlyContinue)) {
  throw "Git is not installed. Install with: winget install --id Git.Git -e --source winget"
}

if (-not (Get-Command $ghCmd -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is not installed. Install with: winget install --id GitHub.cli -e --source winget"
}

Set-Location $ProjectPath

if (-not (Test-Path ".git")) {
  git init | Out-Null
}

$userName = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (example: tantier-mes)"
$visibility = Read-Host "Repo visibility: public or private"
if ($visibility -ne "public" -and $visibility -ne "private") {
  throw "Visibility must be public or private"
}

if (-not (git config user.name)) {
  $localName = Read-Host "Git user.name (example: Santhosh)"
  git config user.name "$localName"
}

if (-not (git config user.email)) {
  $localEmail = Read-Host "Git user.email (example: you@example.com)"
  git config user.email "$localEmail"
}

$null = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  gh auth login
}

git add .

$hasCommit = $true
try { git rev-parse --verify HEAD *> $null } catch { $hasCommit = $false }

if (-not $hasCommit) {
  git commit -m "Initial commit: Operon OPS 1.0 with GitHub Pages" | Out-Null
} else {
  $changes = git status --porcelain
  if ($changes) {
    git commit -m "Update Operon OPS 1.0" | Out-Null
  }
}

$null = gh repo view "$userName/$repoName" 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create "$userName/$repoName" --$visibility --source . --remote origin --push
} else {
  git branch -M main
  if (-not (git remote get-url origin 2>$null)) {
    git remote add origin "https://github.com/$userName/$repoName.git"
  }
  git push -u origin main
}

Write-Host ""
Write-Host "Repository ready: https://github.com/$userName/$repoName"
Write-Host "Now enable Pages: Settings -> Pages -> Source: GitHub Actions"
Write-Host "After workflow finishes, site URL: https://$userName.github.io/$repoName/"
