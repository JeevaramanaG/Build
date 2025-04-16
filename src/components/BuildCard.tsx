// src/components/BuildCard.tsx
import { Copy } from "lucide-react";

interface BuildCardProps {
  level: number;
  feature: number;
  component: string;
  tag: string;
  baseBranch: string;
  branchName: string;
  disabled?: boolean;
  onBuild: () => void;
}

export function BuildCard({
  level,
  feature,
  component,
  tag,
  baseBranch,
  branchName,
  disabled = false,
  onBuild,
}: BuildCardProps) {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 opacity-100">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          Level {level} / Feature {feature} / {component}
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
        {/* Rebase and Merge buttons can be expanded in the future */}
        <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200">
          Rebase
        </button>
        <button className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">
          Merge
        </button>
        <button
          className={`px-3 py-1 rounded ${
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
          onClick={onBuild}
          disabled={disabled}
        >
          Build
        </button>
      </div>
    </div>
  );
}
