import React from 'react';
import DisplayRow from './DisplayRow';

const SelectBoard = ({ tiles, handleTileClick }) => {
  return (
    <div className="tile-grid">
      {Object.keys(tiles).map((category, index) => (
        <DisplayRow
          key={index}
          tiles={tiles[category]} 
          handleTileClick={handleTileClick}
        />
      ))}
    </div>
  );
};


export default SelectBoard;
