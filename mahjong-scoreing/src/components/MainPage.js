import React, { useState } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import SelectBoard from './DisplayBoard';
import FlowerBoard from './FlowerBoard';
import DisplayRow from './DisplayRow';
import ResultBoard from './ResultBoard';
import './MainPage.css';
import './ResultModal.css';
import { calculateScore } from '../utils/scoring';
import { tiles } from "../utils/constant"


const MainPage = () => {
  const [openHand, setOpenHand] = useState([]);  // 明牌 (Open Hand)
  const [closedHand, setClosedHand] = useState([]);  // 暗牌 (Closed Hand)
  const [isOpenHand, setIsOpenHand] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);

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

  const handleReset = ()  => {
    setOpenHand([]);
    setClosedHand([]);
    setFlowerTilesState(new Array(8).fill(0));
  }

  // Handle opening the modal and calculating the score
  const handleCalculateScore = () => {
    const flowers = flowerTilesState
      .map((value, index) => (value === 1 ? tiles["flowers"][index] : null))
      .filter(value => value !== null);
    
    const faanResults = calculateScore(openHand, closedHand, flowers);
    const calculatedScore = 0;
    setScore(calculatedScore);
    setResults(faanResults);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFlowerTile = (index) => {
      setFlowerTilesState((prevState) => {
          const newState = [...prevState ];
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
          label={isOpenHand ? '門前' : '暗牌'}
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

        <div className="select-board-third">
          <button onClick={handleReset} className="remove-button">
            重設
          </button>
          <button onClick={handleRemoveLastTile} className="remove-button">
            移除上一張牌
          </button>
          <button onClick={handleCalculateScore} className="calculate-button">
            計番
          </button>
        </div>
      </div>


      <div className="display">
        <h2 className="tile-section-title">門前:</h2>
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
      </div>


      <ResultBoard score={score} results={results} open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainPage;
