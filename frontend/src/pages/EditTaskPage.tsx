import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { getTaskById, updateTask, type Task, type UpdateTaskData } from '../services/taskService';

const EditTaskPage: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchTask(parseInt(id));
    }
  }, [id]);

  const fetchTask = async (taskId: number) => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await getTaskById(taskId);
      setTask(taskData);
      setTitle(taskData.title);
      setDueDate(taskData.due_date ? taskData.due_date.split('T')[0] : '');
      setIsCompleted(taskData.is_completed);
    } catch (err: any) {
      console.error('Error fetching task:', err);
      setError('Greška pri učitavanju zadatka. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Naslov zadatka je obavezan.');
      return;
    }

    if (!task) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const updateData: UpdateTaskData = {
        title: title.trim(),
        is_completed: isCompleted,
        due_date: dueDate || undefined,
      };

      await updateTask(task.id, updateData);
      navigate('/app/tasks');
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError('Greška pri ažuriranju zadatka. Molimo pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/app/tasks');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Učitavanje zadatka...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={() => navigate('/app/tasks')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Vrati se na listu zadataka
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Izmeni zadatak
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ažurirajte detalje zadatka
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div>
            <Input
              type="text"
              label="Naslov zadatka"
              placeholder="Unesite naslov zadatka"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="date"
              label="Rok za završetak"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Rok je opcionalan i može se postaviti kasnije
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCompleted"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Zadatak je završen
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
            >
              Otkaži
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ažuriranje...
                </div>
              ) : (
                'Ažuriraj zadatak'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
