import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import NoteViewModal from '../components/NoteViewModal';
import Button from '../components/Button';
import Pagination from '../components/Pagination';
import { getNotes, type Note, type NoteSearchParams, type PaginatedResponse } from '../services/noteService';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async (searchParams?: NoteSearchParams, page?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Note> = await getNotes({
        ...searchParams,
        page: page || currentPage,
      });
      setNotes(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
      });
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setError('Greška pri učitavanju beležaka. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu belešku?')) {
      try {
        const { deleteNote } = await import('../services/noteService');
        await deleteNote(noteId);
        // Ukloni belešku iz liste bez ponovnog učitavanja
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (err: any) {
        console.error('Error deleting note:', err);
        setError('Greška pri brisanju beleške. Molimo pokušajte ponovo.');
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
    fetchNotes(undefined, page);
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
            onClick={() => fetchNotes()}
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

      {notes.length === 0 ? (
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
          {notes.map((note) => (
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
      {notes.length > 0 && (
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
