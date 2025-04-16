import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useStories } from "../context/StoryContext";
import { Trash2 } from "lucide-react";
import { BuildCard } from "../components/BuildCard";
import { useStableTag } from "../hooks/useStableTag";

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { stories, removeStory } = useStories();
  const { getMostStableTag } = useStableTag();
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === id);
  const builtLevels = new Set<number>();

  if (!story) {
    return <div className="text-center mt-10 text-xl">Story not found</div>;
  }

  // Function to format the branch name correctly
  const getFormattedBranchName = (feature: number) => {
    const [newBranch] = story.topic.split("_");
    return `feature${feature}_${newBranch}`;
  };

  // Function to get the correct base branch
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

          {story.selections.map((selection, index) => {
            const tag = getMostStableTag(); // Get the most stable tag
            const baseBranch = getBaseBranch(); // Get the base branch correctly
            const branchName = getFormattedBranchName(selection.feature); // Format branch name correctly

            const canBuild = selection.level === 1 || builtLevels.has(selection.level - 1);

            return (
              <BuildCard
                key={index}
                level={selection.level}
                feature={selection.feature}
                component={selection.component}
                tag={tag} // Pass the tag to the BuildCard
                baseBranch={baseBranch} // Pass the correct base branch to the BuildCard
                branchName={branchName} // Pass the correct branch name to the BuildCard
                disabled={!canBuild}
                onBuild={() => builtLevels.add(selection.level)}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
