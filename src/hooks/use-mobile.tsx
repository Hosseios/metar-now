
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check if it's actually a mobile device using user agent
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // If it's a mobile device, always return true regardless of screen size
      if (isMobileDevice) {
        setIsMobile(true);
        return;
      }
      
      // For desktop devices, use screen width
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      checkIsMobile();
    }
    
    mql.addEventListener("change", onChange)
    checkIsMobile();
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
