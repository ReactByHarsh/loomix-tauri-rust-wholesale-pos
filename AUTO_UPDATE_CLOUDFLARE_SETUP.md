# Loomix Auto-Update Setup

This project now has the app-side wiring for Tauri auto-updates, plus a helper script to generate the `latest.json` file that Tauri expects.

## What Was Implemented

- The Tauri updater plugin is registered in `src-tauri/src/lib.rs`.
- The Tauri process plugin is registered so the app can relaunch itself after an update.
- Updater permissions were added in `src-tauri/capabilities/default.json`.
- `src-tauri/tauri.conf.json` now enables `bundle.createUpdaterArtifacts` and contains an updater configuration block.
- A new React hook at `src/hooks/useAppUpdater.ts` silently checks for updates on app start.
- A new banner component at `src/components/UpdateBanner.tsx` shows update availability, download progress, and restart actions.
- The main layout now renders the banner at the top of the content area.
- A new script at `scripts/generate-updater-json.mjs` generates a Cloudflare-ready `latest.json`.

## Why Your Data Stays Safe

Your main database is stored in the Tauri app data directory, not inside the app bundle.

The code that does this is in `src-tauri/src/db.rs`:

- It uses `app_handle.path().app_data_dir()`
- It creates `loomix.db` inside that directory

That means updates replace the installed app files, but they do not delete the database.

Your Zustand settings store is also persisted separately in web storage through `src/store/useSettingsStore.ts`, so that data also survives updates.

## Important Files You Must Edit

Before real releases, replace the placeholder values in `src-tauri/tauri.conf.json`:

- `plugins.updater.pubkey`
- `plugins.updater.endpoints[0]`

Right now they are intentionally placeholders so the app is not coupled to a fake production endpoint.

## Recommended Cloudflare Architecture

Use this layout:

1. Cloudflare R2 bucket for signed installer artifacts and `.sig` files
2. Cloudflare Pages or the same R2 public bucket for `latest.json`
3. Optional custom domain such as `https://updates.yourdomain.com`

Recommended structure:

```text
updates.yourdomain.com/
  latest.json
  releases/
    0.1.0/
      nsis/Loomix_0.1.0_x64-setup.exe
      nsis/Loomix_0.1.0_x64-setup.exe.sig
```

If you keep the same folder structure as Tauri's bundle output, the helper script can generate correct URLs automatically.

## One-Time Setup

### 1. Generate the updater key pair

Run:

```powershell
npx tauri signer generate -w ~/.tauri/loomix-updater.key
```

This gives you:

- A private key file
- A public key string

Use them like this:

- Put the public key string into `src-tauri/tauri.conf.json`
- Keep the private key secret and never commit it

Example:

```json
"plugins": {
  "updater": {
    "pubkey": "PASTE_PUBLIC_KEY_HERE",
    "endpoints": [
      "https://updates.yourdomain.com/latest.json"
    ],
    "windows": {
      "installMode": "passive"
    }
  }
}
```

### 2. Set the signing environment variables on the release machine

For PowerShell:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content C:\secure\loomix-updater.key -Raw
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = "your-password-if-you-set-one"
```

If your key has no password, leave `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` unset.

### 3. Configure Cloudflare

Create a public R2 bucket or a Cloudflare Pages site to host:

- `latest.json`
- Installer files
- `.sig` files

Set caching carefully:

- `latest.json`: low TTL or bypass cache
- Versioned release files: long cache is fine

## Release Workflow Every Time

### 1. Bump the version

Keep these aligned:

- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`

Example version:

- `0.2.0`

### 2. Build signed release artifacts

Run:

```powershell
npm run build
npx tauri build
```

Because `bundle.createUpdaterArtifacts` is enabled, Tauri will also create updater artifacts and signatures during the build.

### 3. Generate `latest.json`

Use the helper script:

```powershell
npm run updater:json -- --base-url https://updates.yourdomain.com/releases/0.2.0/ --output updater/latest.json --notes-file release-notes.md
```

