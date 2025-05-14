
import React from 'react';
import { cn } from '@/lib/utils';

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
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full";
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };
  
  const statusClasses = {
    awake: "bg-green-100 text-green-800 border border-green-200",
    drowsy: "bg-amber-100 text-amber-800 border border-amber-200",
    sleeping: "bg-red-100 text-red-800 border border-red-200",
  };
  
  const pulseClass = pulsing ? "animate-pulse" : "";
  
  return (
    <span className={cn(
      baseClasses,
      sizeClasses[size],
      statusClasses[status],
      pulseClass,
      className
    )}>
      <span className={cn(
        "w-2 h-2 rounded-full mr-1.5",
        status === 'awake' && "bg-green-500",
        status === 'drowsy' && "bg-amber-500",
        status === 'sleeping' && "bg-red-500"
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
