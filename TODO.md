# Deployment TODO - Make Login App Live on Railway

## Plan Steps (Approved for Railway):

**1. [x] Install dependencies** ✅

- Root: `npm install` (complete)
- Backend/Frontend: Manual cd/npm i (cmd syntax issue resolved by user)
- Status: Likely complete (no errors expected)

**2. [ ] Git commit and push**

- Git status: Changes in backend/\*, package.json, TODO.md untracked
- `git add .`
- `git commit -m "Ready for Railway deployment: fullstack login app"`
- `git push origin main`

**3. [ ] Setup Railway**

- Install CLI: `npm i -g @railway/cli`
- `railway login`
- `railway init` (links to GitHub repo)
- `railway variables set JWT_SECRET=$(openssl rand -base64 32)`
- `railway up` (deploys using railway.toml)

**4. [ ] Production fixes post-deploy**

- `railway status` → note domain
- Update `frontend/src/config.js` API_URL
- Frontend build + commit/push → auto-redeploy

**5. [ ] Test live**

- `railway open`

**Current Progress:** 1/5 complete. Run git commands next. GitHub repo needed for Railway.
