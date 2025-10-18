import { Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AppHomePage from './pages/AppHomePage';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import ActivityPage from './pages/ActivityPage';

function App() {
  return (
    <Routes>
      {/* javna početna stranica */}
      <Route path="/" element={<HomePage />} />

      {/* Rute za goste (neregistrovane korisnike) */}
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* zaštićene rute za prijavljene korisnike */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/app" element={<AppHomePage />} />
          <Route path="/app/notes" element={<NotesPage />} />
          <Route path="/app/notes/create" element={<CreateNotePage />} />
          <Route path="/app/notes/edit/:id" element={<EditNotePage />} />
          <Route path="/app/tasks" element={<TasksPage />} />
          <Route path="/app/tasks/create" element={<CreateTaskPage />} />
          <Route path="/app/tasks/edit/:id" element={<EditTaskPage />} />
          <Route path="/app/activity" element={<ActivityPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
