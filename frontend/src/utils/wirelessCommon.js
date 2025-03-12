import { useMemo, useEffect, useState } from "react";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import buttonStyles from "../pages/Buttons.module.css"

// Creates a 1:2 plot that takes up 60% of the width of the window
export function getPlotSize(windowWidth) {
  const plotWidth = windowWidth * 0.6;
  return {
    width: plotWidth,
    height: plotWidth / 2,
  };
}

// Basic plot settings
export function getPlotOptions(size) {
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

export function WirelessDetectionPlot({ data }) {
  const [size, setSize] = useState(getPlotSize(window.innerWidth));
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
  return <UplotReact data={data} options={options} />;
}

export function WirelessDetectionButton({ children, onClick, isIrregular }) {
  return (
    <button
      className={
        "mx-2 mb-2 md:my-0 px-4 py-2 text-white " +
        (isIrregular
          ? `${buttonStyles.redButton}`
          : `${buttonStyles.blackButton}`)
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
