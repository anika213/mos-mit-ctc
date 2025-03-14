import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  playClick,
  victoryClick,
  incorrectClick,
} from "../../../components/ChallengesSound";
import { isColliding } from "../../../utils/utils";
import buttonStyles from "../../Buttons.module.css";
import mainprotein from "../../../assets/mainprotein.png";
import bs1 from "../../../assets/bindingsite1.png";
import bs2 from "../../../assets/bindingsite2.png";
import bs1correct from "../../../assets/bs1-correct.png";
import bs2correct from "../../../assets/bs2-correct.png";
import wrongd1 from "../../../assets/wrongd1.png";
import wrongd2 from "../../../assets/wrongd2.png";
import wrongd3 from "../../../assets/wrongd3.png";
import wrongd4 from "../../../assets/wrongd4.png";
import wrongd5 from "../../../assets/wrongd5.png";
import wrongd6 from "../../../assets/wrongd6.png";

//TODO - responsiveness (99, 48-50), change to actual images (47, 99, 106, 115, )

class RNAMedGame {
  sceneWidth = 1000;
  sceneHeight = 600;
  stage;

  primaryLayer;
  optionsLayer;
  childLayer;
  mainProtein;

  showAlert;
  onComplete;

  children = [];
  bindingsites = [0, 0];
  proteinsBonded = [];
  //set up variables

  constructor(showAlert, div, size, onComplete) {
    this.showAlert = showAlert;
    this.onComplete = onComplete;

    this.stage = new Konva.Stage({
      container: div,
      width: this.sceneWidth,
      height: this.sceneHeight,
    });
    // this.stage.getContainer().style.border = "1px solid black";

    this.primaryLayer = new Konva.Layer();
    this.stage.add(this.primaryLayer);

    this.optionsLayer = new Konva.Layer();
    this.stage.add(this.optionsLayer);

    this.childLayer = new Konva.Layer();
    this.stage.add(this.childLayer);

    // creating protein

    this.createProtein(this.sceneWidth / 2.4);

    this.createBindingSites(
      bs1,
      this.mainProtein.x() + this.mainProtein.width() / 9, // make more responsive?
      this.mainProtein.y() + this.mainProtein.height() * 0.01,
      (bindingSite) => {
        this.bindingsites[0] = bindingSite;
      }
    );
    this.createBindingSites(
      bs2,
      this.mainProtein.x() + this.mainProtein.width() / 3,
      this.mainProtein.y() + this.mainProtein.height() / 1.5,
      (bindingSite) => {
        this.bindingsites[1] = bindingSite;
      }
    );

    // creating key
    let keyColors = {
      Hydrophobic: "#e92a39",
      "Positive Charge": "#98acff",
      "Negative Charge": "#fde25d",
      "Hydrogen Bond Donors": "#fb9ab5",
      "Hydrogen Bond Acceptors": "#caa8f5",
    };
    let keyX = 0;
    let keyY = 5;
    for (let key in keyColors) {
      const keygroup = this.createKey(
        keyColors[key],
        key,
        keyX,
        keyY,
        10,
        100,
        30
      );
      this.primaryLayer.add(keygroup);
      keyX += keygroup.width() + 10;
    }

    // start creating main chain
    let proteinImgList = [
      wrongd1,
      bs2correct,
      wrongd2,
      wrongd3,
      wrongd4,
      wrongd5,
      bs1correct,
      wrongd6,
    ];
    let drugInfo = [
      { shape: "weird" },
      {
        shape: "heart",
        left: "hydrophobic",
        middle: "acceptor",
        right: "negative",
      },
      {
        shape: "heart",
        left: "hydrophobic",
        middle: "acceptor",
        right: "positive",
      },
      { shape: "heart", left: "positive", middle: "donor", right: "negative" },
      { shape: "boot", left: "positive", right: "hydrophobic" },
      { shape: "boot", left: "negative", right: "hydrophobic" },
      { shape: "boot", left: "hydrophobic", right: "donor" },
      { shape: "weird" },
    ];
    let setWidth = this.mainProtein.width() / 2.7;
    let setHeight = this.mainProtein.height() / 2.7;
    let x = this.sceneWidth - setWidth * 2.5;
    let y = 40;

    for (let i = 0; i < proteinImgList.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        y += setHeight / 1.1;
        x = this.sceneWidth - setWidth * 2.5;
      }
      const spriteParams = {
        size: { width: setWidth, height: setHeight },
        position: { x: x, y: y },
        stage: this.stage,
      };

      const drugSeqElement = new DrugOptions(
        this,
        i,
        proteinImgList[i],
        spriteParams,
        drugInfo[i]
      );
      this.optionsLayer.add(drugSeqElement.sprite);
      x += setWidth;
    }

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

