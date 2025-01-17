import React, { useState } from "react";
import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";
import ReactLazy from "react";

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
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleChallengeChange = (event) => {
    setSelectedChallenge(event.target.value);
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const getCurrentChallengeData = () => {
    if (selectedChallenge && selectedLevel) {
      return challengeData[selectedChallenge][selectedLevel];
    }
    return { title: "Challenge Name", description: "Challenge Description" };
  };

  const { title, description } = getCurrentChallengeData();

  const renderChallengeComponent = () => {
    if (!selectedChallenge || !selectedLevel) {
      return <p className={styles.paragraphBox}>Please select a challenge and level.</p>;
    }

    try {
      const ChallengeComponent = React.lazy(() =>
        import(`./challenges/${selectedChallenge}/${selectedLevel}.js`)
      );
      return (
        <React.Suspense fallback={<p>Loading challenge...</p>}>
          <ChallengeComponent />
        </React.Suspense>
      );
    } catch (error) {
      return <p>Error loading challenge. Please try again.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.paragraphBox}>{description}</p>
      <div className={styles.selectorContainer}>
      <div className={styles.labelRow}>
        <label>Select Challenge:</label>
        <label>Select Level:</label>
      </div>
      <div className={styles.dropdownRow}>
        <select value={selectedChallenge} onChange={handleChallengeChange}>
          <option value="">--Choose a Challenge--</option>
          <option value="RNA">RNA</option>
          <option value="Molecules">Molecules</option>
          <option value="Wireless">Wireless</option>
        </select>
        <select value={selectedLevel} onChange={handleLevelChange}>
          <option value="">--Choose a Level--</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
        </select>
      </div>
    </div>



      <div className={styles.challengesContainer}>{renderChallengeComponent()}</div>
    </div>
  );
}

export default Challenge;
