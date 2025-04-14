import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoryProvider } from './context/StoryContext';
import { Dashboard } from './pages/Dashboard';
import { NewStory } from './pages/NewStory';
import { StoryView } from './pages/StoryView';

function App() {
  return (
    <StoryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewStory />} />
          <Route path="/story/:id" element={<StoryView />} />
        </Routes>
      </BrowserRouter>
    </StoryProvider>
  );
}

export default App;