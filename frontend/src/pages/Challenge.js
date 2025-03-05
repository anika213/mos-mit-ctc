// Challenge.js
import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChallengeCutScene from "../components/ChallengeCutScene.js";

import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";
import { fetchAPI } from "../utils/utils.js";

// Challenge metadata
const challengeData = {
  RNA: {
    StageOne: {
      title: "RNA Splicing",
      description: "Drag each block of RNA to form a complete protein!",
      cutScene: [
        {
          text: "Welcome to our RNA splicing station! After our cells write a messenger RNA, a.k.a. mRNA, which contains information to make our proteins, we need to select the parts of the mRNA which are called “exons” that will actually be used for coding our protein to help create life-saving new drug treatments! The rest, called “introns,” are spliced, or cut out.",
          button: "Got it!"
        },
        {
          text: "But not all proteins are functional! For the mRNA to make a functional protein, we need to select the right introns and exons. But, our records of what the introns and exons are in each mRNA got lost during the earthquake. Can you help us choose the right exons to make a protein that works?",
          button: "Yes!"
        },
      ]
    },
    
    StageTwo: {
      title: "RNA Splicing",
      description: "Select all the introns in the given RNA sequence.",
    },
  },
  Molecules: {
    StageOne: {
      title: "Molular docking",
      description: "Connect each molecule to its corresponding binding site",
    },
    StageTwo: {
      title: "Molular docking",
      description: "Connect each molecule to its corresponding binding site",
    },
  },
  Wireless: {
    StageOne: {
      title: "Wireless Detection",
      description: "Classify each breathing pattern as regular or irregular.",
    },
    StageTwo: {
      title: "Wireless Detection",
      description: "Classify each breathing pattern",
    },
  },
  Expert: {
    RNA: {
      title: "RNA Splicing",
      description: "Pending",
    },
    MolecularDocking: {
      title: "Molecular Docking",
      description: "Pending",
    },
    WirelessDetection: {
      title: "Wireless Detection",
      description: "Pending",
    },
  }
};

function Challenge() {
  let { challengeName, stage } = useParams();

  const [startTime, setStartTime] = useState(Date.now());
  const [selectedLevel, setSelectedLevel] = useState("Easy");
  const [hasStarted, setHasStarted] = useState(false);

  const DynamicChallengeComponent = React.lazy(() =>
    import(`./challenges/${challengeName}/${stage}.js`).catch(() =>
      import("../components/ChallengeFallback.js")
    )
  );

  const updateLevelAndStartTime = useCallback((level) => {
    setSelectedLevel(level);
    setHasStarted(false);
  }, []);

  useEffect(() => {
    // Reset to Easy level whenever the challenge changes
    updateLevelAndStartTime("Easy");
  }, [challengeName, updateLevelAndStartTime]);

  const { title, description } = challengeData[challengeName][stage];

  const [showPopup, setShowPopup] = useState(false);

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

    if (selectedLevel === "Hard") {
      fetchAPI('/users/challenges/start', {
        method: "POST",
        body: {
          challenge: `${challengeName}-${selectedLevel}`,
        },
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
      body: {
      challenge: `${challengeName}-${selectedLevel}`,
      time: endTime - startTime,
      },
    })
      .then((res) => res.json())
      .then((data) => {
      console.log(data);
      })
      .catch((error) => {
      console.error("Error updating challenges:", error);
      });
  }, [challengeName, selectedLevel, startTime]);

  return (
    <div>
      <Navbar />

      <div className={styles.challengeBox} key={challengeName}>
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
            <Suspense fallback={<p>Loading challenge...</p>}>
              <DynamicChallengeComponent onComplete={onComplete} />
            </Suspense>
          ) : (
            <div className={styles.overlay}>

              {challengeData[challengeName][stage].cutScene ? 
                <ChallengeCutScene cutSceneList={challengeData[challengeName][stage].cutScene} startChallenge={() => {
                onStart();
                setHasStarted(true);
              }} /> : 

              <button
                className={styles.startButton}
                onClick={() => {
                  onStart();
                  setHasStarted(true);
                }}
              >
                Start
              </button>
            }
              


              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Challenge;
