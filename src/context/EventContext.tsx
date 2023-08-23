// EventContext.tsx
import { NDKEvent } from '@nostr-dev-kit/ndk';
import React, { createContext, useContext, useState, ReactNode } from 'react';


interface EventContextType {
  event: NDKEvent | null;
  setEvent: (event: NDKEvent | null) => void;
  ndkEvents: NDKEvent[] | null; // Add this line
  setNDKEvents: (events: NDKEvent[] | null) => void; // Add this line
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [event, setEvent] = useState<NDKEvent | null>(null);
  const [ndkEvents, setNDKEvents] = useState<NDKEvent[] | null>(null); // Add this line


  return (
    <EventContext.Provider value={{ event, setEvent, ndkEvents, setNDKEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }

  return context;
};
