import React, { useContext, useState } from "react";
import styles from "./Laboratory.module.css";
import Navbar from "./Navbar.js";
import AchievementsModal from "./Achievements.js";
import { labCutscenes } from "../utils/challengeData.js";
import ChallengePopup from "../components/ChallengePopup.js";
import LabBackground from "../assets/background/lab-background.png";
import ExpertComputer from "../assets/background/expert-computer.png";
import WirelessUnsolved from "../assets/background/wireless-computer-bad.png";
import WirelessSolved from "../assets/background/wireless-computer-good.png";
import RNAComplete from "../assets/background/RNA-bckground-complete.png";
import RNAIncomplete from "../assets/background/RNA-incomplete.png";
import Achievements from "../assets/background/achievements-bckground.png";
import MolecularComplete from "../assets/background/molecular-bckground-complete.png";
import MolecularIncomplete from "../assets/background/molecular-bckground-incomplete.png";

import { ChallengesContext } from "../context/ChallengesContext.js";
import { useSearchParams } from "react-router-dom";
import ChallengeCutScene from "../components/ChallengeCutScene.js";
import { useEffect } from "react";

// TODO: fix the button sizing, kinda weird when changing screen size rn
function Laboratory() {
  const [searchParam, setSearchParam] = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  

  const [showCutscene, setShowCutScene] = useState(
    searchParam.get("firstVisit") !== null
  );

  const [achievementsIsOpen, setAchievementsIsOpen] = useState(false);
  const toggleAchievements = () => {
    setAchievementsIsOpen(!achievementsIsOpen);
  };

  const [activeChallenge, setActiveChallenge] = useState(null);

  const handleOpenPopup = (challengeKey) => {
    setActiveChallenge(challengeKey);
  };

  const { challengeData } = useContext(ChallengesContext);

  const isDone = (challenge) => {
    return (
      challengeData[`${challenge}-StageOne`] !== undefined &&
      challengeData[`${challenge}-StageTwo`] !== undefined
    );
  };

  const handleClosePopup = () => {
    setActiveChallenge(null);
  };

  const handleOrientationChange = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setShowPopup(isPortrait);
    };
    window.addEventListener("resize", handleOrientationChange);
  
    useEffect(() => {
      window.addEventListener("resize", handleOrientationChange);
      // Initial check in case the page loads in landscape mode
      handleOrientationChange();
      return () => window.removeEventListener("resize", handleOrientationChange);
    }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <Navbar />

        <div className={styles.imageContainer}>
          {showCutscene ? (
            <ChallengeCutScene
              cutSceneList={labCutscenes}
              startChallenge={() => {
                setShowCutScene(false);
                searchParam.delete("firstVisit");
                setSearchParam(searchParam);
              }}
            />
          ) : (
            <div>
              <img src={LabBackground} className={styles.mainImage} alt="LabBackground" />

              <button
                onClick={() => toggleAchievements()}
                className={styles.achievements}
              >
                <img src={Achievements} alt="Achievements" />
              </button>

              <button
                className={styles.expertComputer}
                onClick={() => handleOpenPopup("Expert")}
              >
                <img src={ExpertComputer} alt="ExpertComputer" />
              </button>

              <button
                onClick={() => handleOpenPopup("Wireless")}
                className={styles.wirelessComputer}
              >
                <img
                  src={isDone("Wireless") ? WirelessSolved : WirelessUnsolved}
                  alt="Wireless"
                />
              </button>

              <button
                onClick={() => handleOpenPopup("Molecules")}
                className={styles.molecules}
              >
                <img
                  src={
                    isDone("Molecules")
                      ? MolecularComplete
                      : MolecularIncomplete
                  }
                  alt="Molecules"
                />
              </button>

              <button
                onClick={() => handleOpenPopup("RNA")}
                className={styles.RNA}
              >
                <img src={isDone("RNA") ? RNAComplete : RNAIncomplete} alt="RNA" />
              </button>
            </div>
          )}
        </div>
        <AchievementsModal
          isOpen={achievementsIsOpen}
          onClose={() => toggleAchievements()}
        />

        {activeChallenge && (
          <ChallengePopup
            challengeKey={activeChallenge}
            onClose={handleClosePopup}
          />
        )}
        {showPopup && (
                  <div className='fixed top-0 left-0 w-full h-full flex flex-col text-center items-center justify-center bg-black bg-opacity-80 z-50 text-white font-lg'>
                    <h1>Please rotate your mobile device</h1>
                    <p>For the best experience, rotate your phone to landscape mode.</p>
                  </div>
        )}
      </div>
    </>
  );
}

export default Laboratory;
