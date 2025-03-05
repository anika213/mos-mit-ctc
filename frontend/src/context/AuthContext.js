import React, { createContext, useState, useEffect } from 'react';
import { fetchAPI } from '../utils/utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fetches the user to determine if they are authenticated
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetchAPI('/users/status', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
            return;
          } 
          setUser(null);
          setIsAuthenticated(false); 
        } catch (error) {
          console.error('Error fetching user: ', error);
          setUser(null);
          setIsAuthenticated(false); 
        }
      };
  
      fetchUser();
    }, []); // This effect runs once when the component mounts

    // Login function to manually set the user and authentication state\
    const login = (userData) => {
      setUser(userData);
      setIsAuthenticated(true);
    }

    // Logout function to clear the user and authentication state
    const logout = async () => {
      try {
        fetchAPI('/users/logout', {
          method: 'POST',
          credentials: 'include',
        });
        
        setUser(null);
        setIsAuthenticated(false);
      } catch(err) {
        console.log('Error logging out: ', err);
      }
    }
  
    return (
      <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };