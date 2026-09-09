# Conference Scheduler

`index.html` works on its own (saves to that browser only, via localStorage).
With the included `api/state.js` + a Vercel KV database connected, it syncs
across every browser and device automatically — that's the setup below.

## Deploy with cross-device sync (Vercel + KV)

This needs a real Vercel *project* (not drag-and-drop), because it has to
install a dependency and run a serverless function.

**1. Get the code into a GitHub repo**
```
git init
git add .
git commit -m "Conference scheduler"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

**2. Import it into Vercel**
- Go to https://vercel.com/new
- Click "Import Project" and pick your new repo
- Leave build settings on their defaults (it's auto-detected) and click Deploy

**3. Add a KV database and connect it**
- In your Vercel project, open the **Storage** tab
- Click **Create Database → KV** (the free tier is plenty for this)
- On the "Connect to Project" step, connect it to this project — Vercel
  automatically adds the needed environment variables for you
- Go to **Deployments** and redeploy once (so the app picks up those new
  environment variables)

That's it — open the deployed link on any device, and it'll sync. The little
badge under the header will say "Synced across devices ✓" once it's working.

## If you skip the KV setup

The app still works fine — it just falls back to saving in that one browser
only (the badge will say "Saved on this device only"). Everything else
(preferences, formats, backups) behaves the same either way.

## Deploy without sync (simplest, drag-and-drop)

If you don't need cross-device sync, you can ignore `api/` and `package.json`
entirely and just drag `index.html` onto https://vercel.com/new, or push it
alone to a repo and turn on GitHub Pages in Settings → Pages.

## Backups

Regardless of sync setup, "Download backup" saves everything (roster,
preferences, settings) to a `.json` file, and "Restore backup" loads one back
in — handy before clearing browser data or if you ever want to move things
manually.
