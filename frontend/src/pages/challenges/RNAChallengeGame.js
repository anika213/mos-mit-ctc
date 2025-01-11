import { useCallback, useEffect, useRef } from "react";
import Konva from "konva";
import { shuffleArray, isColliding, toAlphabetBase26 } from "../../utils/utils";

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
    this.sprite = this.makeRect({
      color: isExon ? "green" : "blue",
      ...spriteParams
    });
    this.spriteParams = spriteParams;
  }

  makeRect(
    { color, size, position }
  ) {
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
        strokeWidth: 3
      })
    );

    const text = new Konva.Text({
      text: this.identifier.toString(),
      fill: "white",
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
    return new SequenceChild(this.game, this.identifier, this.i, this.isExon, {
      ...this.spriteParams,
    });
  }

  dragStart() {
    this.sprite.stopDrag();

    const child = this.makeChild();
    this.game.addChild(child);
    child.sprite.startDrag();
  }
};

class SequenceChild extends NucleotideSequences {
  dragEnd() {
    if (isColliding(this.sprite, this.game.primaryLayer)) {
      this.game.removeChild(this);
    }
  }

  dragMove() {
    this.checkCollision();
  }

  checkCollision() {
    this.sprite.getLayer().children.forEach((group) => {
      if (group === this.sprite || group.isPrimary)  {
        return;
      }

      if (isColliding(group, this.sprite)) {
        this.highlight(group, this.sprite);  // Highlight in red
      } else {
        group.findOne("Rect").stroke("black");
      }
    });
  }

  highlight(group1, group2) {
    group1.findOne("Rect").stroke("red"); 
    group2.findOne("Rect").stroke("red");
  }
};


class RNAGame {
  sceneWidth = 1000;
  sceneHeight = 1000;
  stage;

  primaryLayer;
  childLayer;
  uiLayer;

  children = [];


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

  constructor(div, size) {
    // we will scale it later, 1000x1000 for consistency
    this.stage = new Konva.Stage({
      container: div,
      width: this.sceneWidth,
      height: this.sceneHeight,
    });
    this.stage.getContainer().style.border = "1px solid black";

    this.uiLayer = new Konva.Layer();
    this.stage.add(this.uiLayer);

    this.primaryLayer = new Konva.Layer();
    this.stage.add(this.primaryLayer);

    this.childLayer = new Konva.Layer();
    this.stage.add(this.childLayer);

    const rnaLength = 10;
    let x = 0;
    let y = 0;
    const spriteWidth = this.sceneWidth / rnaLength;
    const spriteHeight = spriteWidth;

    const rnaBlueprint = RNAGame.generateRNA(rnaLength);
    const sequence = [];
    for (let i = 0; i < rnaBlueprint.length; i++) {
      const spriteParams = {
        size: { width: spriteWidth, height: spriteHeight },
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
      x += spriteWidth;
    }

    const resetButton = new Konva.Rect({
      x: 0,
      y: 100,
      width: 100,
      height: 50,
      fill: "red",
    });
    resetButton.on("click", () => {
      this.children.forEach((element) => element.sprite.destroy());
      this.children = [];
    });

    this.uiLayer.add(resetButton);

    this.resize(size.width);
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
}

function RNAChallengeGame({ className = "" }) {
  const divRef = useRef(null);
  const resizeRef = useRef(null);
  const gameRef = useRef(null);

  const destroyGame = useCallback(() => {
    gameRef.current.destroy();
    gameRef.current = null;
  });

  const createGame = useCallback(() => {
    if (gameRef.current) {
      destroyGame();
    }

    const game = new RNAGame(divRef.current, {
      width: resizeRef.current.clientWidth,
      height: resizeRef.current.clientHeight,
    });

    gameRef.current = game;
  });

  // Create stage on mount
  useEffect(() => {
    createGame();

    return destroyGame;
  }, [createGame, destroyGame]);

  return (
    <div className={className}>
      <div ref={resizeRef} className="w-full h-full">
        <div ref={divRef}></div>
      </div>
    </div>
  );
}

export default RNAChallengeGame;
