// Challenge.js
import React, { useState, Suspense } from "react";
import ChallengeNavbar from "../components/ChallengesNavbar.js";
import styles from "./Challenge.module.css";
import Navbar from "./Navbar.js";

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
  },
  Molecules: {
    Easy: {
      title: "Molecules Easy Challenge",
      description: "Learn how molecules interact with each other in this beginner challenge.",
    },
    Medium: {
      title: "Molecules Medium Challenge",
      description: "Test your knowledge of molecular interactions at an intermediate level.",
    },
  },
  Wireless: {
    Easy: {
      title: "Wireless Easy Challenge",
      description: "Understand the basics of wireless communication in this easy challenge.",
    },
    Medium: {
      title: "Wireless Medium Challenge",
      description: "Enhance your knowledge of wireless networks with this medium-level task.",
    },
  },
};

function Challenge() {
  const [selectedChallenge, setSelectedChallenge] = useState("RNA");
  const [selectedLevel, setSelectedLevel] = useState("Easy");

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const { title, description } = challengeData[selectedChallenge][selectedLevel];

  const DynamicChallengeComponent = React.lazy(() =>
    import(`./challenges/${selectedChallenge}/${selectedLevel}.js`).catch(() =>
      import("../components/ChallengeFallback.js")
    )
  );

  return (
    <div>
<Navbar />
    
    <div className={styles.challengeBox}>
     
      <h1 className={styles.heading}>{title}</h1>
      
      <p className={styles.description}>{description}</p>
      <div className={styles.levelSelector}>
      <ChallengeNavbar
        selectedChallenge={selectedChallenge}
        onChallengeSelect={setSelectedChallenge}
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
