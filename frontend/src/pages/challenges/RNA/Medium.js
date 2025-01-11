import React, { useState } from "react";
import styles from "./Medium.module.css";

const sequence =
  "AUGCGCUAAGGUGGGAGGCAUGGAAUAGGCUAUGGGUAAUAGGGUAUGGUCAAAAGCAUGGGCUAAGUCGAAUACAGCUAUGA";

const Medium = () => {
    const gridSize = 12; // Adjust grid size (12x7 for this sequence)
    const gridLetters = Array.from({ length: Math.ceil(sequence.length / gridSize) }, (_, rowIndex) =>
        sequence.slice(rowIndex * gridSize, (rowIndex + 1) * gridSize).split("")
    );

    const [grid, setGrid] = useState(
        gridLetters.map((row) => row.map(() => false))
    );
    const [clickedCells, setClickedCells] = useState([]);

    const handleCellClick = (rowIndex, colIndex) => {
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
    
    const handleDone = () => {
        const clicked = [];
        grid.forEach((row, rowIndex) =>
            row.forEach((cell, colIndex) => {
                if (cell) clicked.push({ row: rowIndex, col: colIndex });
            })
        );
        setClickedCells(clicked);

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
            alert("Congratulations! You have successfully completed the challenge.");
        } else {
            alert("Incorrect. Please try again.");
        }
        
    };

    return (
        <div className={styles.container}>
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
            <button onClick={handleDone} className={styles.doneButton}>
                Done
            </button>
            {clickedCells.length > 0 && (
                <div className={styles.results}>
                    <h2>Clicked Cells:</h2>
                    <ul>
                        {clickedCells.map(({ row, col }, index) => (
                            <li key={index}>
                                Row: {row + 1}, Column: {col + 1}, Letter:{" "}
                                {gridLetters[row][col]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Medium;

