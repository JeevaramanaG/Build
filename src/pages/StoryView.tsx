import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import { Copy } from 'lucide-react';

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { stories } = useStories();
  const story = stories.find((s) => s.id === id);

  if (!story) {
    return <div>Story not found</div>;
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const getBranchName = (level: number, feature: number, component: string) => {
    return `level${level}_${component}_feature${feature}_${story.topic.toLowerCase().replace(/\s+/g, '_')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">{story.topic}</h1>
          
          <div className="space-y-8">
            {story.selections.map((selection, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      Level {selection.level} / Feature {selection.feature} / {selection.component}
                    </h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getBranchName(selection.level, selection.feature, selection.component))}
                    className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy branch name</span>
                  </button>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {getBranchName(selection.level, selection.feature, selection.component)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}