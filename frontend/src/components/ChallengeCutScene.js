import React, { useState } from "react";
import buttonStyles from '../pages/Buttons.module.css'
import styles from './ChallengeCutScene.module.css'


function ChallengeCutScene({ cutSceneList, startChallenge}) {

    const [slide, setSlide] = useState(0);

    const nextSlide = () => {
        if (slide < cutSceneList.length - 1) {
            setSlide(slide + 1);
        }
        console.log(slide);
    }

    return (
        <div className="flex flex-col items-center justify-between w-full h-full m-4">
            <div className='flex flex-col items-center py-2 md:py-20 w-3/4'>
                <p className='text-xl m-8'>{cutSceneList[slide].text}</p>
                <button 
                className={`${styles.button} ${buttonStyles.redButton}`} 
                onClick={
                    slide === cutSceneList.length - 1 ? startChallenge :
                    nextSlide}>{cutSceneList[slide].button}</button>
            </div>
        </div>
    );
}

export default ChallengeCutScene;
