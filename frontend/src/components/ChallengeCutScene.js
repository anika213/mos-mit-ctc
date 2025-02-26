import React, { useState } from "react";
import buttonStyles from '../pages/Buttons.module.css'
import scientistImg from '../assets/scientist.png'
import styles from './ChallengeCutScene.module.css'
import { motion, Variants } from 'framer-motion'


function ChallengeCutScene({ cutSceneList, startChallenge}) {

    const [slide, setSlide] = useState(0);

    const nextSlide = () => {
        if (slide < cutSceneList.length - 1) {
            setSlide(slide + 1);
        }
        console.log(slide);
    }

    const splitString = (text) => {
        const characters = [];
        const regex = /[\s\S]/gu;
        let match;
        while ((match = regex.exec(text)) !== null) {
            characters.push(match[0]);
        }
        return characters;
    }

    const splitText = splitString(cutSceneList[slide].text);
    console.log(splitText);

    const charVariants = {
        hidden: { opacity: 0 },
        reveal: {
            opacity: 1,
        }
    }

    const scientistVariants = {
        rotate: {
            rotate: 30,
            transition: {
                duration:0.8, 
                repeat: Infinity,
                repeatType: "reverse",
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-between w-full h-full m-4">
            <div className='relative flex-col items-center py-2 md:py-20 w-3/4'>
                <motion.p 
                    key={slide}
                    className='text-xl m-8'
                    initial='hidden' 
                    whileInView="reveal"
                    transition={{staggerChildren: 0.02}}
                >
                    {
                        splitText.map((char, index) => {
                            return (
                                <motion.span
                                  key={index} 
                                  transition={{duration: 0.2}} 
                                  variants={charVariants} 
                                >
                                    {char}
                                </motion.span>
                            )
                        })
                    }
                </motion.p>
                <motion.div 
                  className="w-32 absolute bottom-4 right-2"
                  whileInView={"rotate"}
                >  
                    <motion.img 
                      src={scientistImg}
                      variants={scientistVariants}
                      />
                </motion.div>        
                
            </div>
            <button 
                    className={`${styles.button} ${buttonStyles.redButton}`} 
                    onClick={
                        slide === cutSceneList.length - 1 ? startChallenge :
                    nextSlide}>{cutSceneList[slide].button}
                </button>
        </div>
    );
}

export default ChallengeCutScene;
