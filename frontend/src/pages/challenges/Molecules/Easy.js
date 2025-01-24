import React, { useCallback, useEffect, useRef, useState } from "react";
import {dingClick, victoryClick, incorrectClick} from '../../../components/ChallengesSound';
import Konva from "konva";
import protein1 from "../../../assets/protein1.png";
import protein2 from "../../../assets/protein2.png";
import protein3 from "../../../assets/protein3.png";
import protein4 from "../../../assets/protein4.png";
import molecule1 from "../../../assets/molecule1.png";
import molecule2 from "../../../assets/molecule2.png";
import molecule3 from "../../../assets/molecule3.png";
import molecule4 from "../../../assets/molecule4.png";

function MolecularDockingEasy({ onComplete }) {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [alertShowing, setAlertShowing] = useState(false);
  const [alertText, setAlertText] = useState("");
  
  let moleculesCorrect = 0;

  const showAlert = useCallback((text = "") => {
    setAlertShowing(true);
    setAlertText(text);
  }, []);

  const resizeCanvas = () => {
    const container = document.getElementById("container");
    const width = container.offsetWidth;
    //const height = container.offsetHeight;
    const aspectRatio = 1000/600
    const stage = stageRef.current;

    if (stage) {
      // Calculate height based on the width and aspect ratio
      const height = width / aspectRatio;

      stage.width(width);
      stage.height(height);
      stage.scale({
        x: width / 1000,
        y: height / 600,
      });
    }
  };

  useEffect(() => {
    const stage = new Konva.Stage({
      container: "container",
      width: 1000,
      height: 600,
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    stageRef.current = stage;
    layerRef.current = layer;

    const proteins = [
        {
            id: "1",
            imagePath: protein1,
            position: { x: 325, y: 100 },
            bindingSites: [
                { x: 475, y: 100, correct: true },
                { x: 445, y: 190, correct: false },
                { x: 372, y: 170, correct: false },
            ],
        },
        {
            id: "2",
            imagePath: protein2,
            position: { x: 525, y: 100 },
            bindingSites: [
                { x: 590, y: 220, correct: false },
                { x: 640, y: 180, correct: true },
            ],
        },
        {
            id: "3",
            imagePath: protein3,
            position: { x: 325, y: 300 },
            bindingSites: [
                { x: 460, y: 385, correct: true },
            ],
        },
        {
            id: "4",
            imagePath: protein4,
            position: { x: 525, y: 300 },
            bindingSites: [
                { x: 615, y: 345, correct: true },
            ],
        },
    ];

    const molecules = [
        { id: "1", imagePath: molecule1, initialPosition: { x: 525, y: 500 }, targetProtein: "1", W: 89, H: 96 },
        { id: "2", imagePath: molecule2, initialPosition: { x: 125, y: 500 }, targetProtein: "2", W: 121, H: 64 },
        { id: "3", imagePath: molecule3, initialPosition: { x: 725, y: 500 }, targetProtein: "3", W: 76, H: 70 },
        { id: "4", imagePath: molecule4, initialPosition: { x: 325, y: 475 }, targetProtein: "4", W: 167, H: 167 },
    ];
    proteins.forEach((protein) => {
      const proteinImage = new Image();
      proteinImage.src = protein.imagePath;
      proteinImage.onload = () => {
        const proteinNode = new Konva.Image({
          x: protein.position.x,
          y: protein.position.y,
          image: proteinImage,
          width: 150 * stage.scaleX(),
          height: 150 * stage.scaleY(),
        });
        layer.add(proteinNode);

        protein.bindingSites.forEach((site, index) => {
          const bindingSite = new Konva.Circle({
            x: site.x,
            y: site.y,
            radius: 20,
            fill: "rgba(252, 245, 199, 0.3)",
            stroke: "yellow",
            strokeWidth: 1,
            name: `${protein.id}-bindingSite-${index}`,
          });
          // Set the correct property explicitly
          bindingSite.setAttr("correct", site.correct);

          layer.add(bindingSite);
        });

        layer.batchDraw();
      };
    });

    molecules.forEach((molecule) => {
      const moleculeImage = new Image();
      moleculeImage.src = molecule.imagePath;
      moleculeImage.onload = () => {
        const moleculeNode = new Konva.Image({
          x: molecule.initialPosition.x,
          y: molecule.initialPosition.y,
          image: moleculeImage,
          width: Math.round(molecule.W * 0.4) * stage.scaleX(),
          height: Math.round(molecule.H * 0.4) * stage.scaleY(),
          draggable: true,
        });

        moleculeNode.on("dragend", () => {
          let snapped = false;

          proteins.forEach((protein) => {
            if (protein.id === molecule.targetProtein) {
              const bindingSites = layer.find((node) =>
                node.name().startsWith(`${protein.id}-bindingSite`)
              );

              bindingSites.forEach((site) => {
                const siteBounds = site.getClientRect();
                const moleculeBounds = moleculeNode.getClientRect();

                if (Konva.Util.haveIntersection(siteBounds, moleculeBounds) && !snapped) {

                  moleculeNode.position({
                    x: site.x() - Math.round(moleculeNode.width() / 2),
                    y: site.y() - Math.round(moleculeNode.height() / 2),
                  });
                  snapped = true;

                  console.log(site.getAttr("correct"));

                  if (site.getAttr("correct")) {
                    moleculesCorrect++;
                    if(moleculesCorrect === 4){
                        victoryClick();
                        showAlert("Great job! You have completed the challenge!");
                        onComplete();
                    } else {
                        dingClick();
                        showAlert("Great job! You attached the molecule to the correct binding site!");
                    }
                  } else {
                    incorrectClick();
                    showAlert("You attached the molecule to one of the binding sites, but there's a better option. Try again!");
                    moleculeNode.position(molecule.initialPosition); // Reset to initial position
                  }
                }
              });
            }
          });

          if (!snapped) {
            showAlert("Incorrect placement. Try again!");
            moleculeNode.position(molecule.initialPosition);
          }

          layer.batchDraw();
        });

        layer.add(moleculeNode);
        layer.batchDraw();
      };
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      stage.destroy();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [showAlert, onComplete, moleculesCorrect]);

  return (
    <div>
      {alertShowing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80">
            <p className="mb-4 whitespace-pre-line text-center">{alertText}</p>
            <button 
                className="bg-red-600 text-white px-4 py-2"
                onClick={() => setAlertShowing(false)}
            >
                Close
            </button>
          </div>
        </div>
      )}
      <div id="container" style={{ width: "100%", height: "100vh" }} />
    </div>
  );
}

export default MolecularDockingEasy;