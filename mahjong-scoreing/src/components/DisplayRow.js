import React from 'react';

const DisplayRow = ({ tiles, handleTileClick, className }) => {
  return (
      <div className={`${className}`} >
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            onClick={() => handleTileClick(tile)} 
          >
              <img src={`/images/${tile}.png`} alt={tile} className="tile-image" />
          </div>
        ))}
      </div>
  );
};

export default DisplayRow;
