import { useContext, useCallback } from "react";
import { ChallengesContext } from "../context/ChallengesContext.js";
import { AuthContext } from "../context/AuthContext.js";

export const labCutscenes = [
  {
    text: "Cutscene stuff will go here",
    button: "Got it!",
  },
  {
    text: "Yay!",
    button: "Let's go",
  },
];

const challengeData = {
  RNA: {
    title: "RNA Splicing",
    storyDescription:
      "A horrific explosion destroyed the RNA station. Fix it lil bro.",
    stages: {
      StageOne: {
        title: "Stage One",
        description: "Drag each block of RNA to form a complete protein!",
        cutScene: [
          {
            text: "Welcome to our RNA splicing station! After our cells write a messenger RNA, a.k.a. mRNA, which contains information to make our proteins, we need to select the parts of the mRNA which are called “exons” that will actually be used for coding our protein to help create life-saving new drug treatments! The rest, called “introns,” are spliced, or cut out.",
            button: "Got it!",
          },
          {
            text: "But not all proteins are functional! For the mRNA to make a functional protein, we need to select the right introns and exons. But, our records of what the introns and exons are in each mRNA got lost during the earthquake. Can you help us choose the right exons to make a protein that works?",
            button: "Yes!",
          },
        ],
        hints: ["Hint 1", "Hint 2"],
        prerequisites: [],
      },
      StageTwo: {
        title: "Stage Two",
        description: "Select all the introns in the given RNA sequence.",
        hints: [],
        prerequisites: ["StageOne"],
      },
    },
  },
  Molecules: {
    title: "Molecular Docking",
    storyDescription: "",
    stages: {
      StageOne: {
        title: "Stage One",
        description: "Connect each molecule to its corresponding binding site",
        hints: [],
        cutScene: [],
        prerequisites: [],
      },
      StageTwo: {
        title: "Stage Two",
        description: "Connect each molecule to its corresponding binding site",
        hints: [],
        cutScene: [],
        prerequisites: ["StageOne"],
      },
    },
  },
  Wireless: {
    title: "Wireless Detection",
    storyDescription: "",
    stages: {
      StageOne: {
        title: "Stage One",
        description: "Classify each breathing pattern as regular or irregular.",
        hints: [],
        cutScene: [],
        prerequisites: [],
      },
      StageTwo: {
        title: "Stage Two",
        description: "Classify each breathing pattern",
        hints: [],
        cutScene: [],
        prerequisites: ["StageOne"],
      },
    },
  },
  Expert: {
    title: "Expert Level Challenges",
    storyDescription: "Uber hard fr",
    stages: {
      RNA: {
        title: "RNA Splicing",
        description: "Pending",
        hints: [],
        cutScene: [],
      },
      MolecularDocking: {
        title: "Molecular Docking",
        description: "Pending",
        hints: [],
        cutScene: [],
      },
      WirelessDetection: {
        title: "Wireless Detection",
        description: "Pending",
        hints: [],
        cutScene: [],
      },
    },
  },
};

export default challengeData;
