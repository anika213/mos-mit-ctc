import React, { useState } from "react";
import styles from "./MolecularDocking.module.css";

const Molecules = () => {
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
        href="https://colab.research.google.com/drive/1Lq0-nkXdoYjBJTHA_NaTBkJs8MQzioXx?usp=sharing"
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

export default Molecules;
