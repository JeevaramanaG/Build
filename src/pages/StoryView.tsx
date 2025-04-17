// src/pages/StoryView.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useStories } from "../context/StoryContext";
import { Trash2 } from "lucide-react";
import { BuildCard } from "../components/BuildCard";
import { useStableTag } from "../hooks/useStableTag";
import { useState, useRef, useEffect } from "react";
import { useBuildHistory } from "../context/BuildHistoryContext";

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { stories, removeStory } = useStories();
  const { getMostStableTag } = useStableTag();
  const navigate = useNavigate();
  const { addBuildHistory } = useBuildHistory();
  const story = stories.find((s) => s.id === id);
  const [buildQueue, setBuildQueue] = useState<any[]>([]);
  const [builtLevels, setBuiltLevels] = useState<Set<number>>(new Set());
  const currentBuildIndex = useRef(0);
  const cancelFlag = useRef(false);

  useEffect(() => {
    if (buildQueue.length === 0 || currentBuildIndex.current >= buildQueue.length) return;

    const item = buildQueue[currentBuildIndex.current];
    if (item.status !== "Pending") return;

    runBuild(item, currentBuildIndex.current);
  }, [buildQueue]);

  const runBuild = (buildItem: any, index: number) => {
    const startTime = new Date();
    let progress = 0;
    cancelFlag.current = false;

    updateQueueItem(index, { status: "Building", progress: 0 });

    const interval = setInterval(() => {
      if (cancelFlag.current) {
        clearInterval(interval);
        handleCancel(index);
        return;
      }

      progress += 10;
      updateQueueItem(index, { progress });

      if (progress >= 100) {
        clearInterval(interval);
        const endTime = new Date();
        updateQueueItem(index, { status: "Completed", progress: 100 });

        addBuildHistory({
          timestamp: startTime.toISOString(),
          component: buildItem.component,
          level: buildItem.level,
          branch: getFormattedBranchName(buildItem.feature),
          tag: buildItem.tag || "-",
          status: "Completed",
          duration: ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2) + "s",
        });

        currentBuildIndex.current++;
        if (currentBuildIndex.current < buildQueue.length) {
          runBuild(buildQueue[currentBuildIndex.current], currentBuildIndex.current);
        }
      }
    }, 500);
  };

  const updateQueueItem = (index: number, updates: Partial<any>) => {
    setBuildQueue((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleCancel = (startIndex: number) => {
    cancelFlag.current = false;
    setBuildQueue((prev) =>
      prev.map((item, idx) =>
        idx >= startIndex
          ? { ...item, status: "Canceled", progress: 0 }
          : item
      )
    );
  };

  const handleBuildQueueAdd = (buildItem: any) => {
    setBuildQueue((prev) => {
      const exists = prev.some(
        (i) => i.level === buildItem.level && i.component === buildItem.component
      );
      if (exists) return prev;

      return [
        ...prev,
        {
          ...buildItem,
          status: "Pending",
          progress: 0,
        },
      ];
    });

    setBuiltLevels((prev) => new Set(prev).add(buildItem.level));
  };

  const handleRetry = (item: any) => {
    const index = buildQueue.findIndex(
      (i) => i.level === item.level && i.component === item.component
    );
    if (index !== -1) {
      updateQueueItem(index, { status: "Pending", progress: 0 });
      if (index < currentBuildIndex.current) {
        currentBuildIndex.current = index;
        runBuild(buildQueue[index], index);
      } else if (index === currentBuildIndex.current) {
        runBuild(buildQueue[index], index);
      }
    }
  };

  const handleDelete = () => {
    if (id) {
      removeStory(id);
      navigate("/");
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-xl font-semibold text-gray-700">Story not found</h1>
            <p className="text-gray-500 mt-2">Please check the URL or go back to the dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  const getFormattedBranchName = (feature: number) => {
    const [newBranch] = story.topic.split("_");
    return `feature${feature}_${newBranch}`;
  };

  const getBaseBranch = () => {
    const parts = story.topic.split("/");
    return parts[1] || "main";
  };

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
            autogenerated: true,
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
                  <li key={idx} className="bg-gray-100 p-2 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        🔧 Level {item.level} – {item.component}
                      </span>
                      <span className="text-xs text-gray-500 italic">{item.status}</span>
                    </div>
                    {item.status === "Building" && (
                      <div className="mt-1">
                        <div className="h-2 bg-gray-300 rounded">
                          <div
                            className="h-full bg-blue-500 rounded transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            cancelFlag.current = true;
                          }}
                          className="mt-1 text-red-500 text-xs underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {item.status === "Completed" && (
                      <div className="mt-1 text-green-600 text-xs font-semibold">✅ Build Completed</div>
                    )}
                    {item.status === "Canceled" && (
                      <div className="mt-1 text-orange-500 text-xs font-semibold">
                        ❌ Build Canceled {" "}
                        <button
                          onClick={() => handleRetry(item)}
                          className="ml-2 text-blue-500 underline text-xs"
                        >
                          Retry
                        </button>
                      </div>
                    )}
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
              (item) =>
                item.level === selection.level &&
                item.component === selection.component
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