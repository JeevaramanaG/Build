import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import { Selection } from '../types';

const LEVELS = [
  { level: 1, features: 1 },
  { level: 2, features: 7 },
  { level: 3, features: 1 },
];

const COMPONENTS = ['server', 'agent', 'client'] as const;

// Dummy tag data
const dummyTags: Record<string, string[]> = {
  main: ['v1.0.0', 'v1.0.1', 'v2.0.0', 'v2.0.1'],
  dev: ['v0.1.0', 'v0.2.0'],
};

function getMostStableTag(tags: string[]): string | null {
  if (!tags.length) return null;

  const parsed = tags.map(tag => {
    const [_, major, minor, patch] = tag.match(/v(\d+)\.(\d+)\.(\d+)/) || [];
    return {
      original: tag,
      major: parseInt(major),
      minor: parseInt(minor),
      patch: parseInt(patch),
    };
  });

  const sorted = parsed
    .filter(Boolean)
    .sort((a, b) => {
      if (a.major !== b.major) return b.major - a.major;
      if (a.minor !== b.minor) return a.minor - b.minor;
      return a.patch - b.patch; // lower patch preferred
    });

  return sorted[0]?.original || null;
}

export function NewStory() {
  const navigate = useNavigate();
  const { stories, addStory } = useStories();
  const [topic, setTopic] = useState('');
  const [selections, setSelections] = useState<Selection[]>([]);

  const toggleSelection = (level: number, feature: number, component: Selection['component']) => {
    const existingIndex = selections.findIndex(
      (s) => s.level === level && s.feature === feature && s.component === component
    );

    if (existingIndex >= 0) {
      setSelections(selections.filter((_, i) => i !== existingIndex));
    } else {
      setSelections([...selections, { level, feature, component }]);
    }
  };

  const isSelected = (level: number, feature: number, component: Selection['component']) => {
    return selections.some(
      (s) => s.level === level && s.feature === feature && s.component === component
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^_]+_[^_]+$/.test(topic)) {
      alert("Format must be: newbranch_basebranch");
      return;
    }

    const [newBranch, baseBranch] = topic.split('_');
    if (!newBranch || !baseBranch || selections.length === 0) return;

    if (!dummyTags[baseBranch]) {
      alert(`Base branch "${baseBranch}" not found.`);
      return;
    }

    const tags = dummyTags[baseBranch];
    const stableTag = getMostStableTag(tags);
    if (!stableTag) {
      alert('Unable to determine the most stable tag.');
      return;
    }

    // Handle duplicate new branch names
    let uniqueBranch = newBranch;
    let counter = 1;
    const baseBranches = stories.map((s) => s.topic.split('_')[0]);
    while (baseBranches.includes(uniqueBranch)) {
      uniqueBranch = `${newBranch}_${counter++}`;
    }

    const finalBranch = `${uniqueBranch}_${stableTag}`;
    const finalTopic = `${uniqueBranch}_${baseBranch}`;

    console.log(`🚀 Creating branch: ${finalBranch} from base branch: ${baseBranch} with tag: ${stableTag}`);

    addStory({
      topic: finalTopic, selections,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="topic" className="block text-xl font-semibold text-gray-800 mb-3">
              📝 Enter Issue Name (format: newbranch_basebranch)
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full px-4 py-2 text-base rounded-lg border ${
                /^[^_]+_[^_]+$/.test(topic) ? 'border-gray-300' : 'border-red-500'
              } bg-white shadow focus:outline-none focus:ring-2 ${
                /^[^_]+_[^_]+$/.test(topic) ? 'focus:ring-blue-400 focus:border-blue-500' : 'focus:ring-red-400 focus:border-red-500'
              } transition duration-150 ease-in-out placeholder-gray-500`}
              placeholder="Example: loginfeature_main"
              required
            />
            {topic && (
              <>
                {!/^[^_]+_[^_]+$/.test(topic) ? (
                  <p className="text-sm text-red-600 mt-2">
                    ❌ Format must be like: <code>newbranch_basebranch</code>
                  </p>
                ) : (
                  <div className="mt-2 text-sm text-green-700">
                    ✅ <strong>New Branch:</strong> {topic.split('_')[0]}<br />
                    ✅ <strong>Base Branch:</strong> {topic.split('_')[1]}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Component Table */}
          <div className="space-y-8">
            {LEVELS.map(({ level, features }) => (
              <div key={level} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-700">Level {level}</h3>

                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 font-medium text-gray-600 border-b pb-2">
                  <div>Component</div>
                  {COMPONENTS.map((component) => (
                    <div key={component} className="text-center capitalize">{component}</div>
                  ))}
                </div>

                {/* Features Grid */}
                <div className="space-y-2">
                  {Array.from({ length: features }, (_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-center border-b py-2">
                      <div className="text-gray-700 text-sm font-medium">
                        Feature {i + 1}
                      </div>
                      {COMPONENTS.map((component) => (
                        <div key={component} className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected(level, i + 1, component)}
                            onChange={() => toggleSelection(level, i + 1, component)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
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
