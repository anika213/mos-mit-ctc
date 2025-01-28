// Challenge.js
import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChallengeNavbar from "../components/ChallengesNavbar.js";
import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";

const challengeData = {
  RNA: {
    Easy: {
      title: "RNA Splicing",
      description: "Drag each block of RNA to form a complete protein!",
    },
    Medium: {
      title: "RNA Splicing",
      description: "Select all the introns in the given RNA sequence.",
    },
    Hard:{
      title: "RNA Splicing",
      description: "Hard description"
    }
  },
  Molecules: {
    Easy: {
      title: "Molular docking",
      description: "Connect each molecule to its corresponding binding site",
    },
    Medium: {
      title: "Molular docking",
      description: "Connect each molecule to its corresponding binding site",
    },
    Hard:{
      title: "Molecular Docking",
      description: "Hard Description."
    }
  },
  Wireless: {
    Easy: {
      title: "Wireless Detection",
      description: "Classify each breathing pattern as regular or irregular.",
    },
    Medium: {
      title: "Wireless Detection",
      description: "Classify each breathing pattern",
    },
    Hard:{
      title: "Wireless Detection",
      description: "Hard Description."
    }
  },
};

function Challenge() {
  let { challengeName } = useParams();
  // const [selectedChallenge, setSelectedChallenge] = useState(challengeName);
  const [startTime, setStartTime] = useState(Date.now());
  const [selectedLevel, setSelectedLevel] = useState("Easy");

  const updateLevelAndStartTime = useCallback((level) => {
    setSelectedLevel(level);  
    setStartTime(Date.now());
  }, []);

  const handleLevelChange = (event) => {
    updateLevelAndStartTime(event.target.value);
  };

  useEffect(() => {
    // Reset to Easy level whenever the challenge changes
    updateLevelAndStartTime("Easy");
  }, [challengeName]);

  const { title, description } = challengeData[challengeName][selectedLevel];

  const onComplete = useCallback(() => {
    // mark challenge as complete in the backend
    const endTime = Date.now();
    fetch("http://localhost:8080/users/challenges", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        challenge: `${challengeName}-${selectedLevel}`,
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
  }, [challengeName, selectedLevel]);

  const DynamicChallengeComponent = React.lazy(() =>
    import(`./challenges/${challengeName}/${selectedLevel}.js`).catch(() =>
      import("../components/ChallengeFallback.js")
    )
  );
  return (
    <div>
      <Navbar />
  
      <div className={styles.challengeBox} key={challengeName}>
        <div className={styles.navbarWrapper}>
          <ChallengeNavbar
            selectedChallenge={challengeName}
            onChallengeSelect={(newChallenge) =>
              (window.location.href = `/challenge/${newChallenge}`)
            }
          />
        </div>
        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.levelSelector}>
          <label>Select Level:</label>
          <select value={selectedLevel} onChange={handleLevelChange}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option> 
           <option value="Hard">Hard</option>

          </select>
        </div>
        <div className={styles.challengeContent}>
          <Suspense fallback={<p>Loading challenge...</p>}>
            <DynamicChallengeComponent onComplete={onComplete} />
          </Suspense>
        </div>
      </div>
    </div>
  );
  
}

export default Challenge;
