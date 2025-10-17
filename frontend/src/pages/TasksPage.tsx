import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { getTasks, type Task } from '../services/taskService';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError('Greška pri učitavanju zadataka. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zadatak?')) {
      try {
        // Importujemo deleteTask funkciju dinamički da izbegnemo circular dependency
        const { deleteTask } = await import('../services/taskService');
        await deleteTask(taskId);
        // Ukloni zadatak iz liste bez ponovnog učitavanja
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setError('Greška pri brisanju zadatka. Molimo pokušajte ponovo.');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    navigate(`/app/tasks/edit/${task.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Učitavanje zadataka...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Zadaci
          </h1>
        </div>
        <Link to="/app/tasks/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj novi zadatak
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nema zadataka
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Još uvek niste kreirali nijedan zadatak. Kliknite na dugme ispod da dodate svoj prvi zadatak.
          </p>
          <Link to="/app/tasks/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              Kreiraj prvi zadatak
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
