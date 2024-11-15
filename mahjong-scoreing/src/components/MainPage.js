import React, { useState } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import SelectBoard from './DisplayBoard';
import DisplayRow from './DisplayRow';
import ResultBoard from './ResultBoard';
import './MainPage.css';
import './ResultModal.css';
import { calculateScore } from '../utils/scoring';

const tiles = {
    tungzi: [101, 102, 103, 104, 105, 106, 107, 108, 109],  // 筒子: 1筒 to 9筒
    sokzi: [201, 202, 203, 204, 205, 206, 207, 208, 209],  // 條: 1條 to 9條
    maanzi: [301, 302, 303, 304, 305, 306, 307, 308, 309],  // 萬子: 1萬 to 9萬
    faanzi: [1, 3, 5, 7, 11, 13, 15],  // 番子: 東風, 南風, 西風, 北風, 白龍, 發財, 中發
    faa: [21, 23, 25, 27],  // 花: 春, 夏, 秋, 冬
};

const MainPage = () => {
  const [openHand, setOpenHand] = useState([]);  // 明牌 (Open Hand)
  const [closedHand, setClosedHand] = useState([]);  // 暗牌 (Closed Hand)
  const [isOpenHand, setIsOpenHand] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [score, setScore] = useState(null);

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

  return (
    <div className="main-page">
      <div className="header">
        <h1>台牌數番 App</h1>

        <FormControlLabel
          control={<Switch checked={isOpenHand} onChange={handleSwitchChange} />}
          label={isOpenHand ? '明牌 (Open Hand)' : '暗牌 (Closed Hand)'}
        />
      </div>

      <SelectBoard
        tiles={tiles} 
        handleTileClick={handleTileClick}
      />

      <div className="selected-tiles">
        <button onClick={handleRemoveLastTile} className="remove-button">
          移除上一個選擇
        </button>
      </div>

      <div className="open-hand">
        <h2>明牌:</h2>
        <div className="tile-row">
            <DisplayRow
                tiles={openHand}
                handleTileClick={handleTileClick}
            />
        </div>
      </div>

      <div className="closed-hand">
        <h2>暗牌:</h2>
        <div className="tile-row">
            <DisplayRow
                tiles={closedHand}
                handleTileClick={handleTileClick}
            />
        </div>
      </div>

      <div className="calculate-score">
        <button onClick={handleCalculateScore} className="calculate-button">
          計番
        </button>
      </div>

      <ResultBoard score={score} open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainPage;
