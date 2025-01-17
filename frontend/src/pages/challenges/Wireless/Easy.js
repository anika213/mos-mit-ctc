import { useCallback, useMemo, useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { generateLightSleep, generateDeepSleep, generateObstructiveSleepApnea, generateCentralSleepApnea } from "./generator";

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
      show: false, // True for testing purposes
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
    axes: [{ show: false }, { show: false }], // True for testing purposes
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
  const plots = [
    {
      data: generateDeepSleep(),
      category: "regular",
    },
    {
      data: generateLightSleep(),
      category: "regular",
    },
    {
      data: generateObstructiveSleepApnea(),
      category: "irregular",
    },
    {
      data: generateCentralSleepApnea(),
      category: "irregular",
    },
  ];

  for (let i = plots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [plots[i], plots[j]] = [plots[j], plots[i]];
  }

  return plots;
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
