import React, { useState } from "react";
import styles from "./RNA.module.css";

const RNA = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDone = () => {
    console.log("Input value:", inputValue);
  };

  return (
    <div className={styles.container}>
      <a
        className={styles.googleColabButton}
        href="https://colab.research.google.com/drive/1zbEVcrgS6oQSIE8wf5dRjE0ZMdHSvvo2?usp=sharing"
        target="_blank" rel="noreferrer"
      >
        Open Google Colab
      </a>

      <textarea
        value={inputValue}
        onChange={handleInputChange}
        className={styles.textBox}
        placeholder="Type here..."
      />
      <br />
      <button onClick={handleDone} className={styles.doneButton}>
        Done
      </button>
    </div>
  );
};

export default RNA;
