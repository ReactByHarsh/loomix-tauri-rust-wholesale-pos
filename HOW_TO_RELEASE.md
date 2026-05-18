# How to Release a New Update for Loomix

This guide covers the exact steps you need to follow every time you want to publish a new version of the Loomix app to your users.

---

## Step 1: Bump the Version Number

You must update the version number in exactly **three files**. Make sure they all match perfectly. 
For example, if you are updating from `0.1.0` to `0.2.0`, change the version to `"0.2.0"` in:

1. `package.json`
2. `src-tauri/Cargo.toml`
3. `src-tauri/tauri.conf.json`

---

## Step 2: Build the Signed Release

Open **PowerShell** at the root of your project (`D:\RustSoftwaresOnly\ClothingSoftwareRust`) and run this exact command to load your private key and start the build:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content "$env:USERPROFILE\.tauri\loomix-updater.key" -Raw; npx tauri build
```

> ⏱️ *Wait for the build to finish. It will generate the installer (`.exe`) and the signature (`.sig`) files.*

---

## Step 3: Generate the `latest.json` Manifest

Run the following command. **Important:** Replace `0.2.0` with your *actual new version number* in the URL, and update the `--notes` string to describe your changes!

```powershell
npm run updater:json -- --base-url "https://pub-01cd1bbe8d8646d18ad3568dd4b68027.r2.dev/releases/0.2.0/" --output updater/latest.json --notes "Bug fixes and performance improvements"
```

---

## Step 4: Upload to Cloudflare R2

Run these three `wrangler` commands one by one to upload the files to your public R2 bucket. 
**Important:** Be sure to replace `0.2.0` with your *actual new version number* in the paths!

**1. Upload the manifest (latest.json)**
```powershell
npx wrangler r2 object put loomix-updates/latest.json --file updater/latest.json --remote
```

**2. Upload the installer (.exe)**
```powershell
npx wrangler r2 object put "loomix-updates/releases/0.2.0/nsis/loomix_0.2.0_x64-setup.exe" --file "src-tauri/target/release/bundle/nsis/loomix_0.2.0_x64-setup.exe" --remote
```

**3. Upload the signature (.sig)**
```powershell
npx wrangler r2 object put "loomix-updates/releases/0.2.0/nsis/loomix_0.2.0_x64-setup.exe.sig" --file "src-tauri/target/release/bundle/nsis/loomix_0.2.0_x64-setup.exe.sig" --remote
```

---

## Step 5: Test the Update!

1. Open your locally installed version of Loomix (the older version).
2. You will either see the update banner appear automatically, or you can go to **Settings** and click **Check for updates**.
3. Click **Update now**! The app will download the update you just pushed to Cloudflare and install it seamlessly.
