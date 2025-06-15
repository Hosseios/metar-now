
/**
 * Device detection utility using user-agent strings
 * Distinguishes between mobile phones, tablets, and desktop devices
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  isMobileDevice: boolean; // true for both mobile and tablet
  os: string;
  browser: string;
}

/**
 * Detects device type based on user-agent string
 */
export const detectDevice = (userAgent?: string): DeviceInfo => {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  
  // Mobile phone patterns
  const mobilePatterns = [
    /Android.*Mobile/i,
    /iPhone/i,
    /iPod/i,
    /BlackBerry/i,
    /BB10/i,
    /Windows Phone/i,
    /Opera Mini/i,
    /Opera Mobi/i,
    /Mobile.*Firefox/i,
    /Mobile.*Safari/i
  ];

  // Tablet patterns (includes iPad and Android tablets)
  const tabletPatterns = [
    /iPad/i,
    /Android(?!.*Mobile)/i, // Android without "Mobile" indicates tablet
    /Tablet/i,
    /PlayBook/i,
    /Kindle/i,
    /Silk/i,
    /GT-P\d{4}/i, // Samsung Galaxy Tab
    /SM-T\d{3}/i, // Samsung Galaxy Tab
    /KFAPWI|KFARWI|KFASWI|KFFOWI|KFJWI|KFMEWI|KFOT|KFTT|KFTBWI|KFTHWI|KFAPWA|KFAPWI/i // Amazon devices
  ];

  // OS detection
  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser detection
  let browser = 'Unknown';
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge/i.test(ua)) browser = 'Edge';
  else if (/Opera/i.test(ua)) browser = 'Opera';

  // Check for mobile first
  const isMobile = mobilePatterns.some(pattern => pattern.test(ua));
  if (isMobile) {
    return {
      type: 'mobile',
      isMobileDevice: true,
      os,
      browser
    };
  }

  // Check for tablet
  const isTablet = tabletPatterns.some(pattern => pattern.test(ua));
  if (isTablet) {
    return {
      type: 'tablet',
      isMobileDevice: true,
      os,
      browser
    };
  }

  // Default to desktop
  return {
    type: 'desktop',
    isMobileDevice: false,
    os,
    browser
  };
};

/**
 * Simple function to check if device should use mobile interface
 */
export const shouldUseMobileInterface = (userAgent?: string): boolean => {
  const deviceInfo = detectDevice(userAgent);
  return deviceInfo.isMobileDevice;
};
