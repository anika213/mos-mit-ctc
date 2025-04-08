import { useContext, useCallback } from "react";
import { ChallengesContext } from "../context/ChallengesContext.js";

export function useIsUnlocked() {
  const { challengeData: userChallengeData } = useContext(ChallengesContext);
  return useCallback((challengeKey, stageKey) => {
    const prerequisites = challengeData[challengeKey].stages?.[stageKey]?.prerequisites || [];
    return prerequisites.every(
      (prerequisite) => userChallengeData[`${challengeKey}-${prerequisite}`] !== undefined
    );
  }, [userChallengeData]);
}

export const labCutscenes = [
  {
    text: "Oh, thank goodness you made it! Welcome to our lab! I’m Dr. Bob. A recent earthquake disrupted three of our research stations. Boy, are we super glad you’re here because we need your help to fix these stations so we can get our lab back on track with.",
    button: "Let’s get started!",
  },
  {
    text: "We need you to complete these tasks so we can upload your work to the database, which will help us with patient monitoring, protein analysis, and drug discovery. Are you up for the challenge?",
    button: "100% yes!"
  },
  {
    text: "Fantastic! Not to rush you, but we need to get started soon or we’ll fall behind our deadlines! Pick a station and I’ll let you know what we need. Oh! Also—If you’re an elite coder looking for an extra challenge, we’ve got a main computer terminal where you can write code and solve our expert-level problems.",
    button: "Let’s Go!"
  }
]

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
        hints: ["Since we take the original mRNA and cut out the introns, the exons can’t be rearranged in their order. Make sure they’re in the right order!", 
                "We can make multiple proteins from one strand of mRNA! This is called alternative splicing, where we choose different exons to form different proteins."],
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
