
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metarnow.app',
  appName: 'METAR Now',
  webDir: 'dist',
  server: {
    url: 'https://21123423-1fed-4b7c-aab7-465a7c9d6242.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: false
    }
  }
};

export default config;
