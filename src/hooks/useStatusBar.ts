
import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const useStatusBar = () => {
  useEffect(() => {
    const setupStatusBar = async () => {
      // Only run on mobile platforms
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      try {
        // Set status bar style to light content (white text/icons)
        // This works well with our dark theme (#1e293b)
        await StatusBar.setStyle({ style: Style.Light });
        
        // Set background color to match our app theme
        await StatusBar.setBackgroundColor({ color: '#1e293b' });
        
        // Show the status bar if it's hidden
        await StatusBar.show();
        
        // Set overlay to false so content doesn't go behind status bar
        await StatusBar.setOverlaysWebView({ overlay: false });
        
        console.log('Status bar configured successfully');
      } catch (error) {
        console.warn('Status bar configuration failed:', error);
      }
    };

    setupStatusBar();
  }, []);

  const hideStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.hide();
      } catch (error) {
        console.warn('Failed to hide status bar:', error);
      }
    }
  };

  const showStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.show();
      } catch (error) {
        console.warn('Failed to show status bar:', error);
      }
    }
  };

  return {
    hideStatusBar,
    showStatusBar
  };
};