  createKey(color, t, x, y, padding, width, height) {
    let key = new Konva.Group({
      x: x,
      y: y,
      width: width,
    });
    let colorSegment = new Konva.Rect({
      width: height,
      height: height,
      fill: color,
    });
    key.add(colorSegment);

    let text = new Konva.Text({
      text: t,
      fill: "black",
      fontSize: 15,
      x: height + padding,
      y: (height - 15) / 2,
    });
    key.add(text);
    key.width(height + padding + text.width());

    return key;
  }

  // main protein background
  createProtein(width) {
    let mainProtein = new Image();
    mainProtein.src = mainprotein;

    const proteinImage = new Konva.Image({
      x: 20,
      y: this.sceneHeight / 2 - width / 2,
      width: width,
      height: width,
    });

    mainProtein.onload = () => {
      proteinImage.image(mainProtein);
    };

    this.mainProtein = proteinImage;
    this.primaryLayer.add(proteinImage);
  } // constructing the main body of protein

  createBindingSites(siteImg, x, y, callback) {
    let site = new Image();

    site.onload = () => {
      const siteImg = new Konva.Image({
        x: x,
        y: y,
        image: site,
        width: this.mainProtein.width() / 2.7,
        height: this.mainProtein.height() / 2.7,
      });

      this.childLayer.add(siteImg);
      if (callback) {
        callback(siteImg);
      }
    };
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

  setProteinsBonded(proteinsBonded) {
    this.proteinsBonded = proteinsBonded;
  }

  addBondedPro(addedProtein) {
    this.proteinsBonded.push(addedProtein);
  }

  removeBondedPro(removedProtein) {
    this.proteinsBonded = this.proteinsBonded.filter(
      (c) => c !== removedProtein
    );
  }
  addBondedProFront(addedProtein) {
    this.proteinsBonded.unshift(addedProtein);
  }
  checkClicked() {
    this.checkWinner();
  }
  resetClicked() {
    this.children.forEach((c) => c.sprite.destroy());
  }

  checkWinner() {
    let playerSequence = this.proteinsBonded;
    let answer = [
      { shape: "boot", left: "hydrophobic", right: "donor" },
      {
        shape: "heart",
        left: "hydrophobic",
        middle: "acceptor",
        right: "negative",
      },
    ];
    let error = "Please fix the following errors: \n";
    let hydrophobic = false;
    let charge = false;
    let hydrogenb = false;
    let shape = false;

    if (playerSequence.length !== 2) {
      incorrectClick();
      this.showAlert(
        "One or more of your binding sites doesn't have a drug attached!"
      );
    } else {
      for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i].drugInfo.shape !== answer[i].shape) {
          shape = true;
        } else {
          if (playerSequence[i].drugInfo.left !== answer[i].left) {
            hydrophobic = true;
          }
          if (playerSequence[i].drugInfo.right !== answer[i].right) {
            if (answer[i].right === "donor") {
              hydrogenb = true;
            } else {
              charge = true;
            }
          }
          if (
            playerSequence[i].drugInfo.shape === "heart" &&
            playerSequence[i].drugInfo.middle !== answer[i].middle
          ) {
            hydrogenb = true;
          }
        }
      } // checking for errors

