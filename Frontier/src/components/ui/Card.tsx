import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function Card({ children, className = '', gradient = false, ...props }: CardProps) {
  return (
    <div 
      className={`glass-panel p-6 ${gradient ? 'relative overflow-hidden' : ''} ${className}`}
      {...props}
    >
      {gradient && (
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
