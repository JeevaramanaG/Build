import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Header() {
  const { currentUser, isTeamSpace, toggleSpace } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Title with Home Redirect */}
      <h1
        onClick={() => navigate('/')}
        className="text-xl font-bold text-indigo-600 cursor-pointer"
      >
        Zoho Build
      </h1>

      <div className="flex items-center gap-4 relative">
        {/* Space Toggle Buttons */}
        <button
          onClick={() => !isTeamSpace && toggleSpace()}
          className={`px-4 py-2 rounded font-medium transition ${
            isTeamSpace
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Team Space
        </button>
        <button
          onClick={() => isTeamSpace && toggleSpace()}
          className={`px-4 py-2 rounded font-medium transition ${
            !isTeamSpace
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Space
        </button>

        {/* New Story */}
        <Link
          to="/new"
          className="px-4 py-2 rounded bg-green-50 text-green-700 hover:bg-green-100 font-medium transition"
        >
          New Story
        </Link>

        {/* Build History */}
        <Link
          to="/history"
          className="px-4 py-2 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium transition"
        >
          Build History
        </Link>

        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium border border-gray-300 transition"
          >
            👤
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-sm z-50">
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>ID:</strong> {currentUser.id}</p>
              <p><strong>Space:</strong> {isTeamSpace ? 'Team Space' : 'My Space'}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
