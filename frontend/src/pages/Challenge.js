// Challenge.js
import React, { useState, Suspense, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ChallengeNavbar from "../components/ChallengesNavbar.js";
import styles from "./Challenge.module.css";
import Navbar from "./Navbar.js";

const challengeData = {
  RNA: {
    Easy: {
      title: "RNA Splicing Easy Challenge",
      description: "Drag each block of RNA to form a complete protein!",
    },
    Medium: {
      title: "RNA Splicing Medium Challenge",
      description: "Select all the introns in the given RNA sequence.",
    },
  },
  Molecules: {
    Easy: {
      title: "Molecules Easy Challenge",
      description: "Connect each molecule to its corresponding binding site",
    },
    Medium: {
      title: "Molecules Medium Challenge",
      description: "Connect each molecule to its corresponding binding site",
    },
  },
  Wireless: {
    Easy: {
      title: "Wireless Easy Challenge",
      description: "Classify each breathing pattern as regular or irregular.",
    },
    Medium: {
      title: "Wireless Medium Challenge",
      description: "Classify each breathing pattern",
    },
  },
};

function Challenge() {

  let { challengeName } = useParams();
  // const [selectedChallenge, setSelectedChallenge] = useState(challengeName);
  const [selectedLevel, setSelectedLevel] = useState("Easy");

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  useEffect(() => {
    // Reset to Easy level whenever the challenge changes
    setSelectedLevel("Easy");
  }, [challengeName]);

  const { title, description } = challengeData[challengeName][selectedLevel];

  const DynamicChallengeComponent = React.lazy(() =>
    import(`./challenges/${challengeName}/${selectedLevel}.js`).catch(() =>
      import("../components/ChallengeFallback.js")
    )
  );

  return (
    <div>
<Navbar />
    
    <div className={styles.challengeBox} key={challengeName}>
     
      <h1 className={styles.heading}>{title}</h1>
      
      <p className={styles.description}>{description}</p>
      <div className={styles.levelSelector}>
      <ChallengeNavbar
        selectedChallenge={challengeName}
        onChallengeSelect={(newChallenge) =>
          (window.location.href = `/challenge/${newChallenge}`)
        }
      />
      <br></br>
        <label>Select Level:</label>
        <select value={selectedLevel} onChange={handleLevelChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
        </select>
      </div>
    
      <div className={styles.challengeContent}>
        <Suspense fallback={<p>Loading challenge...</p>}>
          <DynamicChallengeComponent />
        </Suspense>
      </div>
    </div>
    </div>
  );
}

export default Challenge;
