import { useCallback, useMemo, useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { generateRegularBreathing, generateSleepApnea } from "./generator";

// Creates a 1:2 plot that takes up 60% of the width of the window
function getPlotSize(windowWidth) {
  const plotWidth = windowWidth * 0.6;
  return {
    width: plotWidth,
    height: plotWidth / 2,
  };
}

// Basic plot settings
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

// Creates plots for each sleeping pattern
// Should probably be in a random order right?
function getPlots() {
  return [
    {
        src: "image1",
        data: generateRegularBreathing(4995, 15),
        category: "regular light sleep",
    },
    {
        src: "image2",
        data: generateRegularBreathing(5000, 12),
        category: "regular deep sleep",
    },
    {
        src: "image3",
        data: generateSleepApnea(4995, 15),
        category: "irregular rem sleep",
    },
    {
        src: "image4",
        data: generateRegularBreathing(4995, 15),
        category: "obstructive sleep apnea",
    },
    {
        src: "image5",
        data: generateRegularBreathing(5000, 12),
        category: "hypopnea",
    },
    {
        src: "image6",
        data: generateSleepApnea(4995, 15),
        category: "cheyne-stokes respiration",
    },
    {
        src: "image7",
        data: generateRegularBreathing(4995, 15),
        category: "central sleep apnea",
    },
    {
        src: "image8",
        data: generateRegularBreathing(5000, 12),
        category: "biot's respiration",
    },
  ];
}

function Medium() {
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
      else {
        setAlertText("Correct!");
        setAlertShowing(true);
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

        <UplotReact data={plots[currentPlot].data} options={options} />

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular")}>
                Regular Light Sleep
            </button>

            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular")}>
                Regular Deep Sleep
            </button>

            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular")}>
                Regular REM Sleep
            </button>
        </div>

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}>
                Hypopnea
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}>
                Cheyne-Stokes Respiration
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}>
                Biot's Respiration
            </button>
        </div>

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}>
                Obstructive Sleep Apnea
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("irregular")}>
                Central Sleep Apnea
            </button>
        </div>
      </div>
    </div>
  );
}

export default Medium;