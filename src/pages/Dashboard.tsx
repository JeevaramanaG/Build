import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { stories } = useStories();

  // Group stories by level
  const groupedByLevel: Record<number, typeof stories> = {};
  for (const story of stories) {
    if (!groupedByLevel[story.level]) groupedByLevel[story.level] = [];
    groupedByLevel[story.level].push(story);
  }

  const sortedLevels = Object.keys(groupedByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Your Story Dashboard
        </h1>

        {sortedLevels.map((level) => (
          <div
            key={level}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Level {level}
            </h2>
            <ul className="space-y-2">
              {groupedByLevel[level]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((story) => (
                  <li key={story.id}>
                    <Link
                      to={`/story/${story.id}`}
                      className="block px-4 py-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg transition duration-150 ease-in-out"
                    >
                      <span className="text-gray-800 font-medium">{story.topic}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}
