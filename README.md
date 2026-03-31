# Operon OPS 1.0

## Quick Publish to GitHub Pages (Windows)

### 1) Install prerequisites (PowerShell as Administrator)

```powershell
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```

Close and reopen PowerShell.

### 2) Run publish script

```powershell
cd A:\SS-MES\tantier-mes
powershell -ExecutionPolicy Bypass -File .\scripts\publish-github.ps1
```

The script will ask for:
- GitHub username
- Repository name (example: `tantier-mes`)
- Repo visibility (`public` or `private`)

### 3) Enable Pages in GitHub

In your repo:
- Settings -> Pages
- Source: `GitHub Actions`

The workflow file is already added:
`/.github/workflows/deploy-pages.yml`

After first push, your site URL:
`https://<username>.github.io/<repo-name>/`

## Run full OPS locally

```powershell
cd D:\adrive backup\SS-MES\tantier-mes
npm install
npm run setup
npm start
```

Open: http://localhost:3000

If you are at `D:\adrive backup\SS-MES`, use `npm run install:app` once, then `npm run setup` or `npm start`. Those root scripts now forward into `tantier-mes` automatically.
