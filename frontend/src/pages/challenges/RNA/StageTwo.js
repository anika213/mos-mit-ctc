import React, { useState } from "react";
import buttonStyles from "../../Buttons.module.css"
import styles from "./StageTwo.module.css";
import Popup from "../../../components/Popup";
import {playClick, victoryClick, incorrectClick} from '../../../components/ChallengesSound';


// TODO: Make more specific feedback for incorrect answers
// TODO: Change all colors in teh module.css file to match the color scheme of the website
// TODO: I feel like on a phone, the clicking is weird, need to click twice..
// TODO: Make the grid responsive t screen size

const sequence =
  "AUGCGCUAAGGUGGGAGGCAUGGAAUAGGCUAUGGGUAAUAGGGUAUGGUCAAAAGCAUGGGCUAAGUCGAAUACAGCUAUGA";

const RNASplicingMedium = ({onComplete}) => {
    const gridSize = 12; // Adjust grid size (12x7 for this sequence)
    const gridLetters = Array.from({ length: Math.ceil(sequence.length / gridSize) }, (_, rowIndex) =>
        sequence.slice(rowIndex * gridSize, (rowIndex + 1) * gridSize).split("")
    );

    const [grid, setGrid] = useState(
        gridLetters.map((row) => row.map(() => false))
    );

    const handleCellClick = (rowIndex, colIndex) => {
        playClick();
        setGrid((prevGrid) =>
            prevGrid.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((cell, cIdx) => (cIdx === colIndex ? !cell : cell))
                    : row
            )
        );
    };
    const correct_answers = [
        { row: 0, col: 10 },
        { row: 0, col: 11 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 2, col: 11 },
        { row: 3, col: 0 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 0 },
        { row: 4, col: 1 },
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 5, col: 10 },
        { row: 5, col: 11 },
        { row: 6, col: 0 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 }
    ];
    const [alertShowing, setAlertShowing] = useState(false);
    const [alertText, setAlertText] = useState("");


    const handleDone = () => {
        const clicked = [];
        grid.forEach((row, rowIndex) =>
            row.forEach((cell, colIndex) => {
                if (cell) clicked.push({ row: rowIndex, col: colIndex });
            })
        );

        // check whether clicked cells are correct
        let correct = true;
        if (clicked.length !== correct_answers.length) {
            correct = false;
        } else {
            for (let i = 0; i < clicked.length; i++) {
                if (
                    clicked[i].row !== correct_answers[i].row ||
                    clicked[i].col !== correct_answers[i].col
                ) {
                    correct = false;
                    break;
                }
            }
        }
        if (correct) {
            victoryClick();
            setAlertShowing(true);
            setAlertText("Congratulations! You have successfully completed the challenge.");
            onComplete();
        } else {
            incorrectClick();
            setAlertShowing(true);
            setAlertText("Incorrect. Please try again.")
        }
        
    };

    const handleReset = () => {
        setGrid(gridLetters.map((row) => row.map(() => false)));
    };

    return (
        <div className={styles.container}>
            {alertShowing ? (
        <Popup alertText={alertText} setAlertShowing={setAlertShowing} />
      ) : null}
            <div className={styles.grid}>
                {gridLetters.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.row}>
                        {row.map((letter, colIndex) => (
                            <div
                                key={colIndex}
                                className={`${styles.cell} ${
                                    grid[rowIndex][colIndex] ? styles.selected : ""
                                }`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <br></br>
            <button onClick={handleReset} className={styles.doneButton}>
                Reset
            </button>

            <button onClick={handleDone} className={`px-7 py-2 m-2 text-white ${buttonStyles.blackButton}`}>
                Done
            </button>
            
        </div>
    );
};

export default RNASplicingMedium;

