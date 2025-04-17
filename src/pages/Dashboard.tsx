import { Header } from '../components/Header';
import { useStories } from '../context/StoryContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Dashboard() {
  const { stories } = useStories();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Group stories by level
  const groupedByLevel: Record<number, typeof stories> = {};
  for (const story of stories) {
    if (!groupedByLevel[story.level]) groupedByLevel[story.level] = [];
    groupedByLevel[story.level].push(story);
  }
  
  const filteredStories = stories.filter((story) => {
    if (searchText && !story.topic.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (statusFilter !== 'All' && story.status !== statusFilter) return false;
    return true;
  });

  const filteredGroupedByLevel: Record<number, typeof stories> = {};
  for (const story of filteredStories) {
    if (!filteredGroupedByLevel[story.level]) filteredGroupedByLevel[story.level] = [];
    filteredGroupedByLevel[story.level].push(story);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Your Story Dashboard
        </h1>

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <input
            type="text"
            className="border px-3 py-2 rounded shadow-sm"
            placeholder="Search component..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
            <option value="Building">Building</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {Object.keys(filteredGroupedByLevel)
          .map(Number)
          .sort((a, b) => a - b)
          .map((level) => (
            <div
              key={level}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Level {level}
              </h2>
              <ul className="space-y-2">
                {filteredGroupedByLevel[level]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((story) => (
                    <li key={story.id}>
                      <Link
                        to={`/story/${story.id}`}
                        className="block px-4 py-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg transition duration-150 ease-in-out"
                      >
                        <span className="text-gray-800 font-medium">
                          {story.topic}
                        </span>
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
