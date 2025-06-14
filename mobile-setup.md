
# Mobile Development Setup Guide

## Phase 1: ✅ Completed in Lovable
- Capacitor dependencies installed
- Configuration file created

## Phase 2: Your Tasks (Local Setup)

### 1. Export and Clone Project
```bash
# Export project to GitHub using Lovable's "Export to Github" button
# Then clone locally:
git clone [your-repo-url]
cd metar-now
npm install
```

### 2. Install Android Studio
- Download Android Studio from https://developer.android.com/studio
- Install Android SDK (API level 33 or higher recommended)
- Set up Android Virtual Device (AVD) if you want to use emulator

### 3. Add Android Platform
```bash
npx cap add android
npx cap update android
```

### 4. Build and Sync
```bash
npm run build
npx cap sync
```

### 5. Open in Android Studio
```bash
npx cap open android
```

## Hot Reload Development
The app is configured to connect to your Lovable development server, so you can:
1. Make changes in Lovable
2. Run `npx cap sync` in your local project
3. The mobile app will automatically reflect the changes

## Troubleshooting
- If you encounter build errors, ensure Android SDK is properly installed
- Make sure you have Java 11 or higher installed
- For physical device testing, enable USB debugging in developer options
