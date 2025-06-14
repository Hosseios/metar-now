
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.211234231fed4b7caab7465a7c9d6242',
  appName: 'metar-now',
  webDir: 'dist',
  server: {
    url: 'https://21123423-1fed-4b7c-aab7-465a7c9d6242.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
