import React, { useState } from "react";
import styles from "./Molecules.module.css";

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
