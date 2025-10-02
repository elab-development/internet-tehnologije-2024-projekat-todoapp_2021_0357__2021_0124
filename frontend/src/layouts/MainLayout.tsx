import { Outlet, Link } from 'react-router-dom';

// layout za stranice gde je korisnik ulogovan
const MainLayout = () => {
  return (
    <div>
      {/* navigacija */}
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/notes">Notes</Link> | 
        <Link to="/tasks">Tasks</Link> | 
        <button>Logout</button>
      </nav>
      
      {/* saaadržaaaj */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
