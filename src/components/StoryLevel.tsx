// src/components/StoryLevel.tsx
import { Story } from "../types";

interface Props {
  level: number;
  stories: Story[];
}

export default function StoryLevel({ level, stories }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Level {level}</h2>
      <ul className="ml-4 list-disc space-y-1">
        {stories.map((story) => (
          <li key={story.id}>
            <strong>{story.name}</strong> – {story.createdAt.toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
