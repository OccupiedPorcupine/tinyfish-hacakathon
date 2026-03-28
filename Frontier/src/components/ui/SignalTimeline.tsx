import React from 'react';
import { Card } from './Card';

interface TimelineEvent {
  date: string;
  event: string;
}

export function SignalTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <h3 className="text-lg font-display font-medium text-white mb-6">Market Signal Timeline</h3>
      <div className="relative border-l border-dark-600 ml-3 space-y-8">
        {events.map((item, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[1.35rem] top-1.5 ring-4 ring-dark-800 shadow-[0_0_10px_rgba(20,184,166,0.6)]" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">{item.date}</span>
              <p className="text-gray-300 text-sm">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
