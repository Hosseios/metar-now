
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metarnow.app',
  appName: 'metar-now',
  webDir: 'dist',
  server: {
    url: 'https://21123423-1fed-4b7c-aab7-465a7c9d6242.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
