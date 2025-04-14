export interface Story {
  id: string;
  topic: string;
  selections: Selection[];
  createdAt: Date;
}

export interface Selection {
  level: number;
  feature: number;
  component: 'server' | 'agent' | 'client';
}

export interface StoryContextType {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => void;
}