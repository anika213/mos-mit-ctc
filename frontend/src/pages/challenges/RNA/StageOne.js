import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { shuffleArray, isColliding, toAlphabetBase26 } from "../../../utils/utils";
import {playClick, victoryClick, incorrectClick} from '../../../components/ChallengesSound';
import buttonStyles from "../../Buttons.module.css"

class NucleotideSequences {
  game;

  identifier;
  i;
  isExon;
  sprite;
  spriteParams;

  constructor(game, identifier, i, isExon, spriteParams) {
    this.game = game;
    this.identifier = identifier;
    this.i = i;
    this.isExon = isExon;
    let colorOptions = ['#98ACFF', '#FDE25D', '#FB9AB5', '#CAA8F5', '#A3BCF9', '#7796CB', '#B8E1FF', '#E8AEB7', '#ada5d4', 'a5c6d4']
    this.sprite = this.makeRect({
      color: isExon ? colorOptions[Math.floor(Math.random() * 9)] : "black",
      textColor: isExon ? "black" : "white",
      ...spriteParams,
    });
    this.spriteParams = spriteParams;
  }

  makeRect({ color, textColor, size, position }) {
    const group = new Konva.Group({
      draggable: true,
      ...position,
      ...size,
    });

    group.on("dragstart", () => {
      this.dragStart();
    });
    group.on("dragend", () => {
      this.dragEnd();
    });
    group.on("mouseenter", () => {
      group.getStage().container().style.cursor = "move";
    });
    group.on("mouseleave", () => {
      group.getStage().container().style.cursor = "default";
    });

    group.on("dragmove", (e) => {
      this.dragMove();
    });
    group.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        ...size,
        fill: color,
        stroke: "black",
        strokeWidth: 2,
      })
    );

    const text = new Konva.Text({
      text: this.identifier.toString(),
      fill: textColor,
      fontSize: 20,
      
    });

    const textX = (size.width - text.width()) / 2;
    const textY = (size.height - text.height()) / 2;

    text.position({ x: textX, y: textY });
    group.add(text);

    return group;
  }

  dragStart() {}

  dragEnd() {}

  dragMove() {}
}

class SequencePrimary extends NucleotideSequences {
  makeChild() {
    const parentColor = this.sprite.findOne("Rect").fill();
    return new SequenceChild(this.game, this.identifier, this.i, this.isExon, {
      color: parentColor,
      ...this.spriteParams,
    });
  }

  dragStart() {
    this.sprite.stopDrag();

    const child = this.makeChild();
    this.game.addChild(child);
    child.sprite.startDrag();
  }
}

class SequenceChild extends NucleotideSequences {
  dragEnd() {
    if (isColliding(this.sprite, this.game.primaryLayer)) {
      this.game.removeChild(this);
    }

    const spriteBounds = this.sprite.getClientRect();

    if (
      spriteBounds.x > this.game.stage.width() || 
      spriteBounds.x + spriteBounds.width < 0 || 
      spriteBounds.y > this.game.stage.height() || 
      spriteBounds.y + spriteBounds.height < 0
    ) {
      this.game.removeChild(this); // Remove the sprite
    }

    const childrenByXPos = this.game.children.map((element) => element.sprite);
    childrenByXPos.sort((a, b) => a.getClientRect().x - b.getClientRect().x);
    for (const child of childrenByXPos) {
      if (child === this.sprite) {
        continue;
      }
      if (isColliding(this.sprite, child)) {
        playClick();
        const newPosition = {
          x: child.position().x,
          y: child.position().y,
        };
        if (this.sprite.getClientRect().x < child.getClientRect().x) {
          newPosition.x -= this.sprite.width();
        } else {
          newPosition.x += child.width();
        }

        this.sprite.position(newPosition);
      }
    }
  }
}

class RNAGame {
  sceneWidth = 1000;
  sceneHeight = 500;
  stage;

  primaryLayer;
  childLayer;

  children = [];

  createdRNA = [];

  showAlert;

  static generateRNA(length) {
    // somewhere from 40-60% of the sequence is exons
    let exonCount = Math.floor(length * (0.4 + Math.random() * 0.3));
    let isExonArray = shuffleArray(
      Array(exonCount)
        .fill(true)
        .concat(Array(length - exonCount).fill(false))
    );
    let exonI = 0;
    let sequence = isExonArray.map((isExon, i) => {
      return isExon
        ? { isExon, identifier: toAlphabetBase26(exonI++), i }
        : { isExon, identifier: "-", i };
    });
    return sequence;
  }

