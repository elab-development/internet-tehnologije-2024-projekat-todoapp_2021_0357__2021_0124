import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import useApi from '../hooks/useApi';
import { getTasks, type Task, type TaskSearchParams, type PaginatedResponse } from '../services/taskService';

const TasksPage: React.FC = () => {
  // state za unos (ne pokreće pretragu)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  
  // state za stvarne parametre pretrage (pokreće API poziv)
  const [searchParams, setSearchParams] = useState<{
    search: string;
    status: 'all' | 'completed' | 'incomplete';
    page: number;
  }>({
    search: '',
    status: 'all',
    page: 1,
  });
  
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

  // api poziv funkcije
  const createApiCall = useCallback(() => {
    const params: TaskSearchParams = {};
    
    if (searchParams.search.trim()) {
      params.search = searchParams.search.trim();
    }
    
    if (searchParams.status !== 'all') {
      params.completed = searchParams.status === 'completed';
    }
    
    params.page = searchParams.page;
    
    return getTasks(params);
  }, [searchParams]);

  // korišćenje useApi hook-a
  const { data: tasksResponse, loading, error, execute } = useApi<PaginatedResponse<Task>>(createApiCall);

 
  useEffect(() => {
    execute();

  }, [searchParams]);

  // ažuriranje paginacije kada se promeni odgovor
  useEffect(() => {
    if (tasksResponse) {
      setPagination({
        current_page: tasksResponse.current_page,
        last_page: tasksResponse.last_page,
        total: tasksResponse.total,
      });
    }
  }, [tasksResponse]);

  const handleSearch = () => {
    // postavi parametre pretrage što će pokrenuti useEffect
    setSearchParams({
      search: searchTerm,
      status: statusFilter,
      page: 1, // reset na prvu stranicu rezultata
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'all' | 'completed' | 'incomplete';
    setStatusFilter(newStatus);

    setSearchParams({
      search: searchTerm,
      status: newStatus,
      page: 1, // reset na prvu stranicu kada se promeni filter
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSearchParams({
      search: '',
      status: 'all',
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      ...searchParams,
      page: page,
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zadatak?')) {
      try {
        const { deleteTask } = await import('../services/taskService');
        await deleteTask(taskId);
        toast.success('Zadatak je uspešno obrisan!');
        // Ponovo učitaj zadatke nakon brisanja
        execute();
      } catch (err: any) {
        console.error('Error deleting task:', err);
        toast.error('Greška pri brisanju zadatka');
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
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
            Zadaci
          </h1>
        </div>
        <Link to="/app/tasks/create">
          <Button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj novi zadatak
          </Button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <Input
              type="text"
              label="Pretraži zadatke"
              placeholder="Unesite naslov zadatka za pretragu..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Status zadatka
            </label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-slate-500 dark:focus:border-slate-400 transition-colors duration-200"
            >
              <option value="all">Svi zadaci</option>
              <option value="completed">Završeni</option>
              <option value="incomplete">Nezavršeni</option>
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            type="button"
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2"
          >
            Obriši filtere
          </Button>
          <Button
            type="button"
            onClick={handleSearch}
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Pretraži
          </Button>
        </div>
      </div>

      {!tasksResponse?.data || tasksResponse.data.length === 0 ? (
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
            <Button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3">
              Kreiraj prvi zadatak
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasksResponse?.data.map((task) => (
            <Card
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {tasksResponse?.data && tasksResponse.data.length > 0 && (
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

export default TasksPage;
