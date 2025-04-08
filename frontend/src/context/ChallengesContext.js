import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { fetchAPI } from "../utils/utils";
import data from "../utils/challengeData.js";

export const ChallengesContext = createContext();

export const ChallengesProvider = ({ children }) => {
  const [challengeData, setChallengeData] = useState({});
  const { user } = useContext(AuthContext);

  const isUnlocked = useCallback(
    (challengeKey, stageKey) => {
      const prerequisites =
        data[challengeKey].stages?.[stageKey]?.prerequisites || [];
      return prerequisites.every(
        (prerequisite) =>
          challengeData[`${challengeKey}-${prerequisite}`] !== undefined
      );
    },
    [challengeData]
  );

  const fetchChallenges = async () => {
    try {
      const response = await fetchAPI("/users/challenges", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      setChallengeData(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  return (
    <ChallengesContext.Provider value={{ challengeData, isUnlocked, fetchChallenges }}>
      {children}
    </ChallengesContext.Provider>
  );
};
