import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AppHomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Dobrodošli, {user?.name}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Vaš nalog je uspešno prijavljen. Možete početi sa organizacijom vaših zadataka i beležaka.
        </p>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-4">
            Brzi pristup
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              to="/app/notes"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Beleške
            </Link>
            <Link
              to="/app/tasks"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Zadaci
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Beleške</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Kreirajte i organizujte svoje beleške. Dodajte tagove za bolju organizaciju.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Zadaci</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upravljajte svojim zadacima, postavite rokove i pratite napredak.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Aktivnosti</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Otkrijte nove aktivnosti kada ne znate šta da radite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHomePage;
