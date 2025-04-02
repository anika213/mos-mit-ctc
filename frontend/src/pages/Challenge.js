// Challenge.js
import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChallengeCutScene from "../components/ChallengeCutScene.js";

import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";
import { fetchAPI } from "../utils/utils.js";
import challengeData, { useIsUnlocked } from "../utils/challengeData.js";

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
  let { challengeName, stage } = useParams();
  const challenge = challengeData[challengeName];
  const stageData = challenge?.stages?.[stage];

  const isUnlockedCB = useIsUnlocked();

  const navigate = useNavigate();
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
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error starting challenge:", error);
        });
    }
  };

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
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating challenges:", error);
      });
  }, [challengeName, stage, startTime]);

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
  }, [challengeName, stage]);
  
  if (!challenge || !stageData) {
    return (
      <div>
        <Navbar />
        <h1>Challenge not found.</h1>
      </div>
    );
  }

  if ( !challenge || !stageData || !isUnlockedCB(challengeName, stage)) {
    navigate("/laboratory", { replace: true });
    return null;
  }

  const { title, description, hints } = stageData;

  return (
    <div>
      <Navbar />

      <div className={styles.challengeBox}>
        {showPopup && (
          <div className={styles.rotateWarning}>
            <h1>Please rotate your mobile device</h1>
            <p>For the best experience, rotate your phone to landscape mode.</p>
          </div>
        )}

        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <p className={styles.hints}>{hints}</p>

        <div className={styles.challengeContent}>
          {hasStarted ? (
            <>
              <Suspense fallback={<p>Loading challenge...</p>}>
                <DynamicChallengeComponent onComplete={onComplete} />
              </Suspense>
              <div className={styles.hintContainer}>
                <button 
                  className={styles.hintButton} 
                  onClick={getHint}
                >
                  Get Hint
                </button>
              </div>
              {showHint && (
                <div className={styles.hintBox}>
                  <h2>Hint {hintIndex + 1} / {hints.length}</h2>
                  <p>{currentHint}</p>
                  <button 
                    className={styles.closeHintButton}
                    onClick={() => setShowHint(false)}
                  >
                    Close
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
