import React, { useState, useEffect, useContext, useCallback } from "react";
import { fetchAPI } from "../utils/utils";
import buttonStyles from "./Buttons.module.css";
import rnaComplete from "../assets/badges/rna-complete.png";
import rnaExpert from "../assets/badges/rna-expert.png";
import rnaTime from "../assets/badges/rna-time.png";
import moleculesComplete from "../assets/badges/molecules-complete.png";
import moleculesExpert from "../assets/badges/molecules-expert.png";
import moleculesTime from "../assets/badges/molecules-time.png";
import wirelessComplete from "../assets/badges/wireless-complete.png";
import wirelessExpert from "../assets/badges/wireless-expert.png";
import wirelessTime from "../assets/badges/wireless-time.png";
import allTime from "../assets/badges/all-time.png";
import allComplete from "../assets/badges/all-complete.png";
import allExpert from "../assets/badges/all-expert.png";
import allBadges from "../assets/badges/all-badges.png";
import allDefault from "../assets/badges/all-default.png";
import unavailableBadgeDefault from "../assets/badges/unavailable-default.png";
import unavailableBadgeExpert from "../assets/badges/unavailable-expert.png";
import unavailableBadgeTime from "../assets/badges/unavailable-time.png";
import { ChallengesContext } from "../context/ChallengesContext";

function AchievementsModal(props) {
  const { challengeData } = useContext(ChallengesContext);

  const [achievementsDict, setAchievementsDict] = useState({
    "RNA-Complete": [false, rnaComplete, unavailableBadgeDefault],
    "Molecules-Complete": [false, moleculesComplete, unavailableBadgeDefault],
    "Wireless-Complete": [false, wirelessComplete, unavailableBadgeDefault],

    "RNA-Expert": [false, rnaExpert, unavailableBadgeExpert],
    "Molecules-Expert": [false, moleculesExpert, unavailableBadgeExpert],
    "Wireless-Expert": [false, wirelessExpert, unavailableBadgeExpert],

    "RNA-Time": [false, rnaTime, unavailableBadgeTime],
    "Molecules-Time": [false, moleculesTime, unavailableBadgeTime],
    "Wireless-Time": [false, wirelessTime, unavailableBadgeTime],

    "All-Complete": [false, allDefault, unavailableBadgeDefault],
    "All-Time": [false, allTime, unavailableBadgeTime],
    "All-Expert": [false, allExpert, unavailableBadgeExpert],
    "All-Complete-Expert": [false, allComplete, unavailableBadgeExpert],
    "All-Achievements": [false, allBadges, unavailableBadgeExpert],
  });

  const changeAchievements = useCallback(async () => {
    let tempAchievementsDict = achievementsDict;

    if ("RNA-StageOne" in challengeData && "RNA-StageTwo" in challengeData) {
      tempAchievementsDict["RNA-Complete"][0] = true;
    }
    if ("Molecules-StageOne" in challengeData && "Molecules-StageTwo" in challengeData) {
      tempAchievementsDict["Molecules-Complete"][0] = true;
    }
    if ("Wireless-StageOne" in challengeData && "Wireless-StageTwo" in challengeData) {
      tempAchievementsDict["Wireless-Complete"][0] = true;
    }

    if ("RNA-Hard" in challengeData) {
      tempAchievementsDict["RNA-Expert"][0] = true;
    }
    if ("Molecules-Hard" in challengeData) {
      tempAchievementsDict["Molecules-Expert"][0] = true;
    }
    if ("Wireless-Hard" in challengeData) {
      tempAchievementsDict["Wireless-Expert"][0] = true;
    }

    if (challengeData["RNA-StageOne"] < 10000 && challengeData["RNA-StageTwo"] < 10000) {
      tempAchievementsDict["RNA-Time"][0] = true;
    }
    if (
      challengeData["Molecules-StageOne"] < 10000 &&
      challengeData["Molecules-StageTwo"] < 10000
    ) {
      tempAchievementsDict["Molecules-Time"][0] = true;
    }
    if (
      challengeData["Wireless-StageOne"] < 10000 &&
      challengeData["Wireless-StageTwo"] < 10000
    ) {
      tempAchievementsDict["Wireless-Time"][0] = true;
    }

    if (
      "RNA-StageOne" in challengeData &&
      "RNA-StageTwo" in challengeData &&
      "Molecules-StageOne" in challengeData &&
      "Molecules-StageTwo" in challengeData &&
      "Wireless-StageOne" in challengeData &&
      "Wireless-StageTwo" in challengeData
    ) {
      tempAchievementsDict["All-Complete"][0] = true;
    }
    if (
      tempAchievementsDict["RNA-Time"][0] &&
      tempAchievementsDict["Molecules-Time"][0] &&
      tempAchievementsDict["Wireless-Time"][0]
    ) {
      tempAchievementsDict["All-Time"][0] = true;
    }
    if (
      tempAchievementsDict["RNA-Expert"][0] &&
      tempAchievementsDict["Molecules-Expert"][0] &&
      tempAchievementsDict["Wireless-Expert"][0]
    ) {
      tempAchievementsDict["All-Expert"][0] = true;
    }
    if (
      tempAchievementsDict["All-Complete"][0] &&
      tempAchievementsDict["All-Expert"][0]
    ) {
      tempAchievementsDict["All-Complete-Expert"][0] = true;
    }
    if (
      tempAchievementsDict["All-Complete"][0] &&
      tempAchievementsDict["All-Time"][0] &&
      tempAchievementsDict["All-Expert"][0]
    ) {
      tempAchievementsDict["All-Achievements"][0] = true;
    }

    setAchievementsDict(tempAchievementsDict);
    return challengeData;
  }, [achievementsDict, challengeData]);

  useEffect(() => {
    changeAchievements();
  }, [challengeData, changeAchievements]);

  return props.isOpen ? (
    <>
      <div className="absolute z-10 flex w-full h-full justify-center items-center">
        <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg p-8 border-8 border-red-500 flex flex-col justify-center items-center">
          <h1>Achievements</h1>
          <div className="flex flex-wrap justify-between items-center w-full my-8">
            {Object.keys(achievementsDict).map((key) => {
              return (
                <img
                  key={key}
                  className="w-[14%] h-auto p-2"
                  src={
                    achievementsDict[key][0]
                      ? achievementsDict[key][1]
                      : achievementsDict[key][2]
                  }
                  alt={key}
                />
              );
            })}
          </div>
          <button
            className={`${buttonStyles.redButton} px-4 py-2`}
            onClick={props.onClose}
          >
            Done
          </button>
        </div>
      </div>
    </>
  ) : null;
}

export default AchievementsModal;
