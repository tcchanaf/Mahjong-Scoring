import React, { useState } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import SelectBoard from './DisplayBoard';
import FlowerBoard from './FlowerBoard';
import DisplayRow from './DisplayRow';
import ResultBoard from './ResultBoard';
import './MainPage.css';
import './ResultModal.css';
import { calculateScore } from '../utils/scoring';


const MainPage = () => {
  const [openHand, setOpenHand] = useState([]);  // 明牌 (Open Hand)
  const [closedHand, setClosedHand] = useState([]);  // 暗牌 (Closed Hand)
  const [isOpenHand, setIsOpenHand] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [score, setScore] = useState(null);

  const [flowerTilesState, setFlowerTilesState] = useState(new Array(8).fill(0));

  const handleTileClick = (tile) => {
    if (isOpenHand) {
      setOpenHand((prevOpenHand) => [...prevOpenHand, tile]);
    } else {
      setClosedHand((prevClosedHand) => [...prevClosedHand, tile]);
    }
  };

  // Handle switch change between Open Hand and Closed Hand
  const handleSwitchChange = (event) => {
    setIsOpenHand(event.target.checked);
  };

  // Handle the removal of the last selected tile
  const handleRemoveLastTile = () => {
    if (isOpenHand && openHand.length > 0) {
      setOpenHand(openHand.slice(0, -1));
    } else if (!isOpenHand && closedHand.length > 0) {
      setClosedHand(closedHand.slice(0, -1));
    }
  };

  // Handle opening the modal and calculating the score
  const handleCalculateScore = () => {
    const calculatedScore = calculateScore(openHand, closedHand);
    setScore(calculatedScore);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  // Handle the click event for a flower tile to toggle its state
  const handleFlowerTile = (index) => {
      setFlowerTilesState((prevState) => {
          const newState = { ...prevState };
          newState[index] = newState[index] === 0 ? 1 : 0;
          return newState;
      });
  };

  return (
    <div className="main-page">
      <div className="header">
        <h1>台牌數番 App</h1>

        <FormControlLabel
          control={<Switch checked={isOpenHand} onChange={handleSwitchChange} />}
          label={isOpenHand ? '明牌 (Open Hand)' : '暗牌 (Closed Hand)'}
        />
      </div>
      <div className="select-board-container">
        <div className="select-board-first">
          <SelectBoard
            handleTileClick={handleTileClick}
          />
        </div>
        <div className="select-board-second">
          <FlowerBoard
            handleTileClick={handleFlowerTile}
            flowerTilesState={flowerTilesState}
          />
        </div>
        {/* TODO right board */}
        <div className="select-board-right">
          <button onClick={handleRemoveLastTile} className="remove-button">
            移除上一個選擇
          </button>
          <button onClick={handleCalculateScore} className="calculate-button">
            計番
          </button>
        </div>
      </div>


        <h2 className="tile-section-title">明牌:</h2>
        <DisplayRow
            className="tile-row-display"
            tiles={openHand}
            handleTileClick={handleTileClick}
        />


        <h2 className="tile-section-title">暗牌:</h2>
        <DisplayRow
            className="tile-row-display"
            tiles={closedHand}
            handleTileClick={handleTileClick}
        />



      <ResultBoard score={score} open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainPage;
