import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoryProvider } from './context/StoryContext';
import { BuildHistoryProvider } from './context/BuildHistoryContext'; // ✅ NEW
import { NewStory } from './pages/NewStory';
import { StoryView } from './pages/StoryView';
import { Dashboard } from './pages/Dashboard';
import { BuildHistory } from './pages/BuildHistory'; // ✅ NEW

function App() {
  return (
    <BuildHistoryProvider> {/* ✅ Wrap app in Build History Context */}
      <StoryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<NewStory />} />
            <Route path="/story/:id" element={<StoryView />} />
            <Route path="/history" element={<BuildHistory />} /> {/* ✅ New route */}
          </Routes>
        </BrowserRouter>
      </StoryProvider>
    </BuildHistoryProvider>
  );
}

export default App;
