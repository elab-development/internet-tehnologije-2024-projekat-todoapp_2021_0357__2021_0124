import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];

    // prvi element je "Početna"
    breadcrumbs.push({
      label: 'Početna',
      path: '/app'
    });

    // na pocetnoj nema dodatnih elemenata
    if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'app')) {
      return breadcrumbs;
    }

    // pravi breadcrumbs na osnovu putanje
    let currentPath = '/app';
    
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

      let label = '';
      
      // mapiraju se nazivi na one citljive za korisnika
      switch (segment) {
        case 'tasks':
          label = 'Zadaci';
          break;
        case 'notes':
          label = 'Beleške';
          break;
        case 'create':
          if (pathSegments[i - 1] === 'tasks') {
            label = 'Kreiranje zadatka';
          } else if (pathSegments[i - 1] === 'notes') {
            label = 'Kreiranje beleške';
          } else {
            label = 'Kreiranje';
          }
          break;
        case 'edit':
          if (pathSegments[i - 1] === 'tasks') {
            label = 'Izmena zadatka';
          } else if (pathSegments[i - 1] === 'notes') {
            label = 'Izmena beleške';
          } else {
            label = 'Izmena';
          }
          break;
        default:
          // ako je broj onda je id za edit stranicu
          if (!isNaN(Number(segment))) {
            if (pathSegments[i - 1] === 'tasks') {
              label = `Zadatak #${segment}`;
            } else if (pathSegments[i - 1] === 'notes') {
              label = `Beleška #${segment}`;
            } else {
              label = `#${segment}`;
            }
            // ne odvaja ovde id jer pravi komplikacije, a korisniku je realno nepotrebno
            continue;
          } else {
            // prvo slovo je veliko
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
          break;
      }

      breadcrumbs.push({
        label,
        path: currentPath
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // nema breadcrumbsa na pocetnoj stranici
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              
              {index === breadcrumbs.length - 1 ? (
                // stavka na kraju breadcrumb segmenta nije link
                <span className="text-gray-900 dark:text-white font-medium">
                  {breadcrumb.label}
                </span>
              ) : (
                // sve ostalo linkovi
                <Link
                  to={breadcrumb.path}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
