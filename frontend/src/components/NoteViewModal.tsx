import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { type Note } from '../services/noteService';

interface NoteViewModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: number) => void;
}

const NoteViewModal: React.FC<NoteViewModalProps> = ({ 
  note, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  if (!note) return null;

  const handleEdit = () => {
    onClose();
    onEdit?.(note);
  };

  const handleDelete = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu belešku?')) {
      onClose();
      onDelete?.(note.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={note.title}>
      <div className="space-y-6">
        {/* Note Content */}
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {note.content}
          </div>
        </div>

        {/* Note Metadata */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kreirano: {new Date(note.created_at).toLocaleDateString('sr-RS')}
            {note.updated_at !== note.created_at && (
              <>
                <span className="mx-2">•</span>
                Ažurirano: {new Date(note.updated_at).toLocaleDateString('sr-RS')}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2"
            >
              Zatvori
            </Button>
            {onEdit && (
              <Button
                type="button"
                onClick={handleEdit}
                className="bg-[#587792] hover:bg-blue-700 text-white px-4 py-2"
              >
                Izmeni
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                onClick={handleDelete}
                className="bg-[#FF3366] hover:bg-red-700 text-white px-4 py-2"
              >
                Obriši
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NoteViewModal;
