const FlowerDisplayRow = ({ tiles, handleTileClick, tileState }) => {
    return (
        <div className="tile-row">
          {tiles.map((tile, index) => {
            const tileClass = tileState[index] === 1 ? "active" : "inactive";
            return (
              <div
                key={index}
                className={`tile ${tileClass}`}
                onClick={() => handleTileClick(index)}
              >
                <img src={`${process.env.PUBLIC_URL}/images/${tile}.png`} alt={tile} className="tile-image" />
              </div>
            );
          })}
        </div>
    );
  };

export default FlowerDisplayRow;
