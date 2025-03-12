import React from "react";
import { Link } from "react-router-dom";
import challengeData from "../utils/challengeData";

function ChallengePopup({ challengeKey, onClose }) {
    const challenge = challengeData[challengeKey];
    if (!challenge) return null;
    const stageKeys = Object.keys(challenge.stages);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80">
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
                    return (
                        <Link to={`/challenge/${challengeKey}/${stageKey}`} key={stageKey}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded my-1">
                            {title}
                        </button>
                        </Link>
                    );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ChallengePopup;