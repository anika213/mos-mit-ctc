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

  const toggleDropdown = (state) => {
    setDropdownOpen(state);
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

        {/* <ul className={`md:flex md:items-center md:space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}> */}
        <ul className={`md:flex flex flex-col md:flex-row items-center justify-center md:gap-x-6 gap-y-8 md:pb-0 pb-16 absolute md:static md:z-auto bg-black left-0 w-full md:w-auto ml-0 duration-200 ease-in ${isMobileMenuOpen ? 'top-16 ':'top-[-490px]'}`}>
          <li><Link to="/" className="hover:text-gray-400 duration-500 md:mb-0 mb-7">Home</Link></li>
          <li><Link to="/leaderboard" className="hover:text-gray-400 duration-500 md:mb-0 mb-7" >Leaderboard</Link></li>
          <div  onClick={toggleDropdown}
                onMouseEnter={() => toggleDropdown(true)}
                onMouseLeave={() => toggleDropdown(false)}
                >
            <li className="relative group duration-500 md:list-item flex flex-col items-center" >
                <span 
                className="cursor-pointer hover:text-gray-400 duration-500 pb-2" 
               
                >
                  Challenges ▼
                </span>
                {isDropdownOpen && (
                <ul className="md:absolute static left-0 md:p-4 p-0 bg-black text-white shadow-lg rounded-md w-48 "
                
                >
                  <li className="p-2 hover:bg-gray-700 duration-300 rounded-md"><button className="md:block w-full inline md:w-auto" onClick={() => handleChallengeClick('/challenge/RNA')}>RNA Challenge</button></li>
                  <li className="p-2 hover:bg-gray-700 duration-300 rounded-md"><button className="block w-full md:inline md:w-auto" onClick={() => handleChallengeClick('/challenge/Molecules')}>Molecular Docking</button></li>
                  <li className="p-2 hover:bg-gray-700 duration-300 rounded-md"><button className="block w-full md:inline md:w-auto" onClick={() => handleChallengeClick('/challenge/Wireless')}>Wireless Detection</button></li>
                </ul>
              )}
            </li>
          </div>
          {!isAuthenticated ? (
            <li><Link to="/login" className={` duration-500bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600  ${buttonStyles.redButton}`}>Login</Link></li>
          ) : (
            <li>
              <button onClick={handleLogout} className={` duration-500 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600  ${buttonStyles.redButton}`}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;