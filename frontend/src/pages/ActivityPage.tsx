import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import useApi from '../hooks/useApi';
import { getRandomActivity, type Activity } from '../services/activityService';
import { createTask } from '../services/taskService';

const ActivityPage: React.FC = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const navigate = useNavigate();
  
  // Kreiramo funkciju koja će se pozvati samo kada korisnik klikne na dugme
  const fetchActivity = () => getRandomActivity();
  
  const { data: activity, loading, error, execute } = useApi<Activity>(fetchActivity, { initialLoading: false });

  const handleGetActivity = () => {
    setShouldFetch(true);
    execute();
  };

  const handleAddToTasks = async () => {
    if (!activity) return;
    
    setIsCreatingTask(true);
    try {
      await createTask({
        title: activity.activity,
      });
      toast.success('Aktivnost je dodata u zadatke!');
      navigate('/app/tasks');
    } catch (err: any) {
      console.error('Error creating task:', err);
      toast.error('Greška pri dodavanju aktivnosti u zadatke');
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Random Aktivnost
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kliknite na dugme ispod da dobijete predlog za novu aktivnost koju možete probati!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleGetActivity}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 text-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Učitavanje...
              </div>
            ) : (
              <div className="flex items-center">
                <svg 
                  className="w-6 h-6 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Generiši random aktivnost
              </div>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 rounded-lg p-6">
            <div className="flex items-center">
              <svg 
                className="w-6 h-6 text-rose-600 dark:text-rose-400 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-rose-800 dark:text-rose-300">{error}</p>
            </div>
          </div>
        )}

        {activity && shouldFetch && !loading && (
          <div className="mt-6 space-y-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {activity.activity}
                </h2>
                <span className="inline-block px-3 py-1 bg-slate-700 text-white text-sm rounded-full">
                  {activity.type}
                </span>
              </div>

              <div className="flex justify-center">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 max-w-xs w-full">
                  <div className="flex items-center justify-center mb-3">
                    <svg 
                      className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                      />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Broj učesnika
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                    {activity.participants}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToTasks}
                  disabled={isCreatingTask}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
                >
                  {isCreatingTask ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Dodavanje...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                      Dodaj u zadatke
                    </div>
                  )}
                </Button>
                
                {activity.link && (
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                    Saznaj više
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {!activity && !loading && shouldFetch && (
          <div className="mt-6 text-center py-12">
            <svg 
              className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              Kliknite na dugme da dobijete predlog aktivnosti
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex">
          <svg 
            className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              O ovoj funkcionalnosti
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              poran.io korisiti API sa boredAPI.com da bi Vam predložila interesantne aktivnosti za popunjavanje slobodnog vremena!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;

