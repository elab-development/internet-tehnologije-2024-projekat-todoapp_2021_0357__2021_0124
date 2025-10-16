import { Outlet } from 'react-router-dom';

// layout za stranice gde korisnik nije ulogovan
const GuestLayout = () => {
  return <Outlet />;
};

export default GuestLayout;
