import { useCallback, useMemo, useState } from "react";
import Popup from "../../../components/Popup";
import { generateLightSleep, generateDeepSleep, generateObstructiveSleepApnea, generateCentralSleepApnea } from "./generator";
import { WirelessDetectionPlot, WirelessDetectionButton } from "./common";
import {dingClick, victoryClick, incorrectClick} from '../../../components/ChallengesSound';

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

  const plots = useMemo(() => getPlots(), []);

  const handleCategorization = useCallback(
    (category) => {
      if (category !== plots[currentPlot].category) {
        incorrectClick();
        setAlertText("Incorrect!");
        setAlertShowing(true);
        return;
      }
      

      if (currentPlot === plots.length - 1) {
        victoryClick();
        setAlertText("You have completed the challenge!");
        setAlertShowing(true);
        return;
      }
      else {
        dingClick();
        setAlertText("Correct!");
        setAlertShowing(true);
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
        <WirelessDetectionPlot data={plots[currentPlot].data}/>
        <div className="pt-2">
          <WirelessDetectionButton
            isIrregular={false}
            onClick={() => handleCategorization("regular")}
          >
            Regular
          </WirelessDetectionButton>
          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("irregular")}
          >
            Irregular
          </WirelessDetectionButton>
        </div>
      </div>
    </div>
  );
}

export default Easy;
