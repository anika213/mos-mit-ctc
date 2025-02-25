import React, { useState } from "react";
import styles from "./AddChallenges.module.css";
import Navbar from "./Navbar";


function AddChallenges() {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        console.log(event.target.value);
        setInputValue(event.target.value);
        // send to backend
       

    };

    const handleDone = () => {
        console.log("Input value:", inputValue);
        fetch(process.env.REACT_APP_API_URL + '/challenges/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                suggestedChallenge: inputValue,
            }),
        })
    
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <Navbar />
                <div className={styles.content}>
                    <h1 className={styles.heading}>Suggest a new challenge</h1>
                    <p className={styles.subheading}>
                        Do you have any other ideas for new challenges? Let us know!
                    </p>
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
                
            </div>

        </div>
    );
};

export default AddChallenges;
