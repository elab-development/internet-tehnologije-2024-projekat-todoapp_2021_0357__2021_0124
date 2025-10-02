import { Outlet } from 'react-router-dom';

// layout za stranice gde korisnik nije ulogovan
const GuestLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default GuestLayout;
