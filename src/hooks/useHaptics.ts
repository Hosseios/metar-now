
import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useHaptics = () => {
  const triggerLight = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.warn('Light haptic feedback failed:', error);
    }
  }, []);

  const triggerMedium = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Medium haptic feedback failed:', error);
    }
  }, []);

  const triggerHeavy = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.warn('Heavy haptic feedback failed:', error);
    }
  }, []);

  const triggerNotification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    
    try {
      const notificationType = type === 'success' ? NotificationType.Success : 
                              type === 'warning' ? NotificationType.Warning : 
                              NotificationType.Error;
      await Haptics.notification({ type: notificationType });
    } catch (error) {
      console.warn('Notification haptic feedback failed:', error);
    }
  }, []);

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerNotification
  };
};
