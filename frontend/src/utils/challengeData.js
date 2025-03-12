const challengeData = {
    RNA: {
      title: "RNA Splicing",
      storyDescription: "A horrific explosion destroyed the RNA station. Fix it lil bro.",
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
          hints: [
            "Hint 1",
            "Hint 2"
          ],
        },
        StageTwo: {
            title: "Stage Two",
            description: "Select all the introns in the given RNA sequence.",
            hints: { },
        },
      },
    },
    Molecules: {
      title: "Molecular Docking",
      StoryDescription: "",
      Stages: {
        StageOne: {
          title: "Stage One",
          description: "Connect each molecule to its corresponding binding site",
          hints: { },
        },
        StageTwo: {
          title: "Stage Two",
          description: "Connect each molecule to its corresponding binding site",
          hints: { },
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
          hints: { },
        },
        StageTwo: {
          title: "Stage Two",
          description: "Classify each breathing pattern",
          hints: { },
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
            hints: { },
          },
          MolecularDocking: {
            title: "Molecular Docking",
            description: "Pending",
            hints: { },
          },
          WirelessDetection: {
            title: "Wireless Detection",
            description: "Pending",
            hints: { },
          },
        }
      }
  };

export default challengeData;