// src/components/ResultBoard.js
import React from 'react';
import { Modal, Box, Button } from '@mui/material';

// This component handles the modal that displays the result
const ResultBoard = ({ score, open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="score-modal-title"
      aria-describedby="score-modal-description"
    >
      <Box className="modal-box">
        <h2 id="score-modal-title">計算結果</h2>
        <p id="score-modal-description">您的總番數為: {score}</p>
        <Button onClick={onClose} color="primary" variant="contained">
          關閉
        </Button>
      </Box>
    </Modal>
  );
};

export default ResultBoard;
