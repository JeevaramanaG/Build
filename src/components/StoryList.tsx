// src/components/StoryList.tsx
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStories } from '../context/StoryContext';
import { useState } from 'react';

export function StoryList() {
  const { stories } = useStories();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = stories.filter(story =>
    story.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No matching stories found.</p>
        </div>
      ) : (
        filteredStories.map((story) => (
          <Link
            key={story.id}
            to={`/story/${story.id}`}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium">{story.topic}</h3>
                <p className="text-sm text-gray-500">
                  Created {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
