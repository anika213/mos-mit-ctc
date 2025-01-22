// Challenge.js
import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChallengeNavbar from "../components/ChallengesNavbar.js";
import Navbar from "./Navbar.js";
import styles from "./Challenge.module.css";

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
      description:
        "Learn how molecules interact with each other in this beginner challenge.",
    },
    Medium: {
      title: "Molecules Medium Challenge",
      description:
        "Test your knowledge of molecular interactions at an intermediate level.",
    },
  },
  Wireless: {
    Easy: {
      title: "Wireless Easy Challenge",
      description:
        "Understand the basics of wireless communication in this easy challenge.",
    },
    Medium: {
      title: "Wireless Medium Challenge",
      description:
        "Enhance your knowledge of wireless networks with this medium-level task.",
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

  const onComplete = useCallback(() => {
    // mark challenge as complete in the backend
    fetch("http://localhost:8080/users/challenges", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        challenge: `${challengeName}-${selectedLevel}`,
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
            <DynamicChallengeComponent onComplete={onComplete} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Challenge;
