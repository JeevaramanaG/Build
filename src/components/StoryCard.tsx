// src/components/StoryCard.tsx
interface Props {
    name: string;
    createdAt: string;
  }
  
  export default function StoryCard({ name, createdAt }: Props) {
    return (
      <div className="bg-white p-3 rounded shadow flex justify-between items-center">
        <div>
          <p className="font-medium">📄 {name}</p>
          <p className="text-sm text-gray-500">🕓 Created: {createdAt}</p>
        </div>
      </div>
    );
  }
  