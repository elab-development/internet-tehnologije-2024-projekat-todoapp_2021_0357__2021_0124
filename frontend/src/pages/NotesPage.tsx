import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import NoteViewModal from '../components/NoteViewModal';
import Button from '../components/Button';
import Pagination from '../components/Pagination';
import useApi from '../hooks/useApi';
import { getNotes, type Note, type PaginatedResponse } from '../services/noteService';

const NotesPage: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const navigate = useNavigate();

  // kreiranje API poziva funkcije
  const createApiCall = useCallback(() => {
    return getNotes({ page: currentPage, tag: selectedTag || undefined });
  }, [currentPage, selectedTag]);

  // korišćenje useApi hook-a
  const { data: notesResponse, loading, error, execute } = useApi<PaginatedResponse<Note>>(createApiCall);

  useEffect(() => {
    execute();
  }, [execute]);

  // ažuriranje paginacije kada se promeni odgovor
  useEffect(() => {
    if (notesResponse) {
      setPagination({
        current_page: notesResponse.current_page,
        last_page: notesResponse.last_page,
        total: notesResponse.total,
      });
      // izvući dostupne tagove iz pristiglih beleški (basic)
      const tagsFromNotes = new Set<string>();
      for (const n of notesResponse.data) {
        if (Array.isArray(n.tags)) {
          for (const t of n.tags) {
            if (t && t.name) tagsFromNotes.add(t.name);
          }
        }
      }
      setAvailableTags(Array.from(tagsFromNotes).sort((a, b) => a.localeCompare(b)));
    }
  }, [notesResponse]);

  const handleDeleteNote = async (noteId: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu belešku?')) {
      try {
        const { deleteNote } = await import('../services/noteService');
        await deleteNote(noteId);
        toast.success('Beleška je uspešno obrisana!');
        // ponovo učitaj beleške nakon brisanja
        execute();
      } catch (err: any) {
        console.error('Error deleting note:', err);
        toast.error('Greška pri brisanju beleške');
      }
    }
  };

  const handleEditNote = (note: Note) => {
    navigate(`/app/notes/edit/${note.id}`);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    execute();
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTag(value);
    setCurrentPage(1);
    // re-execute will happen due to dependency in createApiCall
    execute();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Učitavanje beležaka...</p>
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
            onClick={execute}
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
            Beleške
          </h1>
          {/* jednostavan filter po tagu */}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Filtriraj po tagu:</label>
            <select
              value={selectedTag}
              onChange={handleTagChange}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">Svi tagovi</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <Link to="/app/notes/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj novu belešku
          </Button>
        </Link>
      </div>

      {!notesResponse?.data || notesResponse.data.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nema beležaka
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Još uvek niste kreirali nijednu belešku. Kliknite na dugme ispod da dodate svoju prvu belešku.
          </p>
          <Link to="/app/notes/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              Kreiraj prvu belešku
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notesResponse?.data.map((note: Note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onView={handleViewNote}
            />
          ))}
        </div>
      )}

      {/* Note View Modal */}
      <NoteViewModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />

      {/* Pagination */}
      {notesResponse?.data && notesResponse.data.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NotesPage;
