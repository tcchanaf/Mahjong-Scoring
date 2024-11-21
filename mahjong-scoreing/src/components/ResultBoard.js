// src/components/ResultBoard.js
import React from 'react';
import { Modal, Box, Button } from '@mui/material';
import DisplayRow from './DisplayRow';


// This component handles the modal that displays the result
const ResultBoard = ({ results, score, open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="score-modal-title"
      aria-describedby="score-modal-description"
    >
      <Box className="modal-box">
        <h2 id="score-modal-title">總番數: {score}</h2>

        <div className="result-content">
          {results.map((item, index) => (
            <div key={index} className="result-item">
              {item[0]} &nbsp; {item[1]} &nbsp; 
              <DisplayRow tiles={item[2]} className="tile-row" />
            </div>
          ))}
        </div>

        <Button onClick={onClose} color="primary" variant="contained">
          關閉
        </Button>
      </Box>
    </Modal>
  );
};


export default ResultBoard;
