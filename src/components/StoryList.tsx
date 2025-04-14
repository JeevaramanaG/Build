import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStories } from '../context/StoryContext';

export function StoryList() {
  const { stories } = useStories();

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No stories yet. Create your first story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
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
      ))}
    </div>
  );
}