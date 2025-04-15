export interface BranchStatus {
  created: boolean;
  selectedTag: string;
  branchName: string;
  baseBranch?: string;
}

export interface Selection {
  level: number;
  feature: number;
  component: string;
}

export interface Story {
  id: string;
  topic: string;
  issueName: string;
  createdAt: Date;
  selections: Selection[];
  branchStatus: BranchStatus[];
}

export interface StoryContextType {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'branchStatus'>) => void;
  updateBranchStatus: (storyId: string, selectionIndex: number, status: boolean) => void;
  updateBranchTag: (storyId: string, selectionIndex: number, tag: string) => void;
  updateBranchName: (storyId: string, selectionIndex: number, name: string) => void;
  updateBaseBranch: (storyId: string, selectionIndex: number, baseBranch: string) => void;
  deleteBranch: (storyId: string, selectionIndex: number) => void;
  removeStory: (storyId: string) => void;
}






