// Challenge.js
import React, { useState, Suspense, useEffect, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChallengeCutScene from "../components/ChallengeCutScene.js";

import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";
import { fetchAPI } from "../utils/utils.js";
import challengeData from "../utils/challengeData.js";
import { ChallengesContext } from "../context/ChallengesContext.js";

function getFullSlides(cutScene, description, hints) {
  let ans = []

  if (cutScene) {
    ans = ans.concat(cutScene)
  }

  if (description) {
    ans.push({ text: description, button: "Got it!" })
  }

  if (hints) {
    ans = ans.concat(hints.map((hint, index) => {
      return { text: hint, button: `Sounds good!` }
    }))
  }

  return ans;
} 

function Challenge() {
  const navigate = useNavigate();
  let { challengeName, stage } = useParams();
  const challenge = challengeData[challengeName];
  const stageData = challenge?.stages?.[stage];
  const { challengeData: userChallengeData, isUnlocked } = useContext(ChallengesContext);
  const isReady = Object.keys(userChallengeData).length > 0;

  const stages = Object.keys(challengeData[challengeName].stages);
  const currentIndex = stages.indexOf(stage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  
  const DynamicChallengeComponent = React.useMemo(() => React.lazy(() =>
    import(`./challenges/${challengeName}/${stage}.js`).catch(() =>
      import("../components/ChallengeFallback.js")
    )
  ), [challengeName, stage]);

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

  const onStart = () => {
    setStartTime(Date.now());

    if (stage === "Hard") {
      fetchAPI("/users/challenges/start", {
        method: "POST",
        body: JSON.stringify({
          challenge: `${challengeName}-${stage}`,
        }),
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error starting challenge:", error);
        });
    }
  };

  const { fetchChallenges } = useContext(ChallengesContext);

  const onComplete = useCallback(() => {
    // mark challenge as complete in the backend
    const endTime = Date.now();
    fetchAPI("/users/challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        challenge: `${challengeName}-${stage}`,
        time: endTime - startTime,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setChallengeCompleted(true);
        fetchChallenges();
      })
      .catch((error) => {
        console.error("Error updating challenges:", error);
      });
  }, [challengeName, stage, startTime, fetchChallenges]);

  const getHint = () => {
    const newIndex = (hintIndex + 1) % hints.length;
    setCurrentHint(hints[newIndex]);
    setHintIndex(newIndex);
    setShowHint(true);
  };

  // Reset hint state when challenge changes
  useEffect(() => {
    setShowHint(false);
    setCurrentHint("");
    setHintIndex(-1);
    setChallengeCompleted(false);
  }, [challengeName, stage]);

  useEffect(() => {
    if (!isReady) return

    if (!challenge || !stageData || !isUnlocked(challengeName, stage)) {
      navigate("/laboratory", { replace: true });
    }
  }, [challenge, stageData, challengeName, isReady, navigate, stage, isUnlocked]);
  
  if (!challenge || !stageData) {
    return (
      <div>
        <Navbar />
        <h1>Challenge not found.</h1>
      </div>
    );
  }

  const { title, description, hints } = stageData;

  return (
    <div key={stage}>
      <Navbar />

      <div className={styles.challengeBox}>
      { hasStarted &&
      <button 
          className={`${styles.hintButton}`} 
          onClick={getHint}
        >
          Hints
        </button>
        }
        {showPopup && (
          <div className={styles.rotateWarning}>
            <h1>Please rotate your mobile device</h1>
            <p>For the best experience, rotate your phone to landscape mode.</p>
          </div>
        )}

        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.challengeContent}>
          {hasStarted ? (
            <>
              <Suspense fallback={<p>Loading challenge...</p>}>
                <DynamicChallengeComponent key={`${challengeName}-${stage}`} onComplete={onComplete} />
              </Suspense>
              
                
              
              {showHint && (
                <div className={`${styles.hintBox} flex flex-col`}>
                  <h2 className='text-l'>Hint {hintIndex + 1} / {hints.length}</h2>
                  <div className='flex flex-row'>
                    <p className='text-[1rem] mb-2'>{currentHint}</p>
                  </div>
                  
                  <button 
                    className='bg-[#ff4343] text-white px-4 py-2 rounded-[5px] mx-auto '
                    onClick={() => setShowHint(false)}
                  >
                    Close
                  </button>
                </div>
              )}
              {challengeCompleted && (
                <div className={styles.completionButtons}>
                  <button 
                    className={styles.closeHintButton}
                    onClick={() => navigate("/laboratory")}
                  >
                    Return to Lab
                  </button>
                  <button 
                    className={styles.closeHintButton}
                    onClick={() => {
                      navigate(`/challenge/${challengeName}/${nextStage}`);
                    }}
                  >
                    Next Stage
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.overlay}>
              {challengeData[challengeName].stages[stage].cutScene ? (
                <ChallengeCutScene
                  cutSceneList={getFullSlides(challengeData[challengeName].stages[stage].cutScene, challengeData[challengeName].stages[stage].description, challengeData[challengeName].stages[stage].hints)}
                  startChallenge={() => {
                    onStart();
                    setHasStarted(true);
                  }}
                />
              ) : (
                <button
                  className={styles.startButton}
                  onClick={() => {
                    onStart();
                    setHasStarted(true);
                  }}
                >
                  Start
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Challenge;
