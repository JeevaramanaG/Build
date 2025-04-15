import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import { Copy, Trash2 } from 'lucide-react';

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { stories, removeStory } = useStories();
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === id);

  if (!story) {
    return <div className="text-center mt-10 text-xl">Story not found</div>;
  }

  // Dummy stable tags
  const dummyStableTags = ['v1.0.0', 'v2.0.0', 'v1.5.0','v2.5.0','v1.6.0','v3.0.0'];

  const getMostStableTag = () => {
    const sorted = dummyStableTags.sort((a, b) => {
      const [ma, mb] = [a, b].map((v) =>
        v.replace('v', '').split('.').map(Number)
      );
      return mb[0] - ma[0] || ma[2] - mb[2]; // highest major, lowest patch
    });
    return sorted[0];
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const getFormattedBranchName = (feature: number) => {
    const [newBranch] = story.topic.split('_');
    const featurename = `feature${feature}`;
    return `${featurename}_${newBranch}`;
  };

  const getBaseBranch = () => {
    const parts = story.topic.split('_');
    return parts[1] || 'main';
  };

  const handleDelete = () => {
    if (id) {
      removeStory(id);
      navigate('/');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{story.topic}</h1>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <Trash2 className="w-5 h-5" />
              Delete Story
            </button>
          </div>

          {story.selections.map((selection, index) => {
            const tag = getMostStableTag();
            const baseBranch = getBaseBranch();
            const branchName = getFormattedBranchName(selection.feature);

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Level {selection.level} / Feature {selection.feature} /{' '}
                    {selection.component}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(branchName)}
                    className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>

                <div className="space-y-1 text-sm bg-gray-50 p-3 rounded text-gray-800">
                  <div>🔖 <strong>Stable Tag:</strong> {tag}</div>
                  <div>🌿 <strong>Base Branch:</strong> {baseBranch}</div>
                  <div>🔗 <strong>Branch Name:</strong> {branchName}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200">
                    Rebase
                  </button>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">
                    Merge
                  </button>
                  <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                    Build
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}