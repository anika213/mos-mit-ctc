import React, { createContext, useState, useEffect } from 'react';
import { fetchAPI } from '../utils/utils';

export const ChallengesContext = createContext();

export const ChallengesProvider = ({ children }) => {
  const [challengeData, setChallengeData] = useState({});

  const fetchChallenges = async () => {
    try {
      const response = await fetchAPI('/users/challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      setChallengeData(data);
      console.log('Fetched challenges:', data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <ChallengesContext.Provider value={{ challengeData, fetchChallenges }}>
      {children}
    </ChallengesContext.Provider>
  );
};