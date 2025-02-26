import React, { useState, useEffect } from 'react';
import buttonStyles from './Buttons.module.css'
import rnaComplete from '../assets/badges/rna-complete.png';
import rnaExpert from '../assets/badges/rna-expert.png';
import rnaTime from '../assets/badges/rna-time.png';
import moleculesComplete from '../assets/badges/molecules-complete.png';
import moleculesExpert from '../assets/badges/molecules-expert.png';
import moleculesTime from '../assets/badges/molecules-time.png';
import wirelessComplete from '../assets/badges/wireless-complete.png';
import wirelessExpert from '../assets/badges/wireless-expert.png';
import wirelessTime from '../assets/badges/wireless-time.png';
import allTime from '../assets/badges/all-time.png';
import allComplete from '../assets/badges/all-complete.png';
import allExpert from '../assets/badges/all-expert.png';
import allBadges from '../assets/badges/all-badges.png';
import allDefault from '../assets/badges/all-default.png';
import unavailableBadgeDefault from '../assets/badges/unavailable-default.png';
import unavailableBadgeExpert from '../assets/badges/unavailable-expert.png';
import unavailableBadgeTime from '../assets/badges/unavailable-time.png';


function AchievementsModal(props) {

    const [achievementsDict, setAchievementsDict] = useState({
        'RNA-Complete': [false, rnaComplete, unavailableBadgeDefault],
        'Molecules-Complete': [false, moleculesComplete, unavailableBadgeDefault],
        'Wireless-Complete': [false, wirelessComplete, unavailableBadgeDefault],

        'RNA-Expert': [false, rnaExpert, unavailableBadgeExpert],
        'Molecules-Expert': [false, moleculesExpert, unavailableBadgeExpert],
        'Wireless-Expert': [false, wirelessExpert, unavailableBadgeExpert],

        'RNA-Time': [false, rnaTime, unavailableBadgeTime],
        'Molecules-Time': [false, moleculesTime, unavailableBadgeTime],
        'Wireless-Time': [false, wirelessTime, unavailableBadgeTime],

        'All-Complete': [false, allDefault, unavailableBadgeDefault],
        'All-Time': [false, allTime, unavailableBadgeTime],
        'All-Expert': [false, allExpert, unavailableBadgeExpert],
        'All-Complete-Expert': [false, allComplete, unavailableBadgeExpert],
        'All-Achievements': [false, allBadges, unavailableBadgeExpert],
    })

    const changeAchievements = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/challenges', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const userData = await response.json();
        console.log(userData);

        let tempAchievementsDict = achievementsDict;

        if ('RNA-Easy' in userData && 'RNA-Medium' in userData) {
            tempAchievementsDict['RNA-Complete'][0] = true;
        }
        if ('Molecules-Easy' in userData && 'Molecules-Medium' in userData) {
            tempAchievementsDict['Molecules-Complete'][0] = true;
        }
        if ('Wireless-Easy' in userData && 'Wireless-Medium' in userData) {
            tempAchievementsDict['Wireless-Complete'][0] = true;
        }

        if ('RNA-Hard' in userData) {
            tempAchievementsDict['RNA-Expert'][0] = true;
        }
        if ('Molecules-Hard' in userData) {
            tempAchievementsDict['Molecules-Expert'][0] = true;
        }
        if ('Wireless-Hard' in userData) {
            tempAchievementsDict['Wireless-Expert'][0] = true;
        }

        if (userData['RNA-Easy'] < 10000 && userData['RNA-Medium'] < 10000) {
            tempAchievementsDict['RNA-Time'][0] = true;
        }
        if (userData['Molecules-Easy'] < 10000 && userData['Molecules-Medium'] < 10000) {
            tempAchievementsDict['Molecules-Time'][0] = true;
        }
        if (userData['Wireless-Easy'] < 10000 && userData['Wireless-Medium'] < 10000) {
            tempAchievementsDict['Wireless-Time'][0] = true;
        }

        if ('RNA-Easy' in userData && 'RNA-Medium' in userData && 'Molecules-Easy' in userData && 'Molecules-Medium' in userData && 'Wireless-Easy' in userData && 'Wireless-Medium' in userData) {
            tempAchievementsDict['All-Complete'][0] = true;
        }
        if (tempAchievementsDict['RNA-Time'][0] && tempAchievementsDict['Molecules-Time'][0] && tempAchievementsDict['Wireless-Time'][0]) {
            tempAchievementsDict['All-Time'][0] = true;
        }
        if (tempAchievementsDict['RNA-Expert'][0] && tempAchievementsDict['Molecules-Expert'][0] && tempAchievementsDict['Wireless-Expert'][0]) {
            tempAchievementsDict['All-Expert'][0] = true;
        }
        if (tempAchievementsDict['All-Complete'][0] && tempAchievementsDict['All-Expert'][0]) {
            tempAchievementsDict['All-Complete-Expert'][0] = true;
        }
        if (tempAchievementsDict['All-Complete'][0] && tempAchievementsDict['All-Time'][0] && tempAchievementsDict['All-Expert'][0]) {
            tempAchievementsDict['All-Achievements'][0] = true;
        }

        setAchievementsDict(tempAchievementsDict);
        console.log(achievementsDict)
        return userData;
    }

    useEffect(() => {
        changeAchievements();
    }
        , [changeAchievements])

    return (
        props.isOpen ?
            <>
                <div className='absolute z-10 flex w-full h-full justify-center items-center'>
                    <div className='bg-white w-3/4 h-3/4 rounded-lg shadow-lg p-8 border-8 border-red-500 flex flex-col justify-center items-center'>
                        <h1>Achievements</h1>
                        <div className='flex flex-wrap justify-between items-center w-full my-8'>
                            {Object.keys(achievementsDict).map((key) => {
                                return (
                                    <img key={key} className='w-[14%] h-auto p-2' src={achievementsDict[key][0] ? achievementsDict[key][1] : achievementsDict[key][2]} alt={key} />
                                )
                            }
                            )}
                        </div>
                        <button className={`${buttonStyles.redButton} px-4 py-2`} onClick={props.onClose}>Done</button>
                    </div>

                </div>
            </>
            : null
    )
}

export default AchievementsModal;