import React, { useEffect, useRef } from "react";
import Konva from "konva";
import antigen from '../../../assets/antigen.png'
import enzyme from '../../../assets/enzyme.png'
import molecule from '../../../assets/molecule.png'
import antibody from '../../../assets/antibody.png'
import receptor from '../../../assets/receptor.png'
import signal from '../../../assets/signal.png'
import substrate from '../../../assets/substrate.png'
import transport from '../../../assets/transport.png'

function MoleculeProteinGame() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  var moleculesCorrect = 0;

  useEffect(() => {
    // Initialize the stage and layer
    const stage = new Konva.Stage({
      container: "container", // ID of the container DOM element
      width: 1000, // Canvas width
      height: 600, // Canvas height
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    // Store references for cleanup
    stageRef.current = stage;
    layerRef.current = layer;

    // Data for proteins and molecules
    const proteins = [
      {
        id: "1",
        imagePath: antibody, 
        position: { x: 50, y: 50 }, // Replace with desired position
        bindingSites: [
          { x: 105, y: 120 },
          { x: 200, y: 120 },
          { x: 240, y: 55 },
        ],
      },
      {
        id: "2",
        imagePath: enzyme, 
        position: { x: 400, y: 50 }, // Replace with desired position
        bindingSites: [
          { x: 565, y: 130 },
        ],
      },
      {
        id: "3",
        imagePath: transport, 
        position: { x: 50, y: 300 }, // Replace with desired position
        bindingSites: [
          { x: 150, y: 430 },
          { x: 190, y: 365 },
        ],
      },
      {
        id: "4",
        imagePath: receptor,
        position: { x: 400, y: 300 }, // Replace with desired position
        bindingSites: [
          { x: 500, y: 350 },
        ],
      },
    ];

    const molecules = [
      {
        id: "1",
        imagePath: antigen, 
        initialPosition: { x: 50, y: 550 },
        targetProtein: "1",
      },
      {
        id: "2",
        imagePath: substrate, 
        initialPosition: { x: 150, y: 550 },
        targetProtein: "2",
      },
      {
        id: "3",
        imagePath: molecule, 
        initialPosition: { x: 250, y: 550 },
        targetProtein: "3",
      },
      {
        id: "4",
        imagePath: signal, 
        initialPosition: { x: 350, y: 550 },
        targetProtein: "4",
      },
    ];

    var text = new Konva.Text({
        x: 650, // Adjust position to fit within the canvas
        y: 50, 
        text: "Welcome! Drag the molecules to the binding sites.", // Initial message
        fontSize: 20, // Smaller size for better placement
        fontFamily: "Roboto",
        fill: "black",
        width: 350, 
        wrap: "word",
      });
      
    // Add the text to the layer and stage
    layer.add(text);
    layer.draw();  // Force the layer to render immediately
    

    // Load proteins
    proteins.forEach((protein) => {
      const proteinImage = new Image();
      proteinImage.src = protein.imagePath;
      proteinImage.onload = () => {
        const proteinNode = new Konva.Image({
          x: protein.position.x,
          y: protein.position.y,
          image: proteinImage,
          width: 200, // Adjust size if needed
          height: 150, // Adjust size if needed
        });

        layer.add(proteinNode);

        // Add binding sites for this protein
        protein.bindingSites.forEach((site, index) => {
          const bindingSite = new Konva.Circle({
            x: site.x,
            y: site.y,
            radius: 20, // Size of the binding site placeholder
            fill: "rgba(252, 245, 199, 0.3)", // Transparent yellow
            stroke: "green",
            strokeWidth: 2,
            name: `${protein.id}-bindingSite-${index}`, // Unique name for reference
          });

          layer.add(bindingSite);
        });

        layer.draw();
      };
    });

    // Load molecules
    molecules.forEach((molecule) => {
      const moleculeImage = new Image();
      moleculeImage.src = molecule.imagePath;
      moleculeImage.onload = () => {
        const moleculeNode = new Konva.Image({
          x: molecule.initialPosition.x,
          y: molecule.initialPosition.y,
          image: moleculeImage,
          width: 50, // Adjust size if needed
          height: 50, // Adjust size if needed
          draggable: true,
          name: molecule.id, // Unique name for reference
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

                // Check collision with binding site
                if (
                  Konva.Util.haveIntersection(siteBounds, moleculeBounds) &&
                  !snapped
                ) {
                  // Snap molecule to the binding site's center
                  moleculeNode.position({
                    x: site.x() - 25,
                    y: site.y() - 25,
                  });
                  snapped = true;

                  console.log(moleculeNode.position());
                  console.log(moleculeNode.x());
                  console.log(moleculeNode.y());
                  
                  // Update the text
                  if (snapped && (
                    moleculeNode.x() === 215 ||
                    moleculeNode.x() === 475 ||
                    moleculeNode.x() === 165 ||
                    moleculeNode.x() === 540)
                  ) {
                    moleculesCorrect++;
                    console.log(moleculesCorrect);
                    if (moleculesCorrect == 4) {
                        text.text("Great job on completing the challenge!");
                        console.log( "Great job on completing the challenge!");
                    } else {
                        text.text("Great job! You attached the molecule to the correct binding site!");
                        console.log("Great job! You attached the molecule to the correct binding site!");
                    }
                    
                    
                  } else {
                    text.text("You attached the molecule to one of the binding sites available to it, but there's one that is a better option. Try again!");
                    console.log("You attached the molecule to one of the binding sites available to it, but there's one that is a better option. Try again!");
                    moleculeNode.position({
                        x: 450,
                        y: 550,
                      });

                  }

                  layer.batchDraw();

                }
              });
            }
          });

          if (!snapped) {
            console.log(`Molecule ${molecule.id} is not placed correctly.`);
          }
          
          layer.draw(); // Redraw layer
        });

        layer.add(moleculeNode);
        layer.draw();
      };
    });

   


    return () => {
      // Cleanup on component unmount
      stage.destroy();
    };
  }, []);

  return <div id="container" style={{ width: "1000px", height: "600px" }} />;
}

export default MoleculeProteinGame;
