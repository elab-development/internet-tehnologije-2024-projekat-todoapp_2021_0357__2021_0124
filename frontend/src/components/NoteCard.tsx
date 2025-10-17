import React from 'react';
import { type Note } from '../services/noteService';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {note.title}
        </h3>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="line-clamp-3">{truncateContent(note.content)}</p>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Kreirano: {new Date(note.created_at).toLocaleDateString('sr-RS')}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="px-3 py-1 bg-[#587792] text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Izmeni
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="px-3 py-1 bg-[#FF3366] text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Obriši
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
