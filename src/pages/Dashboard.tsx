import { Header } from '../components/Header';
import { StoryList } from '../components/StoryList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <StoryList />
      </main>
    </div>
  );
}