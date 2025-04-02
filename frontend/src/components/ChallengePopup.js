import React from "react";
import { Link } from "react-router-dom";
import challengeData, { useIsUnlocked } from "../utils/challengeData";
import buttonStyles from "../pages/Buttons.module.css";

function ChallengePopup({ challengeKey, onClose }) {
  const challenge = challengeData[challengeKey];
  const stageKeys = Object.keys(challenge.stages);

  const isUnlocked = useIsUnlocked();

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

        {stageKeys.map((stageKey) => {
          const { title } = challenge.stages[stageKey];
          const unlocked = isUnlocked(challengeKey, stageKey);
          return (
            <Link 
              to={unlocked ? `/challenge/${challengeKey}/${stageKey}` : "#"} 
              key={stageKey}
              onClick={(e) => !unlocked && e.preventDefault()}
            >
              <button 
                className={`px-4 py-2 rounded my-1 ${unlocked ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} 
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
