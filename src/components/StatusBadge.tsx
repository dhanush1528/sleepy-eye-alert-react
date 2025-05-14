
import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, AlertTriangle, Sleep } from 'lucide-react';

type StatusType = 'awake' | 'drowsy' | 'sleeping';

interface StatusBadgeProps {
  status: StatusType;
  pulsing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  pulsing = false,
  size = 'md',
  className
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300";
  
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  
  const statusClasses = {
    awake: "status-awake",
    drowsy: "status-drowsy",
    sleeping: "status-sleeping",
  };
  
  const pulseClass = pulsing ? "animate-pulse-alert" : "";
  
  const iconMap = {
    awake: <Eye className="mr-1.5" size={size === 'lg' ? 18 : size === 'md' ? 16 : 14} />,
    drowsy: <AlertTriangle className="mr-1.5" size={size === 'lg' ? 18 : size === 'md' ? 16 : 14} />,
    sleeping: <Sleep className="mr-1.5" size={size === 'lg' ? 18 : size === 'md' ? 16 : 14} />,
  };
  
  return (
    <span className={cn(
      baseClasses,
      sizeClasses[size],
      statusClasses[status],
      pulseClass,
      className
    )}>
      {iconMap[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
