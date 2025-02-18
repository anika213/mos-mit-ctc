import { useCallback, useMemo, useState } from "react";
import Popup from "../../../components/Popup";
import {dingClick, victoryClick, incorrectClick} from '../../../components/ChallengesSound';

import {
  generateLightSleep,
  generateDeepSleep,
  generateREM,
  generateBiotsRespiration,
  generateObstructiveSleepApnea,
  generateHypopnea,
  generateCentralSleepApnea,
  generateCheyneStokes,
} from "./generator";
import { WirelessDetectionPlot, WirelessDetectionButton } from "./common";

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
      category: "regular rem sleep",
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
    [duplicatedPlots[i], duplicatedPlots[j]] = [
      duplicatedPlots[j],
      duplicatedPlots[i],
    ];
  }

  return duplicatedPlots;
}

function Medium({ onComplete }) {
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
        onComplete();
        return;
      }
      else {
        dingClick();
        setAlertText("Correct!");
        setAlertShowing(true);
      }
      setCurrentImage(currentPlot + 1);
    },
    [currentPlot, plots, setAlertText, setAlertShowing, setCurrentImage, onComplete ]
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
        <div className='flex justify-center'>
          <WirelessDetectionPlot data={plots[currentPlot].data} />
        </div>
        <div className="pt-2">
          <WirelessDetectionButton
            isIrregular={false}
            onClick={() => handleCategorization("regular light sleep")}
          >
            Regular Light Sleep
          </WirelessDetectionButton>

          <WirelessDetectionButton
            isIrregular={false}
            onClick={() => handleCategorization("regular deep sleep")}
          >
            Regular Deep Sleep
          </WirelessDetectionButton>

          <WirelessDetectionButton
            isIrregular={false}
            onClick={() => handleCategorization("regular rem sleep")}
          >
            Regular REM Sleep
          </WirelessDetectionButton>
        </div>

        <div className="pt-2">
          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("hypopnea")}
          >
            Hypopnea
          </WirelessDetectionButton>

          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("cheyne-stokes respiration")}
          >
            Cheyne-Stokes Respiration
          </WirelessDetectionButton>

          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("biot's respiration")}
          >
            Biot's Respiration
          </WirelessDetectionButton>
        </div>

        <div className="pt-2">
          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("obstructive sleep apnea")}
          >
            Obstructive Sleep Apnea
          </WirelessDetectionButton>

          <WirelessDetectionButton
            isIrregular={true}
            onClick={() => handleCategorization("central sleep apnea")}
          >
            Central Sleep Apnea
          </WirelessDetectionButton>
        </div>
      </div>
    </div>
  );
}

export default Medium;
