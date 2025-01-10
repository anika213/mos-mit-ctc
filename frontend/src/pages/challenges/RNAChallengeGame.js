import { useCallback, useEffect, useRef } from "react";
import Konva from "konva";
import { shuffleArray } from "../../utils/utils";

class NucleotideSequences {
  identifier;
  i;
  isPrimary;
  sprite;
  spriteParams;

  constructor(identifier, i, isPrimary, spriteParams) {
    this.identifier = identifier;
    this.i = i; 
    this.isPrimary = isPrimary;
    this.sprite = this.makeSprite(spriteParams)
    this.spriteParams = spriteParams;
  }

  makeChild(dragEnd) {
    return new this.constructor(this.identifier, this.i, false, {
      ...this.spriteParams,
      dragStart: (element, elementSprite) => {},
      dragEnd
    });
  }

  makeSprite(spriteParams) {
    throw new Error("Not implemented");
  }

  makeRect(color, { size, position, stage, dragStart = () => {}, dragEnd = () => {} }) {
    const group = new Konva.Group({
      draggable: true,
      ...position,
      ...size
    });

    group.on("dragstart", () => {
      dragStart(this, group);
    });
    group.on("dragend", () => {
      dragEnd(this, group);
    });
    group.on("mouseenter", () => {
      stage.container().style.cursor = "move";
    });
    group.on("mouseleave", () => {
      stage.container().style.cursor = "default";
    });
    
    group.on("dragmove", (e) => {
      this.checkCollision(e);
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

  checkCollision(e) {
    const target = e.target;
    const targetRect = target.getClientRect();

    target.getLayer().children.forEach((group) => {

      if (group === target || group.isPrimary)  {
        return;
      }
      const groupRect = group.getClientRect();

      if (this.haveIntersection(groupRect, targetRect)) {
        this.highlight(group, target);  // Highlight in red
      } else {
        group.findOne("Rect").stroke("black");
      }
    });
  }

  haveIntersection(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  highlight(group1, group2) {
    group1.findOne("Rect").stroke("red"); 
    group2.findOne("Rect").stroke("red");
    group1.getLayer().batchDraw(); // Redraw the layer to apply the changes
  }
  
  
}

class Exon extends NucleotideSequences {
  makeSprite(params) {
    return super.makeRect("green", params);
  }
}

class Intron extends NucleotideSequences {
  makeSprite(params) {
    return super.makeRect("blue", params);
  }
}

function isColliding(rect1, rect2) {
  return !(
    rect1.getClientRect().x > rect2.getClientRect().x + rect2.getClientRect().width ||
    rect1.getClientRect().x + rect1.getClientRect().width < rect2.getClientRect().x ||
    rect1.getClientRect().y > rect2.getClientRect().y + rect2.getClientRect().height ||
    rect1.getClientRect().y + rect1.getClientRect().height < rect2.getClientRect().y
  );
}

class RNAGame {
  sceneWidth = 1000;
  sceneHeight = 1000;
  stage;

  static identifierFromI(i) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    while (i >= 0) {
      result = alphabet[i % 26] + result;
      i = Math.floor(i / 26) - 1;
    }
    return result;
  }

  static generateRNA(length) {
    // somewhere from 40-60% of the sequence is exons
    let exonCount = Math.floor(length * (0.4 + Math.random() * 0.3));
    let isExonArray = shuffleArray(Array(exonCount).fill(true).concat(Array(length - exonCount).fill(false)));
    let exonI = 0;
    let sequence = isExonArray.map((isExon, i) => {
      return isExon ? { isExon, identifier: this.identifierFromI(exonI++), i } : { isExon, identifier: "-", i };
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

    const parentLayer = new Konva.Layer();
    this.stage.add(parentLayer);

    const childLayer = new Konva.Layer();
    this.stage.add(childLayer);

    const parentDragStart = (element, elementSprite) => {
      elementSprite.stopDrag();

      const child = element.makeChild((element, elementSprite) => {
        if (isColliding(elementSprite, parentLayer)) {
          elementSprite.destroy();
        }
      });
      childLayer.add(child.sprite);
      child.sprite.startDrag()
    };
    const rnaLength = 10;
    let x = 0;
    let y = 0;
    const spriteWidth = this.sceneWidth / rnaLength;
    const spriteHeight = spriteWidth;

    const rnaBlueprint = RNAGame.generateRNA(rnaLength);
    const sequence = []
    for (let i = 0; i < rnaBlueprint.length; i++) {
      const spriteParams = {
        size: { width: spriteWidth, height: spriteHeight }, 
        position: { x, y },
        stage: this.stage,
        dragStart: parentDragStart
      }

      const blueprint = rnaBlueprint[i];
      const element = blueprint.isExon ? new Exon(blueprint.identifier, blueprint.i, true, spriteParams) : new Intron(blueprint.identifier, blueprint.i, true, spriteParams);

      sequence.push(element);
      parentLayer.add(element.sprite);
      x += spriteWidth;
    }

    this.resize(size.width);
  }

  resize(actualWidth) {
    let scale = actualWidth / this.sceneWidth;

    this.stage.width(this.sceneWidth * scale);
    this.stage.height(this.sceneHeight * scale);

    this.stage.scale({ x: scale, y: scale });
  }

  destroy() {
    this.stage.destroy();
  }
}

// function makeSequenceParent(isExon, x, y, onDragStart, name) {
//   const rect = makeSequenceRect(isExon, x, y, name);
//   rect.draggable(true);
//   rect.on("dragstart", () => {
//     rect.stopDrag();
//     onDragStart(isExon, x, y, name);
//   });

//   return rect;
// }

// function makeSequenceChild(isExon, x, y, name) {
//   const rect = makeSequenceRect(isExon, x, y, name);

//   rect.draggable(true);
//   rect.on("dragend", () => {
//     if (rect.y() < 100) {
//       rect.destroy();
//     }
//   });

//   return rect;
// }

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
