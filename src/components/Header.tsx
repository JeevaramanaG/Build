// src/components/Header.tsx
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition-all duration-200"
      >
        ⚡ Zoho Build
      </Link>
      <nav className="flex gap-6 text-sm font-medium">
        <Link
          to="/new"
          className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded transition-all duration-150 border border-transparent hover:border-blue-300"
        >
          ➕ New Story
        </Link>
        <Link
          to="/history"
          className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded transition-all duration-150 border border-transparent hover:border-blue-300"
        >
          📜 Build History
        </Link>
      </nav>
    </header>
  );
}
