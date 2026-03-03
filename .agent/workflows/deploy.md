---
description: how to deploy InjectorIndex to production
---

# Deploy InjectorIndex to Production

## Pre-Deploy Checklist
// turbo-all

1. Verify you're in the correct project directory:
```powershell
Get-Location
# Should be: c:\Users\uriel\.gemini\antigravity\playground\fiery-cosmos
```

2. Verify git remote points to the correct repo:
```powershell
git remote -v
# Should show: origin  https://github.com/johnlinneman78/botox4u (fetch/push)
```

3. Verify Vercel project config:
```powershell
Get-Content .vercel\project.json
# Should contain: "projectName":"injectorindex"
# Project ID: prj_dhhPDqn6alh3lWBvmkxRGZyzPmsB
```

4. Run a local build to catch errors BEFORE pushing:
```powershell
npx next build 2>&1 | Tee-Object -FilePath build_current.txt; if ($LASTEXITCODE -ne 0) { Write-Host "BUILD FAILED - DO NOT PUSH" -ForegroundColor Red } else { Write-Host "BUILD PASSED" -ForegroundColor Green }
```

5. If build passes, stage and commit all changes:
```powershell
git add -A
git status --short
git commit -m "feat: description of changes"
```

6. Push to trigger Vercel deploy:
```powershell
git push origin main
```

7. Wait 60-90 seconds for Vercel to build, then verify:
```powershell
Start-Sleep -Seconds 90
# Then open https://www.injectorindex.com in browser to verify
```

8. If the site hasn't updated after 2 minutes, force deploy via CLI:
```powershell
npx vercel --prod --yes
```

9. Update AGENT_STATE.md with the new commit hash and deploy date.

## Troubleshooting

### Build fails locally
- Fix all TypeScript/build errors before pushing
- Common issue: missing imports, undefined variables, type errors

### Vercel deploy doesn't trigger
- Check that `main` branch pushed successfully: `git log --oneline -1`
- Force deploy: `npx vercel --prod --yes`
- Check Vercel dashboard (if logged in): https://vercel.com/john-linnemans-projects/injectorindex

### Live site shows old version
- Hard refresh: Ctrl+Shift+R
- Add `?nocache=true` to URL
- Check if Vercel is still building
- Force deploy: `npx vercel --prod --yes`

### Deploy goes to wrong project
- STOP. Check `.vercel/project.json` — must say `injectorindex`
- The ONLY Vercel project is `injectorindex`. No other projects exist.
