import FlowerDisplayRow from './FlowerDisplayRow';
import { tiles } from "../utils/constant"
import React from 'react';

const FlowerBoard = ({ handleTileClick, flowerTilesState }) => {

  
    return (
        <FlowerDisplayRow
          className="tile-row"
          tiles={tiles["flowers"]}
          handleTileClick={(index) => handleTileClick(index)}
          tileState={flowerTilesState}
        />
    );
  };
  
  
export default FlowerBoard;
