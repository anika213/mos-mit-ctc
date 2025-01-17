import './Medium.module.css';
import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { isColliding } from '../../../utils/utils';

//TODO - responsiveness (99, 48-50), change to actual images (47, 99, 106, 115, )

class RNAMedGame {
  sceneWidth = 1000;
  sceneHeight = 500;
  stage;

  primaryLayer;
  optionsLayer;
  childLayer;
  mainProtein;

  showAlert;

  children = [];
  bindingsites = [0, 0];
  proteinsBonded = [];
  //set up variables

  constructor(showAlert, div, size) {
    this.showAlert = showAlert;

    this.stage = new Konva.Stage({
      container: div,
      width: this.sceneWidth,
      height: this.sceneHeight,
    });
    this.stage.getContainer().style.border = "1px solid black";

    this.primaryLayer = new Konva.Layer();
    this.stage.add(this.primaryLayer);

    this.optionsLayer = new Konva.Layer();
    this.stage.add(this.optionsLayer);

    this.childLayer = new Konva.Layer();
    this.stage.add(this.childLayer);

    this.createProtein(this.sceneWidth / 4);

    // start creating main chain
    let proteinImgList = ['https://d2bzx2vuetkzse.cloudfront.net/fit-in/0x450/unshoppable_producs/6c7b6164-8956-4ab0-a147-2608783fccdc.png', 'https://popupfilmresidency.org/wp-content/uploads/2021/07/blue-blob-4.png', 'https://popupfilmresidency.org/wp-content/uploads/2021/07/blue-blob-4.png','https://popupfilmresidency.org/wp-content/uploads/2021/07/blue-blob-4.png']
    let setWidth = 50;
    let setHeight = 50;
    let x = 30;
    let y = this.sceneHeight - setHeight;

    for (let i = 0; i < proteinImgList.length; i++) {
        const spriteParams = { 
            size: { width:setWidth, height: setHeight },
            position: {x: x, y: y},
            stage: this.stage
        };
        const drugSeqElement = new DrugOptions(this, i, proteinImgList[i], spriteParams,);
        this.optionsLayer.add(drugSeqElement.sprite);

        x += setWidth + 10;

    };

    this.resize(size.width);

  } // ending of constructor

  resize(actualWidth) {
    let scale = actualWidth / this.sceneWidth;

    this.stage.width(this.sceneWidth * scale);
    this.stage.height(this.sceneHeight * scale);

    this.stage.scale({ x: scale, y: scale });
  }

  destroy() {
    this.stage.destroy();
  }

// main protein background
  createProtein(width) {
    let mainProtein = new Image();
    mainProtein.onload= () => {
        const proteinImage= new Konva.Image({
            x: this.sceneWidth / 2 - (width/2),
            y: this.sceneHeight / 2 - (width/2),
            image: mainProtein,
            width:width,
            height:width,
            
          });

        this.mainProtein = proteinImage;

        this.primaryLayer.add(proteinImage);
        this.createBindingSites('https://jwconstruction.tc/wp-content/uploads/2020/07/blob-1.png', 
          this.mainProtein.x() + 50, // make more responsive?
          this.mainProtein.y() + 10,
          (bindingSite) => {
            this.bindingsites[0] = (bindingSite);
          }
        )
        this.createBindingSites('https://jwconstruction.tc/wp-content/uploads/2020/07/blob-1.png', 
          this.mainProtein.x() + 100, 
          this.mainProtein.y() + 200,
          (bindingSite) => {
            this.bindingsites[1] = (bindingSite);
          }
      )
    }

    mainProtein.src = 'https://popupfilmresidency.org/wp-content/uploads/2021/07/blue-blob-4.png'
  } // constructing the main body of protein


  createBindingSites(siteImg, x, y, callback) {
    let site = new Image();

    site.onload= () => {
        const siteImg= new Konva.Image({
            x: x,
            y: y,
            image: site,
            width: this.mainProtein.width() / 4, 
            height: this.mainProtein.height() / 4,
          });
          
        this.childLayer.add(siteImg);
        if (callback) {
          callback(siteImg);
        }
      }
    site.src = siteImg;

  } // finishing adding binding sites

// working on drug aspect

  addDrug(child) {
    this.childLayer.add(child.sprite);
    this.children.push(child);
  }

  destroyDrug(child) {
    child.sprite.destroy();
    this.children = this.children.filter((c) => c !== child);
  }

  destroy() {
    this.stage.destroy();
  }

  setProteinsBonded(proteinsBonded) {
    this.proteinsBonded = proteinsBonded;
  }

  addBondedPro(addedProtein) {
    this.proteinsBonded.push(addedProtein);
  }

  removeBondedPro(removedProtein) {
    this.proteinsBonded = this.proteinsBonded.filter((c) => c !== removedProtein);
  }
  addBondedProFront(addedProtein) {
    this.proteinsBonded.unshift(addedProtein);
  }
  checkClicked() {
    this.checkWinner()
  }
  resetClicked() {
    this.children.forEach((c) => c.sprite.destroy())
  }

  checkWinner() {
    let playerSequence = []
    this.proteinsBonded.forEach(child => { 
      playerSequence.push(child.drugID)
    })
    let correctSequence = [0, 2]
    let errors = correctSequence.length;
    console.log(playerSequence)

    if (playerSequence.length != 2) {
      this.showAlert("One or more of your binding sites doesn't have a drug attached!")
    }
    else if (JSON.stringify(playerSequence) === JSON.stringify(correctSequence)) {
      this.showAlert("Challenge Complete! \n All your binding sites have correctly matched drug fragments.")
    }
    else {
      console.log('hi')
      for (let i = 0; i < playerSequence.length; i++) {
        if (correctSequence[i] === playerSequence[i]) {
          errors -=1
        }
      
    }
  
    if (errors != 1) {
      this.showAlert("Sorry! You currently have " + errors + " fragments in the wrong binding site.")
    }
    else {
      this.showAlert("Sorry! You currently have " + errors + " fragment in the wrong binding site.")
    }
      
    }    
  }

} // end main game class