      if (shape || hydrogenb || hydrophobic || charge || hydrogenb) {
        if (shape) {
          error += "- There is a better shaped ligand for this protein. \n";
        }
        if (hydrophobic) {
          error +=
            "- Hydrophobic regions of the drug match with to hydrophobic areas in the protein. \n";
        }
        if (charge) {
          error +=
            "- Positively charged groups match with negatively charged groups and vice versa. \n";
        }
        if (hydrogenb) {
          error +=
            "- Hydrogen bond donors match with hydrogen bond acceptors. \n";
        }
      } else {
        error = "win";
      }

      if (error === "win") {
        // WIN
        victoryClick();
        error = "Congratulations! You've completed this challenge.";
        this.onComplete();
      } else {
        incorrectClick();
      }

      this.showAlert(error);
    }
  } // end checkwinner
} // end main game class

class DrugComponent {
  game;
  spriteParams; // has position, size,
  sprite;
  drugID;
  drugImg;
  drugInfo;

  constructor(game, drugID, drugImg, spriteParams, drugInfo) {
    this.drugInfo = drugInfo;
    this.game = game;
    this.sprite = this.createNewDrug(drugImg, { ...spriteParams });
    this.drugImg = drugImg;
    this.spriteParams = spriteParams;
    this.drugID = drugID;
  } // end constructor for a drug component

  createNewDrug(dimage, { size, position }) {
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
    };

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

  dragStart() {}
  dragEnd() {}
  dragMove() {}
} // end drug component class

class DrugOptions extends DrugComponent {
  dragStart() {
    this.sprite.stopDrag();

    const child = this.makeChild();
    this.game.addDrug(child);
    child.sprite.startDrag();
  }

  makeChild() {
    let child = new PlayerDrug(
      this.game,
      this.drugID,
      this.drugImg,
      { ...this.spriteParams },
      this.drugInfo
    );
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
      this.game.destroyDrug(this);
    }

    this.game.bindingsites.forEach((site, index) => {
      let validSite = true;
      if (isColliding(this.sprite, site)) {
        this.game.children.forEach((otherDrugs) => {
          if (this.sprite !== otherDrugs.sprite) {
            if (isColliding(this.sprite, otherDrugs.sprite)) {
              validSite = false;
            }
          }
        });

        if (validSite) {
          playClick();

          const newPosition = {
            x: site.x(),
            y: site.y(),
          };
          this.sprite.position(newPosition);
          this.selected = true;
          found = true;

          if (this.currentBindingSite !== null) {
            this.game.removeBondedPro(this);
          }
          this.currentBindingSite = index;

          if (index === 0) {
            this.game.addBondedProFront(this);
          } else {
            this.game.addBondedPro(this);
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
} // end player drug class

function Medium({ onComplete }) {
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

    const game = new RNAMedGame(
      showAlert,
      divRef.current,
      {
        width: resizeRef.current.clientWidth,
        height: resizeRef.current.clientHeight,
      },
      onComplete
    );

    gameRef.current = game;
  }, [showAlert, destroyGame, onComplete]);

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
    <div>
      {alertShowing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-80 bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600">
            <p className="mb-4 whitespace-pre-line text-center ">{alertText}</p>
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
        <div ref={resizeRef} className="w-5/6 h-5/6">
          {/*  border border-gray-300 shadow-lg rounded-lg */}
          <div ref={divRef}></div>
        </div>
      </div>

      {/* game buttons */}
      <div className="flex flex-row justify-center items-center pt-7">
        <button
          className={`px-7 py-2 m-2 text-white ${buttonStyles.redButton}`}
          onClick={() => {
            if (gameRef.current) {
              gameRef.current.resetClicked();
            }
          }}
        >
          Reset
        </button>
        <button
          className={`px-7 py-2 m-2 text-white ${buttonStyles.blackButton}`}
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
