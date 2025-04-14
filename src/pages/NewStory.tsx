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

export function NewStory() {
  const navigate = useNavigate();
  const { addStory } = useStories();
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
    if (!topic || selections.length === 0) return;

    addStory({ topic, selections });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 bg-white p-6 rounded-lg shadow-md">
          {/* Topic Input */}
          
            <div>
              <label htmlFor="topic" className="block text-xl font-semibold text-gray-800 mb-3">
                📝 Enter issue Name
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 text-base rounded-lg border border-gray-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500 hover:border-blue-400"
                placeholder="Enter the issue to fix"
                required
              />
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