  constructor(showAlert, div, size) {
    this.showAlert = showAlert;

    // we will scale it later, 1000x1000 for consistency
    this.stage = new Konva.Stage({
      container: div,
      width: this.sceneWidth,
      height: this.sceneHeight,
    });
    this.stage.getContainer().style.border = "2px solid gray";

    this.primaryLayer = new Konva.Layer();
    this.stage.add(this.primaryLayer);

    this.childLayer = new Konva.Layer();
    this.stage.add(this.childLayer);

    const rnaLength = 10;
    let x = 0;
    let y = 0;
    const spriteHeight = this.sceneWidth / rnaLength / 2;
    //varying widths
    const proportions = Array.from({ length: rnaLength }, () => Math.random());
    const totalProportion = proportions.reduce((sum, value) => sum + value, 0);
    const normalizedProportions = proportions.map(value => value / totalProportion);
    const minWidth = this.sceneWidth / 20 ;
    const remainingWidth = this.sceneWidth - (minWidth * rnaLength);
    const randomWidth = normalizedProportions.map(  proportion => proportion * remainingWidth + minWidth);



    const rnaBlueprint = RNAGame.generateRNA(rnaLength);
    const sequence = [];
    for (let i = 0; i < rnaBlueprint.length; i++) {
      const spriteParams = {
        size: { width: randomWidth[i], height: spriteHeight },
        position: { x, y },
        stage: this.stage,
      };

      const blueprint = rnaBlueprint[i];
      const element = new SequencePrimary(
        this,
        blueprint.identifier,
        i,
        blueprint.isExon,
        spriteParams
      );

      sequence.push(element);
      this.primaryLayer.add(element.sprite);
      x += randomWidth[i];
    }

    this.resize(size.width);
  }

  resetClicked() {
    this.children.forEach((element) => element.sprite.destroy());
    this.children = [];
  }

  checkClicked() {
    return this.checkProtein();
  }

  resize(actualWidth) {
    let scale = actualWidth / this.sceneWidth;

    this.stage.width(this.sceneWidth * scale);
    this.stage.height(this.sceneHeight * scale);

    this.stage.scale({ x: scale, y: scale });
  }

  addChild(child) {
    this.children.push(child);
    this.childLayer.add(child.sprite);
  }

  removeChild(child) {
    this.children = this.children.filter((c) => c !== child);
    child.sprite.destroy();
  }

  destroy() {
    this.stage.destroy();
  }

  checkProtein() {
    const allGroupsByXPos = this.children.map((element) => {
      return {
        sprite: element.sprite,
        i: element.i,
        isExon: element.isExon,
        identifier: element.identifier,
      };
    });
    allGroupsByXPos.sort(
      (a, b) => a.sprite.getClientRect().x - b.sprite.getClientRect().x
    ); // Sort by x-position

    if (allGroupsByXPos.length === 0) {
      this.showAlert("You haven't created a protein!");
      return false;
    }

    if (allGroupsByXPos.length === 1) {
      this.showAlert("While this may be correct, proteins are usually more complex. Try dragging more than one exon!");
      return false;
    }

    let errors = new Set();
    let lastGroupI = -1;
    for (let i = 0; i < allGroupsByXPos.length; i++) {
      if (!allGroupsByXPos[i].isExon) {
        errors.add("- There's an intron present");
        continue;
      }
      let currSprite = allGroupsByXPos[i].sprite;
      let groupI = allGroupsByXPos[i].i;

      if (i !== 0) {
        if (isColliding(currSprite, allGroupsByXPos[i - 1].sprite)) {
          if (groupI === lastGroupI) {
            errors.add("- An exon can only appear once");
          } else if (groupI < lastGroupI) {
            errors.add("- The order of your exons are incorrect");
          }
        } else {
          errors.add("- Not all your protein chains are connected");
        }
      }
      lastGroupI = groupI;
    } // end checking for errors

    if (errors.size > 0) {
      const output = Array.from(errors).join("\n");
      incorrectClick();
      this.showAlert("There are errors in your protein: \n" + output);
      return false;
    }

    const identifiers = allGroupsByXPos.map((element) => element.identifier).join('-');
    console.log(identifiers, this.createdRNA)
    if (this.createdRNA.includes(identifiers)) {
      this.showAlert("You've already created this protein before! Please try again.");
      return false;
    }

    if (this.createdRNA.length < 2) {
      this.createdRNA.push(identifiers);
      this.showAlert("This protein looks great! Try to create " + (3- this.createdRNA.length) +  " more!" );
      return false;
    }

      victoryClick();
      this.showAlert("Congratulations! The challenge is completed :)");
    return true;
  } // end create protien
}

function Easy({ onComplete }) {
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

    const game = new RNAGame(showAlert, divRef.current, {
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
    <div className={"w-full h-full"}>
      {alertShowing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80">
            <p className="mb-4 whitespace-pre-line text-center">{alertText}</p>
            <button
              className="bg-[#ff4343] text-white px-4 py-2 rounded-[5px]"
              onClick={() => setAlertShowing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div ref={resizeRef} className="w-full h-full">
        <div ref={divRef}></div>
      </div>
      
      <div className="flex flex-row justify-center items-center">
        <button
          className={`bg-red-600 px-7 py-2 m-2 text-white ${buttonStyles.redButton}`}
          onClick={() => {
            if (gameRef.current) {
              gameRef.current.resetClicked();
            }
          }}
        >
          Reset
        </button>
        <button
          className={`bg-black px-7 py-2 m-2 text-white ${buttonStyles.blackButton}`}
          onClick={() => {
            if (gameRef.current) {
              if (gameRef.current.checkClicked()) {
                onComplete();
              }
            }
          }}
        >
          Check
        </button>
      </div>
    </div>
  );
}

export default Easy;