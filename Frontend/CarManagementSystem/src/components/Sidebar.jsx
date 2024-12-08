import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaCarAlt, FaClipboardList, FaMoneyBillWave, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Mobile Hamburger Button - moved to right */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 rounded-md md:hidden text-gray-600 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Kiraye Di Gaddi</h1>
        </div>

        <nav className="mt-8 flex flex-col">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile when link is clicked
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
    </>
  );
}

export default Sidebar; 