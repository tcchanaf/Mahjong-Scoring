import React from 'react';

const DisplayRow = ({ tiles, handleTileClick }) => {
  return (
    <div className="tile-category">
      <div className="tile-row">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            onClick={() => handleTileClick(tile)} 
          >
            {tile}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayRow;
