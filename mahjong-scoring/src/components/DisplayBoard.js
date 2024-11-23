import React from 'react';
import DisplayRow from './DisplayRow';
import { tiles } from "../utils/constant"
import './MainPage.css';

const SelectBoard = ({ handleTileClick }) => {
  return (
      <div>
        {["tungzi", "sokzi", "maanzi", "faanzi"].map((category, index) => {
            return (
                <DisplayRow
                  key={index}
                  tiles={tiles[category]}
                  handleTileClick={handleTileClick}
                />
            );
          })
        }
      </div>
  );
};


export default SelectBoard;
