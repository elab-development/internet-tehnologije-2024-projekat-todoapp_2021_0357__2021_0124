import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Breadcrumbs from '../components/Breadcrumbs';

// layout za stranice gde je korisnik ulogovan
const MainLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* navigacija */}
      <nav className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/app"
                className="text-xl font-bold text-gray-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300 transition-colors duration-200"
              >
                poran.io 
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/app"
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Početna
              </Link>
              <Link
                to="/app/notes"
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Beleške
              </Link>
              <Link
                to="/app/tasks"
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Zadaci
              </Link>
              <Link
                to="/app/calendar"
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Kalendar
              </Link>
              <Link
                to="/app/activity"
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Aktivnosti
              </Link>
              {user && (
                <span className="text-gray-700 px-3 py-2 text-sm font-medium dark:text-gray-300">
                  {user.name}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-slate-200 transition-colors duration-200"
                title={isDark ? 'Prebaci na light mode' : 'Prebaci na dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-rose-400 transition-colors duration-200"
              >
                Odjava
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* saaadržaaaj */}
      <main className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;  