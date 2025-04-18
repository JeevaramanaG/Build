import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoryProvider } from './context/StoryContext';
import { BuildHistoryProvider } from './context/BuildHistoryContext';
import { AuthProvider } from './context/AuthContext'; // ✅ NEW

import { NewStory } from './pages/NewStory';
import { StoryView } from './pages/StoryView';
import { Dashboard } from './pages/Dashboard';
import { BuildHistory } from './pages/BuildHistory';

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything in AuthProvider for role and space handling */}
      <BuildHistoryProvider>
        <StoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewStory />} />
              <Route path="/story/:id" element={<StoryView />} />
              <Route path="/history" element={<BuildHistory />} />
            </Routes>
          </BrowserRouter>
        </StoryProvider>
      </BuildHistoryProvider>
    </AuthProvider>
  );
}

export default App;
