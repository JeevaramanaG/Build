import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoryProvider } from './context/StoryContext';
import { NewStory } from './pages/NewStory';
import { StoryView } from './pages/StoryView';
import {Dashboard} from './pages/Dashboard';
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