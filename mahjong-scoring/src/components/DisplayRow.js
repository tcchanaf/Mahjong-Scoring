import React from 'react';

const DisplayRow = ({ tiles, handleTileClick }) => {
  return (
      <div className="tile-row" >
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            onClick={() => handleTileClick(tile)} 
          >
            <img src={`${process.env.PUBLIC_URL}/images/${tile}.png`} alt={tile} className="tile-image" />
          </div>
        ))}
      </div>
  );
};

export default DisplayRow;
