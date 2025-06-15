
import * as React from "react"
import { Capacitor } from '@capacitor/core'
import { detectDevice } from '@/utils/deviceDetection'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // If running in Capacitor (APK/native app), always use mobile interface
    if (Capacitor.isNativePlatform()) {
      setIsMobile(true)
      return
    }

    // Use device detection based on user-agent
    const deviceInfo = detectDevice()
    console.log('Device detection:', deviceInfo)
    
    // Use mobile interface for both mobile phones and tablets
    setIsMobile(deviceInfo.isMobileDevice)
  }, [])

  return !!isMobile
}

/**
 * Hook to get detailed device information
 */
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = React.useState(() => detectDevice())

  React.useEffect(() => {
    // Update device info on mount (in case user-agent changes)
    const info = detectDevice()
    setDeviceInfo(info)
    console.log('Device info:', info)
  }, [])

  return deviceInfo
}
