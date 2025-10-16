import { Outlet } from 'react-router-dom';

// layout za stranice gde korisnik nije ulogovan
const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center dark:bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md dark:bg-gray-800">
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
