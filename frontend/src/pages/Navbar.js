import React, { useState, useContext } from 'react';
import buttonStyles from './Buttons.module.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Calls the logout function from AuthContext
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleChallengeClick = (link) => {
    navigate(link);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

  }

  return (
    <nav className="bg-black text-white z-10">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="text-xl font-bold"><Link to="/">Clinical AI</Link></div>
        <div className="md:hidden" onClick={toggleMobileMenu}>
          <div className="text-2xl">☰</div>
        </div>
        <ul className={`md:flex md:items-center md:space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/leaderboard" className="hover:text-gray-400">Leaderboard</Link></li>
          <li className="relative group" >
              <span 
              className="cursor-pointer hover:text-gray-400" 
              onClick={toggleDropdown}
              onMouseEnter={toggleDropdown}
              >
                Challenges ▼
              </span>
              {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-black text-white shadow-lg rounded-md w-40"
              onMouseLeave={isDropdownOpen ? toggleDropdown : null}
              >
                <li className="p-2 hover:bg-gray-700"><button onClick={() => handleChallengeClick('/challenge/RNA')}>RNA Challenge</button></li>
                <li className="p-2 hover:bg-gray-700"><button onClick={() => handleChallengeClick('/challenge/Molecules')}>Molecular Docking</button></li>
                <li className="p-2 hover:bg-gray-700"><button onClick={() => handleChallengeClick('/challenge/Wireless')}>Wireless Detection</button></li>
              </ul>
             )}
          </li>
          {!isAuthenticated ? (
            <li><Link to="/login" className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${buttonStyles.redButton}`}>Login</Link></li>
          ) : (
            <li>
              <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;