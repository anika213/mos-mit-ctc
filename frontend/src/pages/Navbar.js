import React, { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-bold">Project Name</div>
        <div className="md:hidden" onClick={toggleMobileMenu}>
          <div className="text-2xl">☰</div>
        </div>
        <ul className={`md:flex md:items-center md:space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <li><a href="#" className="hover:text-gray-400">Home</a></li>
          <li><a href="#" className="hover:text-gray-400">Leaderboard</a></li>
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
                <li className="p-2 hover:bg-gray-700"><a href="#">Challenge 1</a></li>
                <li className="p-2 hover:bg-gray-700"><a href="#">Challenge 2</a></li>
              </ul>
            )}
          </li>
          <li><a href="#" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Login</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;