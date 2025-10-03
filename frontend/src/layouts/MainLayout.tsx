import { Outlet, Link } from 'react-router-dom';

// layout za stranice gde je korisnik ulogovan
const MainLayout = () => {
  return (
    <div>
      {/* navigacija */}
      <nav>
        <Link to="/">Početna</Link> | 
        <Link to="/notes">Beleške</Link> | 
        <Link to="/tasks">Zadaci</Link> | 
        <button>Odjava</button>
      </nav>
      
      {/* saaadržaaaj */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
