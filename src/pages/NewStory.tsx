import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import type { Selection } from '../types';

const LEVELS = [
  { level: 1, features: 1 },
  { level: 2, features: 7 },
  { level: 3, features: 1 },
];

const COMPONENTS = ['server', 'agent', 'client'] as const;

const dummyTags: Record<string, Record<string, string[]>> = {
  main: {
    server: ['v1.0.0', 'v2.0.0', 'v2.0.1'],
    agent: ['v1.1.0', 'v1.2.0', 'v2.0.0'],
    client: ['v1.0.0', 'v1.0.1', 'v2.0.0'],
  }
};

function getMostStableTag(tags: string[]): string | null {
  if (!tags.length) return null;

  const parsed = tags.map(tag => {
    const match = tag.match(/v(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    const [, major, minor, patch] = match;
    return {
      original: tag,
      major: parseInt(major),
      minor: parseInt(minor),
      patch: parseInt(patch),
    };
  }).filter(Boolean) as { original: string, major: number, minor: number, patch: number }[];

  const sorted = parsed.sort((a, b) => {
    if (a.major !== b.major) return b.major - a.major;
    if (a.minor !== b.minor) return b.minor - a.minor;
    return b.patch - a.patch;
  });

  return sorted[0]?.original || null;
}

function generateBranchInfo(issueName: string) {
  const kebab = (text: string) =>
    text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-');

  const baseBranch = 'main';
  const newBranch = `feature/${kebab(issueName || 'new-issue')}`;

  return { baseBranch, newBranch };
}

export function NewStory() {
  const navigate = useNavigate();
  const { stories, addStory } = useStories();
  const [topic, setTopic] = useState('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [autoBranch, setAutoBranch] = useState<{ newBranch: string; baseBranch: string } | null>(null);

  useEffect(() => {
    if (topic.trim()) {
      setAutoBranch(generateBranchInfo(topic.trim()));
    } else {
      setAutoBranch(null);
    }
  }, [topic]);

  const toggleSelection = (level: number, feature: number, component: Selection['component']) => {
    const existingIndex = selections.findIndex(
      (s) => s.level === level && s.feature === feature && s.component === component
    );

    if (existingIndex >= 0) {
      setSelections(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      setSelections(prev => [...prev, {
        level, feature, component,
        tag: undefined
      }]);
    }
  };

  const isSelected = (level: number, feature: number, component: Selection['component']) => {
    return selections.some(
      (s) => s.level === level && s.feature === feature && s.component === component
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!autoBranch) {
      alert("Please enter a valid issue name");
      return;
    }

    const { newBranch, baseBranch } = autoBranch;
    if (!newBranch || selections.length === 0) return;

    const existingBranches = stories.map((s) => s.topic.split('_')[0]);
    let uniqueBranch = newBranch;
    let counter = 1;
    while (existingBranches.includes(uniqueBranch)) {
      uniqueBranch = `${newBranch}_${counter++}`;
    }

    const createdAt = new Date().toISOString();

    for (const selection of selections) {
      const tags = dummyTags[baseBranch]?.[selection.component] || [];
      const stableTag = getMostStableTag(tags);

      if (!stableTag) {
        alert(`Unable to determine stable tag for ${selection.component}`);
        continue;
      }

      const finalBranch = `${uniqueBranch}_${selection.component}_${stableTag}`;

      addStory({
        topic: finalBranch,
        selections: [selection],
        level: selection.level,
        issueName: topic,
        name: '',
        status: 'Pending',
        component: selection.component,
        branch: finalBranch,
        tag: stableTag,
        userId: "user123",
      });
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="topic" className="block text-xl font-semibold text-gray-800 mb-3">
              📝 Enter Issue Name (any text is fine!)
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full px-4 py-2 text-base rounded-lg border ${topic ? 'border-gray-300' : 'border-red-500'} bg-white shadow focus:outline-none focus:ring-2 ${topic ? 'focus:ring-blue-400 focus:border-blue-500' : 'focus:ring-red-400 focus:border-red-500'} transition duration-150 ease-in-out placeholder-gray-500`}
              placeholder="Example: login issue on dashboard"
              required
            />
          </div>

          <div className="space-y-8">
            {LEVELS.map(({ level, features }) => (
              <div key={level} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-700">Level {level}</h3>
                <div className="grid grid-cols-4 gap-4 font-medium text-gray-600 border-b pb-2">
                  <div>Component</div>
                  {COMPONENTS.map((component) => (
                    <div key={component} className="text-center capitalize">{component}</div>
                  ))}
                </div>

                <div className="space-y-2">
                  {Array.from({ length: features }, (_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-center border-b py-2">
                      <div className="text-gray-700 text-sm font-medium">
                        Feature {i + 1}
                      </div>
                      {COMPONENTS.map((component) => {
                        const selected = isSelected(level, i + 1, component);
                        return (
                          <div key={component} className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleSelection(level, i + 1, component)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!topic || selections.length === 0}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Create Story
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
