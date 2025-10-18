import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';
import { createTask, type CreateTaskData } from '../services/taskService';

const CreateTaskPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Naslov zadatka je obavezan.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const taskData: CreateTaskData = {
        title: title.trim(),
        due_date: dueDate || undefined,
      };

      await createTask(taskData);
      toast.success('Zadatak je uspešno kreiran!');
      navigate('/app/tasks');
    } catch (err: any) {
      console.error('Error creating task:', err);
      toast.error('Greška pri kreiranju zadatka');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/app/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kreiraj novi zadatak
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unesite detalje za Vašnovi zadatak
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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kreiranje...
                </div>
              ) : (
                'Kreiraj zadatak'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
