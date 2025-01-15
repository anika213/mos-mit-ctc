import { useCallback, useState } from "react";
import Popup from "../../../components/Popup";

function Easy() {
  const images = [
    {
      src: 'image1',
      category: 'regular'
    },
    {
      src: 'image2',
      category: 'regular'
    },
    {
      src: 'image3',
      category: 'irregular'
    }
  ];

  const [alertShowing, setAlertShowing] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  const handleCategorization = useCallback((category) => {
    if (category === images[currentImage].category) {
      if (currentImage === images.length - 1) {
        setAlertText('You have completed the challenge!');
        setAlertShowing(true);
      } else {
        setCurrentImage(currentImage + 1);
      }
    } else {
      setAlertText('Incorrect!');
      setAlertShowing(true);
    }
  }, [currentImage, images]);

  return (
    <div>
      {
        alertShowing && (
          <Popup
            alertText={alertText}
            setAlertShowing={setAlertShowing}
          />
        )
      }
      <p>{images[currentImage].src}</p>
      <div>
        <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleCategorization("regular")}>Regular</button>
        <button className="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleCategorization("irregular")}>Irregular</button>
      </div>
    </div>
  )
}

export default Easy;
