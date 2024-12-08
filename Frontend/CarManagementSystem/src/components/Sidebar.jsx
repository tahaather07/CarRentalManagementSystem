import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaCarAlt, FaClipboardList, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/bookings', icon: <FaCarAlt />, label: 'Bookings' },
    { path: '/inspections', icon: <FaClipboardList />, label: 'Inspections' },
    { path: '/payments', icon: <FaMoneyBillWave />, label: 'Payments' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Kiraye Di Gaddi</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <span className="mr-3"><FaSignOutAlt /></span>
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar; 