import { Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
        <Zap className="w-8 h-8" />
        <span>Zoho Build</span>
      </Link>
      <Link
        to="/new"
        className="inline-flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>New Story</span>
      </Link>
    </header>
  );
}