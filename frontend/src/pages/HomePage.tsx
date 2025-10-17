import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Dobrodošli u poran.io
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Platforma za upravljanje sopstvenim vremenom gde mozete da organizujte svoje zadatke, 
          beleške i aktivnosti.
        </p>
        
        {user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Dobrodošli, {user.name}!
            </h2>
            <p className="text-green-700 mb-6">
              Vaš nalog je uspešno prijavljen. Možete početi sa organizacijom vaših zadataka i beležaka.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/notes"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Beleške
              </Link>
              <Link
                to="/tasks"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Zadaci
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Prijavite se da biste počeli
            </h2>
            <p className="text-blue-700 mb-6">
              Kreirajte nalog ili se prijavite da biste koristili aplikaciju.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Prijava
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Registracija
              </Link>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Beleške</h3>
            <p className="text-gray-600">
              Kreirajte i organizujte svoje beleške. Dodajte tagove za bolju organizaciju.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Zadaci</h3>
            <p className="text-gray-600">
              Upravljajte svojim zadacima, postavite rokove i pratite napredak.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Aktivnosti</h3>
            <p className="text-gray-600">
              Otkrijte nove aktivnosti kada ne znate šta da radite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
