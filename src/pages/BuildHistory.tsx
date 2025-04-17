// src/pages/BuildHistory.tsx
import { useBuildHistory } from "../context/BuildHistoryContext";
import { Header } from "../components/Header";
import { useState } from "react";

export function BuildHistory() {
  const { history } = useBuildHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredHistory = history.filter((entry) => {
    const matchesSearch =
      entry.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Build History</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by component, branch, or tag..."
              className="border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No matching builds found.</p>
        ) : (
          <div className="overflow-auto rounded shadow bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((entry, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{entry.component}</td>
                    <td className="px-4 py-2 text-gray-700">Level {entry.level}</td>
                    <td className="px-4 py-2 text-gray-700">{entry.branch}</td>
                    <td className="px-4 py-2 text-gray-700">{entry.tag}</td>
                    <td className="px-4 py-2 font-medium text-green-600">
                      {entry.status}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{entry.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
