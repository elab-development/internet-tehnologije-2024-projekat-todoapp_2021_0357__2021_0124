import React from 'react';
import { type Task } from '../services/taskService';

interface CardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const Card: React.FC<CardProps> = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nema roka';
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Završeno' : 'U toku';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {task.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.is_completed)}`}>
          {getStatusText(task.is_completed)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Rok: {formatDate(task.due_date)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Kreirano: {new Date(task.created_at).toLocaleDateString('sr-RS')}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 bg-[#587792] text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Izmeni
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-[#FF3366] text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Obriši
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
