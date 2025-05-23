import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { ChallengesContext } from "../context/ChallengesContext.js";
import challengeData from "../utils/challengeData.js";
import buttonStyles from "../pages/Buttons.module.css";

function ChallengePopup({ challengeKey, onClose }) {
  const challenge = challengeData[challengeKey];

  const {isUnlocked } = useContext(ChallengesContext);

  const [unlockedStages, setUnlockedStages] = useState([]);

  useEffect(() => {
    const stageKeys = Object.keys(challenge.stages);
    const unlockedStages = stageKeys.filter((stageKey) =>
      isUnlocked(challengeKey, stageKey)
    );
    setUnlockedStages(unlockedStages);
  }, [challengeKey, challenge, isUnlocked]);

  if (!challenge) return <></>;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80"> */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80 z-10">
        <h2 className="mb-2 font-bold text-lg text-center">
          {challenge.title}
        </h2>
        <p className="mb-4 text-center">{challenge.storyDescription}</p>

        {Object.keys(challenge.stages).map((stageKey) => {
          const { title } = challenge.stages[stageKey];
          const unlocked = unlockedStages.includes(stageKey);
          return (
            <Link 
              to={unlocked ? `/challenge/${challengeKey}/${stageKey}` : "#"} 
              key={stageKey}
              onClick={(e) => !unlocked && e.preventDefault()}
            >
              <button 
                className={`px-4 py-2 rounded my-1 ${unlocked ? `${buttonStyles.redButton}` : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} 
                title={ unlocked ? `Start ${title}` : "Unlock this stage by completing previous stages" }
              >
                {title}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
    // </div>
  );
}

export default ChallengePopup;
