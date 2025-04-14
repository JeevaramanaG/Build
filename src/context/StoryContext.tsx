import React, { createContext, useContext, useState } from 'react';
import { Story, StoryContextType } from '../types';

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);

  const addStory = (newStory: Omit<Story, 'id' | 'createdAt'>) => {
    const story: Story = {
      ...newStory,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setStories((prev) => [...prev, story]);
  };

  return (
    <StoryContext.Provider value={{ stories, addStory }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
}