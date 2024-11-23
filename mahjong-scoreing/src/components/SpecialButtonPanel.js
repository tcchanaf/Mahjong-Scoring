import { tiles, specialButtons } from "../utils/constant"
import './SpecialButtonPanel.css';



const SpecialButtonPanel = ({ handleButtonClick, buttonState }) => {

  return (
    <div className="special-button-panel">
      <div className="button-row">
        {specialButtons.slice(0, 6).map((button, index) => (
          <button
            key={index}
            className={`special-button ${buttonState[index] ? 'on' : 'off'}`}
            onClick={() => handleButtonClick(index)}
          >
            {button}
          </button>
        ))}
      </div>

      <div className="button-row">
        {specialButtons.slice(6, 12).map((button, index) => (
          <button
            key={index + 6} // Offset the index for the second row
            className={`special-button ${buttonState[index + 6] ? 'on' : 'off'}`}
            onClick={() => handleButtonClick(index + 6)}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};
  
  
export default SpecialButtonPanel;