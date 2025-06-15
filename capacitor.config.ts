
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metarnow.app',
  appName: 'METAR Now',
  webDir: 'dist',
  // Remove the server configuration to make it standalone
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