class DrugComponent {

    game;
    spriteParams; // has position, size, 
    sprite;
    drugID;
    drugImg;

    constructor(game, drugID, drugImg, spriteParams) {
        this.game = game;
        this.sprite = this.createNewDrug( drugImg, {...spriteParams});
        this.drugImg = drugImg;
        this.spriteParams = spriteParams;
        this.drugID = drugID;
    } // end constructor for a drug component


    createNewDrug( dimage, {size, position} ) {
      let drug = new Image();
      drug.src = dimage;
      
        const drugImg = new Konva.Image({
          draggable: true,
          image: drug,
          ...size,
          ...position,
        });

        drug.onload = () => {
          drugImg.image(drug);
        }

          drugImg.on("mouseenter", () => {
            drugImg.getStage().container().style.cursor = "move";
        });

        drugImg.on("mouseleave", () => {
            drugImg.getStage().container().style.cursor = "default";
        });

        drugImg.on("dragstart", () => {
            this.dragStart();
        });
        drugImg.on("dragend", () => {
            this.dragEnd();
        });
        
        return drugImg;
    }

    dragStart() {};
    dragEnd() {};
    dragMove() {};

} // end drug component class

class DrugOptions extends DrugComponent {
    dragStart() {
        this.sprite.stopDrag();

        const child = this.makeChild();
        this.game.addDrug(child);
        child.sprite.startDrag();
    }

    makeChild() {
      console.log(this.drugImg)
        let child = new PlayerDrug(this.game, this.drugID, this.drugImg, {...this.spriteParams});
        return child;
    }
} // end drug options class

class PlayerDrug extends DrugComponent {
    selected = false;
    currentBindingSite = null; // Tracks which binding site this protein is bonded to

    dragEnd() {
        let found = false;

        // destroy if dragged outside
        if (isColliding(this.sprite, this.game.optionsLayer)) {
            this.game.destroyDrug(this)
        }

        this.game.bindingsites.forEach((site, index) => {
            let validSite = true;
            if (isColliding(this.sprite, site)) {

              this.game.children.forEach(otherDrugs => {
                if (this.sprite !== otherDrugs.sprite) {
                    if (isColliding(this.sprite, otherDrugs.sprite)) {
                        validSite = false;
                    }
                }
            });

                if (validSite) {
                    const newPosition = {
                        x: site.x(),
                        y: site.y(),
                    }
                    this.sprite.position(newPosition);
                    this.selected = true;
                    found = true;

                    if (this.currentBindingSite !== null) {
                      this.game.removeBondedPro(this);
                  }
                    this.currentBindingSite = index;

                    if(index === 0) {
                        console.log('adding to front')
                        this.game.addBondedProFront(this)
                    }
                    else {
                        console.log('adding to back')
                        this.game.addBondedPro(this)
                    }
                }
                
            } 
        });

        if (!found && this.selected) {
          if (this.currentBindingSite !== null) {
            this.game.removeBondedPro(this);
          }
          this.currentBindingSite = null;
          this.selected = false;
        }
    }

}// end player drug class



function Medium() {

  const divRef = useRef(null);
  const resizeRef = useRef(null);
  const gameRef = useRef(null);

  const [alertShowing, setAlertShowing] = useState(false);
  const [alertText, setAlertText] = useState("");

  const showAlert = useCallback((text = "") => {
    setAlertShowing(true);
    setAlertText(text);
  }, []);

  const destroyGame = useCallback(() => {
    gameRef.current.destroy();
    gameRef.current = null;
  }, []);

  const createGame = useCallback(() => {
    if (gameRef.current) {
      destroyGame();
    }

    const game = new RNAMedGame(showAlert, divRef.current, {
      width: resizeRef.current.clientWidth,
      height: resizeRef.current.clientHeight,
    });

    gameRef.current = game;
  }, [showAlert, destroyGame]);

  // Create stage on mount
  useEffect(() => {
    createGame();

    return destroyGame;
  }, [createGame, destroyGame]);

  useEffect(() => {
    const resizeCallback = () => {
      if (gameRef.current) {
        gameRef.current.resize(resizeRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

    return (
      <div>  {/* start of holder for the game */}
        
        {/* alert */ }
      {alertShowing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600">
            <p className="mb-4 whitespace-pre-line">{alertText}</p>
            <button
              className="bg-red-600 text-white px-4 py-2"
              onClick={() => setAlertShowing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* game box */}
      <div className="flex justify-center py-30">
        <div ref={resizeRef} className="w-3/4 h-3/4 border border-gray-300 shadow-lg rounded-lg">
            <div ref={divRef}></div>
        </div>
      </div>
      
      {/* game buttons */}
      <div className="flex flex-row justify-center items-center">
        <button
          className="bg-red-600 px-7 py-2 m-2 text-white "
          onClick={() => {
            if (gameRef.current) {
              gameRef.current.resetClicked();
            }
          }}
        >
          Reset Game
        </button>
        <button
          className="bg-black px-7 py-2 m-2 text-white"
          onClick={() => {
            if (gameRef.current) {
              gameRef.current.checkClicked();
            }
          }}
        >
          Check
        </button>
      </div>
    </div> 
      
    );
  }
  
  export default Medium;