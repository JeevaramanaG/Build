import React, { createContext, useContext, useState } from 'react';
import { Story, StoryContextType } from '../types';

const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Dummy tags to simulate GitLab tags
const dummyTags = ['v1.0.0', 'v1.2.0', 'v2.0.1', 'v2.0.0', 'v3.0.0', 'v3.1.0'];

function parseTag(tag: string) {
  const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    original: tag
  };
}

function getMostStableTag(tags: string[]): string {
  const parsed = tags.map(parseTag).filter(Boolean) as { major: number, minor: number, patch: number, original: string }[];
  const grouped = parsed.reduce((acc, tag) => {
    acc[tag.major] = acc[tag.major] || [];
    acc[tag.major].push(tag);
    return acc;
  }, {} as Record<number, typeof parsed>);

  const highestMajor = Math.max(...Object.keys(grouped).map(Number));
  const lowestPatchTag = grouped[highestMajor].sort((a, b) => a.patch - b.patch)[0];
  return lowestPatchTag.original;
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);

  const getUniqueTopicName = (topic: string): string => {
    const existingTopics = stories.map(s => s.topic);
    let uniqueTopic = topic;
    let counter = 1;
    while (existingTopics.includes(uniqueTopic)) {
      uniqueTopic = `${topic}_${counter++}`;
    }
    return uniqueTopic;
  };

  const generateBranchName = (topic: string, level: number, feature: number, component: string): string => {
    return `${level}_${component}_feature${feature}_${topic.toLowerCase().replace(/\s+/g, '_')}`;
  };

  const addStory = (newStory: Omit<Story, 'id' | 'createdAt' | 'branchStatus'>) => {
    const [baseBranch] = newStory.issueName.split('_');
    const stableTag = getMostStableTag(dummyTags);
    const uniqueTopic = getUniqueTopicName(newStory.topic);

    const story: Story = {
      ...newStory,
      topic: uniqueTopic,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      branchStatus: newStory.selections.map((selection) => ({
        created: true,
        selectedTag: stableTag,
        baseBranch,
        branchName: generateBranchName(
          uniqueTopic,
          selection.level,
          selection.feature,
          selection.component,
      
        )
      }))
    };

    setStories(prev => [...prev, story]);
  };

  const updateBranchStatus = (storyId: string, selectionIndex: number, status: boolean) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const newBranchStatus = [...story.branchStatus];
        newBranchStatus[selectionIndex] = {
          ...newBranchStatus[selectionIndex],
          created: status
        };
        return { ...story, branchStatus: newBranchStatus };
      }
      return story;
    }));
  };

  const updateBranchTag = (storyId: string, selectionIndex: number, tag: string) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const newBranchStatus = [...story.branchStatus];
        newBranchStatus[selectionIndex] = {
          ...newBranchStatus[selectionIndex],
          selectedTag: tag,
          branchName: generateBranchName(
            story.topic,
            story.selections[selectionIndex].level,
            story.selections[selectionIndex].feature,
            story.selections[selectionIndex].component,
          )
        };
        return { ...story, branchStatus: newBranchStatus };
      }
      return story;
    }));
  };

  const updateBranchName = (storyId: string, selectionIndex: number, name: string) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const newBranchStatus = [...story.branchStatus];
        newBranchStatus[selectionIndex] = {
          ...newBranchStatus[selectionIndex],
          branchName: name
        };
        return { ...story, branchStatus: newBranchStatus };
      }
      return story;
    }));
  };

  const updateBaseBranch = (storyId: string, selectionIndex: number, baseBranch: string) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const newBranchStatus = [...story.branchStatus];
        newBranchStatus[selectionIndex] = {
          ...newBranchStatus[selectionIndex],
          baseBranch
        };
        return { ...story, branchStatus: newBranchStatus };
      }
      return story;
    }));
  };

  const deleteBranch = (storyId: string, selectionIndex: number) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const newBranchStatus = [...story.branchStatus];
        newBranchStatus[selectionIndex] = {
          ...newBranchStatus[selectionIndex],
          created: false,
          baseBranch: undefined
        };
        return { ...story, branchStatus: newBranchStatus };
      }
      return story;
    }));
  };
  const removeStory = (storyId: string) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
  };  

  return (
    <StoryContext.Provider value={{
      stories,
      addStory,
      updateBranchStatus,
      updateBranchTag,
      updateBranchName,
      updateBaseBranch,
      deleteBranch,
      removeStory,
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
}
