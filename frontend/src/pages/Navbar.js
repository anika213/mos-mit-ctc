import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-bold">Clinical AI</div>
        <div className="md:hidden" onClick={toggleMobileMenu}>
          <div className="text-2xl">☰</div>
        </div>
        <ul className={`md:flex md:items-center md:space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <li><Link to="/home" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/leaderboard" className="hover:text-gray-400">Leaderboard</Link></li>
          <li className="relative group">
            <span 
              className="cursor-pointer hover:text-gray-400" 
              onMouseEnter={toggleDropdown} 
              onMouseLeave={toggleDropdown}
            >
              Challenges ▼
            </span>
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-black text-white shadow-lg rounded-md w-40">
                <li className="p-2 hover:bg-gray-700"><Link to="/challenge/rna">RNA Challenge</Link></li>
                <li className="p-2 hover:bg-gray-700"><Link to="/challenge/rna">Challenge 2</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/login" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;