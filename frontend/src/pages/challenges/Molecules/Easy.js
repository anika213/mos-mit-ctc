import React, { useEffect, useRef } from "react";
import Konva from "konva";
import protein1 from '../../../assets/protein1.png'
import protein2 from '../../../assets/protein2.png'
import protein3 from '../../../assets/protein3.png'
import protein4 from '../../../assets/protein4.png'
import molecule1 from '../../../assets/molecule1.png'
import molecule2 from '../../../assets/molecule2.png'
import molecule3 from '../../../assets/molecule3.png'
import molecule4 from '../../../assets/molecule4.png'



function MolecularDockingEasy() {
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
        imagePath: protein1, 
        position: { x: 325, y: 100 },
        bindingSites: [
          { x: 455, y: 100 }, //CORRECT BINDING SITE
          { x: 425, y: 170 },
          { x: 372, y: 170 },
        ],
      },
      {
        id: "2",
        imagePath: protein2, 
        position: { x: 525, y: 100 }, 
        bindingSites: [
          { x: 590, y: 220 },
          { x: 630, y: 170 }, //CORRECT BINDING SITE
        ],
      },
      {
        id: "3",
        imagePath: protein3, 
        position: { x: 325, y: 300 }, 
        bindingSites: [
          { x: 440, y: 375 }, //CORRECT BINDING SITE
        ],
      },
      {
        id: "4",
        imagePath: protein4,
        position: { x: 525, y: 300 }, 
        bindingSites: [
          { x: 605, y: 325 }, //CORRECT BINDING SITE
        ],
      },
    ];

    const molecules = [
      {
        id: "1",
        imagePath: molecule1, 
        initialPosition: { x: 525, y: 450 },
        targetProtein: "1",
        W: 89, //dimensions of png
        H: 96,
      },
      {
        id: "2",
        imagePath: molecule2, 
        initialPosition: { x: 125, y: 450 },
        targetProtein: "2",
        W: 121,
        H: 64,
      },
      {
        id: "3",
        imagePath: molecule3, 
        initialPosition: { x: 725, y: 450 },
        targetProtein: "3",
        W: 76,
        H: 70,
      },
      {
        id: "4",
        imagePath: molecule4, 
        initialPosition: { x: 325, y: 450 },
        targetProtein: "4",
        W: 167,
        H: 167,
      },
    ];

    var text = new Konva.Text({
        x: 125, // Adjust position to fit within the canvas
        y: 25, 
        text: "Welcome! Drag the molecules to the binding sites.", // Initial message
        fontSize: 20, // Smaller size for better placement
        fontFamily: "Calibri",
        fill: "black",
        width: 750, 
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
          width: 150, 
          height: 150, 
        });

        layer.add(proteinNode);

        // Add binding sites for this protein
        protein.bindingSites.forEach((site, index) => {
          const bindingSite = new Konva.Circle({
            x: site.x,
            y: site.y,
            radius: 20, // Size of the binding site placeholder
            fill: "rgba(252, 245, 199, 0.3)", // Transparent yellow
            stroke: "yellow",
            strokeWidth: 1,
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
          width: Math.round(molecule.W * 0.4),
          height: Math.round(molecule.H * 0.4),
          draggable: true,
          name: molecule.id, // Unique name for reference
        });

        console.log(molecule.id + ": width - " + moleculeNode.width() + " height -" + moleculeNode.height());

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
                    x: site.x() - Math.round(moleculeNode.width()/2),
                    y: site.y() - Math.round(moleculeNode.height()/2),
                  });
                  snapped = true;

                  console.log(moleculeNode.position());
                  console.log(moleculeNode.x());
                  console.log(moleculeNode.y());
                  
                  // Update the text
                  if (snapped && (
                    moleculeNode.x() === 437   || //(455 - 18)
                    moleculeNode.x() === 606   || //(630 - 24)
                    moleculeNode.x() === 425   || //(440 - 15)
                    moleculeNode.x() === 571)     //(605 - 34)
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
                        x: 425,
                        y: 450,
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

export default MolecularDockingEasy;
