import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* rute za korisnike koji nisu registrovani */}
        <Route path="/" element={<GuestLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {/* rute za ulogovane korisnike */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
