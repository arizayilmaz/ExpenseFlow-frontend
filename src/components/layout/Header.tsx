import { NavLink, useNavigate } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';
import { useData } from '../../context/DataContext';

function Header() {
  const { authToken, logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeLinkStyle = "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium";
  const inactiveLinkStyle = "text-slate-500 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium";

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaChartPie className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-slate-800">ExpenseFlow</h1>
            </div>
          </div>

          {authToken && (
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/expenses" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>My Expenses</NavLink>
                <NavLink to="/investments" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>My Investments</NavLink>
                <NavLink to="/assets" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>My Assets</NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>Reports</NavLink>
              </div>
            </nav>
          )}

          <div className="hidden md:block">
            {authToken ? (
              <button onClick={handleLogout} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium">
                Log Out
              </button>
            ) : (
              <NavLink to="/login" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Log In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;