What this script does:

- Scans `src-tauri/target/release/bundle`
- Finds updater-capable artifacts
- Reads the matching `.sig` files
- Builds the Tauri updater manifest JSON

By default it prefers:

- Windows: NSIS `.exe` over `.msi`
- macOS: `.app.tar.gz`
- Linux: `.AppImage`

If no supported updater artifact is found, the script fails loudly.

### 4. Upload the files to Cloudflare

Upload:

- The generated installer file
- Its `.sig` file
- `latest.json`

Example target:

```text
https://updates.yourdomain.com/latest.json
https://updates.yourdomain.com/releases/0.2.0/nsis/Loomix_0.2.0_x64-setup.exe
https://updates.yourdomain.com/releases/0.2.0/nsis/Loomix_0.2.0_x64-setup.exe.sig
```

### 5. Point `latest.json` at the new release

You can either:

- Replace the root `latest.json` with the newly generated file
- Or serve it through a Worker that always returns the newest manifest

For most setups, replacing the file is enough.

## Example `latest.json`

The generated file will look like this:

```json
{
  "version": "0.2.0",
  "notes": "Release 0.2.0",
  "pub_date": "2026-05-18T12:00:00.000Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "SIGNATURE_CONTENTS",
      "url": "https://updates.yourdomain.com/releases/0.2.0/nsis/Loomix_0.2.0_x64-setup.exe"
    }
  }
}
```

## What the User Experience Now Looks Like

The app now does this:

1. Starts normally
2. Silently checks for updates
3. Shows a banner if a new version exists
4. Downloads and installs when the user clicks `Update now`
5. Prompts for restart when the update is ready

Important note for Windows:

- During install, Windows may close the app as part of the updater flow
- That behavior is normal

## How to Test It Safely

Use this sequence:

1. Build and install `0.1.0`
2. Create and publish `0.2.0` to Cloudflare
3. Launch the installed `0.1.0`
4. Confirm the banner appears
5. Run the update
6. Reopen the app if Windows closes it automatically
7. Confirm the app version is `0.2.0`
8. Confirm the existing data is still present

Test all of these:

- Inventory records
- Transaction history
- Vendor records
- Settings such as store name and printers

## Operational Recommendations

### Keep migrations forward-compatible

Because the database survives updates, schema changes should be additive when possible.

Good pattern:

- Add new columns with defaults
- Avoid destructive migrations unless necessary

Your current database code already follows an additive migration pattern using `ALTER TABLE ... ADD COLUMN`.

### Keep release notes short

The updater banner displays release notes from the manifest, so short user-facing notes work best.

### Use versioned artifact URLs

Do this:

```text
/releases/0.2.0/...
/releases/0.2.1/...
```

Do not overwrite the installer file for an old version.

### Keep `latest.json` lightly cached

This is the one file clients poll to discover a new release.

## Commands You Will Use Most Often

Generate keys:

```powershell
npx tauri signer generate -w ~/.tauri/loomix-updater.key
```

Build frontend:

```powershell
npm run build
```

Build desktop installer:

```powershell
npx tauri build
```

Generate updater manifest:

```powershell
npm run updater:json -- --base-url https://updates.yourdomain.com/releases/0.2.0/ --output updater/latest.json --notes "Bug fixes and inventory improvements"
```

## Final Checklist

Before your first real release, confirm all of these:

- Public updater key is set in `src-tauri/tauri.conf.json`
- Endpoint is set to your real Cloudflare URL
- Private signing key is loaded in environment variables
- `latest.json` is publicly reachable
- Installer and `.sig` file URLs inside `latest.json` are reachable
- Installed old version can see the manifest
- Update completes without touching existing data

## Optional Next Improvement

If you want, the next good enhancement would be a small updater section inside the Settings page with:

- Current app version
- `Check for updates` button
- Last checked timestamp
- Debug info for updater status

That is not required for auto-update to work, but it makes release testing easier.
