import { useCallback, useMemo, useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { generateRegularBreathing, generateSleepApnea } from "./generator";

function getPlotSize(windowWidth) {
  const plotWidth = windowWidth * 0.6;
  return {
    width: plotWidth,
    height: plotWidth / 2,
  };
}

function getPlotOptions(size) {
  return {
    width: size.width,
    height: size.height,
    legend: {
      show: false,
    },
    scales: {
      x: {
        time: false,
      },
      y: {
        auto: true,
      },
    },
    cursor: {
      drag: {
        setScale: false,
        x: false,
        y: false,
      },
    },
    axes: [{ show: false }, { show: false }],
    series: [
      {},
      {
        spanGaps: false,
        stroke: "red",
        width: 2,
      },
    ],
  };
}

function getPlots() {
  return [
    {
      src: "image1",
      data: generateRegularBreathing(4995, 15),
      category: "regular",
    },
    {
      src: "image2",
      data: generateRegularBreathing(5000, 12),
      category: "regular",
    },
    {
      src: "image3",
      data: generateSleepApnea(4995, 15),
      category: "irregular",
    },
  ];
}

function Easy() {
  const [currentPlot, setCurrentImage] = useState(0);
  const [alertShowing, setAlertShowing] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [size, setSize] = useState(getPlotSize(window.innerWidth));

  const plots = useMemo(() => getPlots(), []);
  const options = useMemo(() => getPlotOptions(size), [size]);

  useEffect(() => {
    const resizeCallback = () => {
      setSize(getPlotSize(window.innerWidth));
    };
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  const handleCategorization = useCallback(
    (category) => {
      if (category !== plots[currentPlot].category) {
        setAlertText("Incorrect!");
        setAlertShowing(true);
        return;
      }

      if (currentPlot === plots.length - 1) {
        setAlertText("You have completed the challenge!");
        setAlertShowing(true);
        return;
      }
      setCurrentImage(currentPlot + 1);
    },
    [currentPlot, plots, setAlertText, setAlertShowing, setCurrentImage]
  );

  return (
    <div className="flex justify-center">
      {alertShowing ? (
        <Popup alertText={alertText} setAlertShowing={setAlertShowing} />
      ) : null}
      <div className="text-center">
        <p>
          Breathing Pattern {currentPlot + 1} / {plots.length}
        </p>
        <p>{plots[currentPlot].src}</p>
        <UplotReact data={plots[currentPlot].data} options={options} />
        <div className="pt-2">
          <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular")}
          >
            Regular
          </button>
          <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}
          >
            Irregular
          </button>
        </div>
      </div>
    </div>
  );
}

export default Easy;
