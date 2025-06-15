
import React from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface DeviceInfoProps {
  className?: string;
}

const DeviceInfo = ({ className }: DeviceInfoProps) => {
  const deviceInfo = useDeviceInfo();

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-400">Device:</span>
        <Badge variant={deviceInfo.type === 'desktop' ? 'default' : 'secondary'}>
          {deviceInfo.type}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-400">OS:</span>
        <Badge variant="outline">{deviceInfo.os}</Badge>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-400">Browser:</span>
        <Badge variant="outline">{deviceInfo.browser}</Badge>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-400">Mobile Interface:</span>
        <Badge variant={deviceInfo.isMobileDevice ? 'destructive' : 'default'}>
          {deviceInfo.isMobileDevice ? 'Yes' : 'No'}
        </Badge>
      </div>
    </div>
  );
};

export default DeviceInfo;
