import * as React from 'react';

interface TimelineItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  isLast?: boolean;
}

export const TimelineItem = ({ icon, children, isLast = false }: TimelineItemProps) => (
  <div className="relative flex items-start gap-6">
    <div className="flex flex-col items-center">
      <div className="bg-background border rounded-full h-8 w-8 flex items-center justify-center z-10">
        {icon}
      </div>
      {!isLast && <div className="w-px h-full bg-border -mt-1" />}
    </div>
    <div className="pt-1.5 pb-8 w-full">{children}</div>
  </div>
);
