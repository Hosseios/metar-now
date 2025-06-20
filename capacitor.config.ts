
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metarnow.app',
  appName: 'METAR Now',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://21123423-1fed-4b7c-aab7-465a7c9d6242.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#1e293b",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#1e293b"
    }
  }
};

export default config;
