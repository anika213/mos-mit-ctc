import click from '../assets/popTogether.mp3'
import ding from '../assets/ding.mp3'
import victory from '../assets/victory.mp3'
import incorrect from '../assets/incorrect.m4a'
const clickAudio = new Audio(click);
const dingAudio = new Audio(ding);
const victoryAudio = new Audio(victory)
const incorrectAudio = new Audio(incorrect)



export function playClick() {
    clickAudio.currentTime = 0;
    clickAudio.play();
}

export function dingClick() {
    dingAudio.currentTime = 0;
    dingAudio.play();
}

export function victoryClick() {
    victoryAudio.currentTime = 0;
    victoryAudio.play();
}

export function incorrectClick() {
    incorrectAudio.currentTime = 0;
    incorrectAudio.play();
}