import { useCallback, useMemo, useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { generateLightSleep, generateDeepSleep, generateREM, generateBiotsRespiration,
    generateCentralSleepApnea, generateCheyneStokes, generateHypopnea, 
    generateObstructiveSleepApnea} from "./generator";

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
      show: true, // True for testing purposes
    },
    scales: {
      x: {
        time: false,
      },
      y: {
        auto: false, // y axis should NOT scale so that amplitudes look different
        range: [-2000, 2000],
      },
    },
    cursor: {
      drag: {
        setScale: false,
        x: false,
        y: false,
      },
    },
    axes: [{ show: true }, { show: true }], // True for testing purposes
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
  const plots = [
    {
        data: generateLightSleep(),
        category: "regular light sleep",
    },
    {
        data: generateDeepSleep(),
        category: "regular deep sleep",
    },
    {
        data: generateREM(),
        category: "irregular rem sleep",
    },
    {
        data: generateObstructiveSleepApnea(),
        category: "obstructive sleep apnea",
    },
    {
        data: generateHypopnea(),
        category: "hypopnea",
    },
    {
        data: generateCheyneStokes(),
        category: "cheyne-stokes respiration",
    },
    {
        data: generateCentralSleepApnea(),
        category: "central sleep apnea",
    },
    {
        data: generateBiotsRespiration(),
        category: "biot's respiration",
    },
  ];

  const duplicatedPlots = [...plots, ...plots];

  for (let i = duplicatedPlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [duplicatedPlots[i], duplicatedPlots[j]] = [duplicatedPlots[j], duplicatedPlots[i]];
  }

  return duplicatedPlots;
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

        <p>
          Breathing Pattern {plots[currentPlot].category}
        </p>

        <UplotReact data={plots[currentPlot].data} options={options} />

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular light sleep")}>
                Regular Light Sleep
            </button>

            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular deep sleep")}>
                Regular Deep Sleep
            </button>

            <button
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleCategorization("regular rem sleep")}>
                Regular REM Sleep
            </button>
        </div>

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("hypopnea")}>
                Hypopnea
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("cheyne-stokes respiration")}>
                Cheyne-Stokes Respiration
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("biot's respiration")}>
                Biot's Respiration
            </button>
        </div>

        <div className="pt-2">
            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("obstructive sleep apnea")}>
                Obstructive Sleep Apnea
            </button>

            <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCategorization("central sleep apnea")}>
                Central Sleep Apnea
            </button>
        </div>
      </div>
    </div>
  );
}

export default Medium;