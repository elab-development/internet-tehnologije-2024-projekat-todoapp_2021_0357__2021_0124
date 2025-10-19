import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Dobrodošli u poran.io
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Platforma za upravljanje sopstvenim vremenom gde možete da organizujete svoje zadatke, 
          beleške i aktivnosti na jednom mestu.
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Pristupite aplikaciji
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
            Kreirajte nalog ili se prijavite da biste koristili sve funkcionalnosti aplikacije.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/login"
              className="bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-lg font-medium shadow-sm hover:shadow-md"
            >
              Prijava
            </Link>
            <Link
              to="/register"
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 px-8 py-4 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 text-lg font-medium shadow-sm hover:shadow-md"
            >
              Registracija
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Beleške</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Kreirajte i organizujte svoje beleške. Dodajte tagove za bolju organizaciju.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Zadaci</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upravljajte svojim zadacima, postavite rokove i pratite napredak.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
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

export default HomePage;
