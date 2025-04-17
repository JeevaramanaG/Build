// src/pages/StoryView.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useStories } from "../context/StoryContext";
import { Trash2 } from "lucide-react";
import { BuildCard } from "../components/BuildCard";
import { useStableTag } from "../hooks/useStableTag";
import { useState } from "react";

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { stories, removeStory } = useStories();
  const { getMostStableTag } = useStableTag();
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === id);
  const [buildQueue, setBuildQueue] = useState<any[]>([]);
  const [builtLevels, setBuiltLevels] = useState<Set<number>>(new Set());

  if (!story) {
    return <div className="text-center mt-10 text-xl">Story not found</div>;
  }

  const getFormattedBranchName = (feature: number) => {
    const [newBranch] = story.topic.split("_");
    return `feature${feature}_${newBranch}`;
  };

  const getBaseBranch = () => {
    const parts = story.topic.split("/");
    return parts[1] || "main";
  };

  const handleDelete = () => {
    if (id) {
      removeStory(id);
      navigate("/");
    }
  };

  const handleBuildQueueAdd = (buildItem: any) => {
    setBuildQueue((prev) => [...prev, buildItem]);
    setBuiltLevels((prev) => new Set(prev).add(buildItem.level));

    setTimeout(() => {
      setBuildQueue((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex(
          (item) => item.level === buildItem.level && item.component === buildItem.component
        );
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], status: "Completed" };
        }
        return updated;
      });
    }, 5000);
  };

  // Generate required lower-level build cards
  const fullSelections: any[] = [];
  const seenLevels = new Set<number>();

  story.selections
    .sort((a, b) => a.level - b.level)
    .forEach((sel) => {
      for (let lvl = 1; lvl < sel.level; lvl++) {
        if (!seenLevels.has(lvl)) {
          fullSelections.push({
            level: lvl,
            feature: 0,
            component: `AutoGenerated-Level${lvl}`,
            tag: undefined,
            autogenerated: true
          });
          seenLevels.add(lvl);
        }
      }
      if (!seenLevels.has(sel.level)) {
        fullSelections.push(sel);
        seenLevels.add(sel.level);
      }
    });

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

          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold mb-2">Build Queue</h2>
            {buildQueue.length === 0 ? (
              <p className="text-sm text-gray-500">No builds in queue.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {buildQueue.map((item, idx) => (
                  <li key={idx} className="text-gray-800">
                    🔧 Level {item.level} – {item.component} – <span className="italic">{item.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {fullSelections.map((selection, index) => {
            const tag = getMostStableTag();
            const baseBranch = getBaseBranch();
            const branchName = getFormattedBranchName(selection.feature);
            const canBuild =
              selection.level === 1 || builtLevels.has(selection.level - 1);
            const isInQueue = buildQueue.some(
              (item) => item.level === selection.level && item.component === selection.component
            );

            return (
              <BuildCard
                key={index}
                level={selection.level}
                feature={selection.feature}
                component={selection.component}
                tag={tag}
                baseBranch={baseBranch}
                branchName={branchName}
                disabled={!canBuild}
                isInQueue={isInQueue}
                onBuild={handleBuildQueueAdd}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}