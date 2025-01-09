import { useCallback, useEffect, useRef } from "react";
import Konva from "konva";

function makeSequenceRect(isExon, x, y, name) {
  const width = 50;
  const height = 100;
  const group = new Konva.Group({
    x: x,
    y: y,
    width: width,
    height: height,
  });

  group.add(new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: isExon ? "red" : "blue",
  }));

  const text = new Konva.Text({
    text: name.toString(),
    fill: "white",
    fontSize: 20
  });

  const textX = (width - text.width()) / 2;
  const textY = (height - text.height()) / 2;

  text.position({x: textX, y: textY});
  group.add(text);

  return group;
}

function makeSequenceParent(isExon, x, y, onDragStart, name) {
  const rect = makeSequenceRect(isExon, x, y, name);
  rect.draggable(true);
  rect.on("dragstart", () => {
    rect.stopDrag();
    onDragStart(isExon, x, y, name);
  });

  return rect;
}

function makeSequenceChild(isExon, x, y, name) {
  const rect = makeSequenceRect(isExon, x, y, name);

  rect.draggable(true);
  rect.on("dragend", () => {
    if (rect.y() < 100) {
      rect.destroy();
    }
  });

  return rect;
}

function RNAChallengeGame({className=""}) {
  const divRef = useRef(null);
  const resizeRef = useRef(null);
  const stageRef = useRef(null);

  const destroyStage = useCallback(() => {
    stageRef.current.destroy();
    stageRef.current = null;
  });

  const createStage = useCallback(() => {
    if (stageRef.current) {
      destroyStage();
    }

    const stage = new Konva.Stage({
      container: divRef.current,
      width: resizeRef.current.clientWidth,
      height: resizeRef.current.clientHeight,
    });
    stage.getContainer().style.border = "1px solid black";

    const layer = new Konva.Layer();
    const onDragStart = (isExon, x, y, name) => {
      const child = makeSequenceChild(isExon, x, y, name);
      layer.add(child);
      child.startDrag();
    }
    let x = 0;
    let y = 0;
    layer.add(makeSequenceParent(true, x, y, onDragStart, 0));
    x += 50;
    layer.add(makeSequenceParent(false, x, y, onDragStart, 1));
    x += 50;
    layer.add(makeSequenceParent(true, x, y, onDragStart, 2));
    x += 50;
    layer.add(makeSequenceParent(false, x, y, onDragStart, 3));

    stage.add(layer);

    stageRef.current = stage;
  });

  // Create stage on mount
  useEffect(() => {
    createStage();

    return destroyStage;
  }, [createStage, destroyStage]);

  return (
    <div className={className}>
      <div ref={resizeRef} className="w-full h-full">
        <div ref={divRef}></div>
      </div>
    </div>
  );
}

export default RNAChallengeGame;
