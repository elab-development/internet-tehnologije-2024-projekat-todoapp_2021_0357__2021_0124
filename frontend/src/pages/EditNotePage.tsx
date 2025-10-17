import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { getNoteById, updateNote, type Note, type UpdateNoteData } from '../services/noteService';

const EditNotePage: React.FC = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchNote(parseInt(id));
    }
  }, [id]);

  const fetchNote = async (noteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const noteData = await getNoteById(noteId);
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
    } catch (err: any) {
      console.error('Error fetching note:', err);
      setError('Greška pri učitavanju beleške. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Naslov beleške je obavezan.');
      return;
    }

    if (!content.trim()) {
      setError('Sadržaj beleške je obavezan.');
      return;
    }

    if (!note) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const updateData: UpdateNoteData = {
        title: title.trim(),
        content: content.trim(),
      };

      await updateNote(note.id, updateData);
      navigate('/app/notes');
    } catch (err: any) {
      console.error('Error updating note:', err);
      setError('Greška pri ažuriranju beleške. Molimo pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/app/notes');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Učitavanje beleške...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !note) {
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
            onClick={() => navigate('/app/notes')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Vrati se na listu beležaka
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Izmeni belešku
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ažurirajte detalje beleške
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
              label="Naslov beleške"
              placeholder="Unesite naslov beleške"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Sadržaj beleške
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Unesite sadržaj beleške"
              rows={8}
              className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 resize-vertical"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Detaljno opišite Vašu belešku
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
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ažuriranje...
                </div>
              ) : (
                'Ažuriraj belešku'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotePage;
