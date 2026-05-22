import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import LoadingIndicator from './components/LoadingIndicator';
import ThreadListPage from './pages/ThreadListPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewThreadPage from './pages/NewThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { selectGlobalLoading } from './features/ui/uiSlice';

function App() {
  const globalLoading = useSelector(selectGlobalLoading);

  return (
    <div>
      <Navbar />
      {globalLoading ? <LoadingIndicator /> : null}
      <main className="container">
        <Routes>
          <Route path="/" element={<ThreadListPage />} />
          <Route path="/threads/:id" element={<ThreadDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/new" element={<NewThreadPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
