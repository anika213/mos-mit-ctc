import React, { useState } from "react";
import styles from "./Hard.module.css";

const Hard = ({onComplete}) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleDone = () => {
        console.log("Input value:", inputValue);

        onComplete();
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

export default Hard;
