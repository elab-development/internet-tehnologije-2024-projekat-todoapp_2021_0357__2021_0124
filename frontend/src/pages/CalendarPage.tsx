import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTasks, type Task } from '../services/taskService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarPage: React.FC = () => {
  const [value, setValue] = useState<Value>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // učitavanje svih zadataka
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(true);
        // dobavljamo sve zadatke bez paginacije (ili sa velikim brojem per_page)
        const response = await getTasks({ page: 1 });
        
        // ako postoji više stranica, učitaj sve
        let allTasks = [...response.data];
        
        // učitaj sve stranice ako ima više od jedne
        if (response.last_page > 1) {
          const promises = [];
          for (let page = 2; page <= response.last_page; page++) {
            promises.push(getTasks({ page }));
          }
          const results = await Promise.all(promises);
          results.forEach(result => {
            allTasks = [...allTasks, ...result.data];
          });
        }
        
        setTasks(allTasks);
      } catch (error: any) {
        console.error('Greška pri učitavanju zadataka:', error);
        toast.error('Greška pri učitavanju zadataka');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  // provera da li datum ima zadatke
  const hasTasksOnDate = (date: Date): boolean => {
    return tasks.some(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  // dobijanje zadataka za određeni datum
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  // stilizovanje dana sa zadacima
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      const tasksForDate = getTasksForDate(date);
      const completedCount = tasksForDate.filter(t => t.is_completed).length;
      const incompleteCount = tasksForDate.length - completedCount;

      return (
        <div className="flex justify-center items-center gap-1 mt-1">
          {incompleteCount > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full" title={`${incompleteCount} nezavršenih`}></span>
          )}
          {completedCount > 0 && (
            <span className="w-2 h-2 bg-green-500 rounded-full" title={`${completedCount} završenih`}></span>
          )}
        </div>
      );
    }
    return null;
  };

  // dodavanje custom class-a za dane sa zadacima
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      return 'has-tasks';
    }
    return null;
  };

  // kada korisnik klikne na datum
  const handleDateClick = (newValue: Value) => {
    setValue(newValue);
    if (newValue instanceof Date) {
      const tasksForDate = getTasksForDate(newValue);
      setSelectedDateTasks(tasksForDate);
    }
  };

  // formatiranje datuma
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`/app/tasks/edit/${taskId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Učitavanje kalendara...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kalendar zadataka
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kalendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <style>{`
              .react-calendar {
                width: 100%;
                border: none;
                font-family: inherit;
              }
              .react-calendar__tile {
                padding: 1em 0.5em;
                position: relative;
              }
              .react-calendar__tile.has-tasks {
                font-weight: 600;
              }
              .react-calendar__tile--active {
                background: #475569 !important;
                color: white !important;
              }
              .react-calendar__tile--now {
                background: #f1f5f9;
                border: 2px solid #475569;
              }
              .dark .react-calendar {
                background: #1f2937;
                color: #f3f4f6;
              }
              .dark .react-calendar__tile {
                color: #f3f4f6;
              }
              .dark .react-calendar__tile--now {
                background: #334155;
                border: 2px solid #64748b;
              }
              .dark .react-calendar__tile:enabled:hover {
                background: #374151;
              }
              .dark .react-calendar__navigation button {
                color: #f3f4f6;
              }
              .dark .react-calendar__month-view__days__day--weekend {
                color: #ef4444;
              }
              .react-calendar__navigation button:enabled:hover,
              .react-calendar__navigation button:enabled:focus {
                background-color: #f1f5f9;
              }
              .dark .react-calendar__navigation button:enabled:hover,
              .dark .react-calendar__navigation button:enabled:focus {
                background-color: #374151;
              }
            `}</style>
            <Calendar
              onChange={handleDateClick}
              value={value}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="sr-RS"
            />
          </div>

          {/* Legenda */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Legenda:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Nezavršeni zadaci</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Završeni zadaci</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zadaci za izabrani datum */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {value instanceof Date ? formatDate(value) : 'Izaberite datum'}
            </h2>

            {value instanceof Date && selectedDateTasks.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Nema zadataka za ovaj datum
                </p>
              </div>
            )}

            {selectedDateTasks.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Ukupno {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'zadatak' : 'zadataka'}
                </p>
                {selectedDateTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.is_completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.is_completed 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                      }`}>
                        {task.is_completed ? 'Završeno' : 'Nezavršeno'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistika */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ukupno zadataka</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{tasks.length}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
              <svg className="w-8 h-8 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Završeni</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {tasks.filter(t => t.is_completed).length}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nezavršeni</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
                {tasks.filter(t => !t.is_completed).length}
              </p>
            </div>
            <div className="bg-rose-100 dark:bg-rose-900/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

