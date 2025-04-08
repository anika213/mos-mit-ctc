import buttonStyles from "../pages/Buttons.module.css";

function Popup({ alertText, setAlertShowing }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center border-2 border-red-600 w-80">
        <p className="mb-4 whitespace-pre-line text-center">{alertText}</p>
        <button
          className={buttonStyles.redButton}
          onClick={() => setAlertShowing(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Popup;
