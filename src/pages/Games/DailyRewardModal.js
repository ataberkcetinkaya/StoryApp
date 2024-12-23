import React from 'react';
import './DailyRewardModal.css';

const DailyRewardModal = ({ isOpen, onClose, reward, totalReward, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ color: 'black' }}>
      <div className="modal-content">
        <h2>Günlük Ödül</h2>
        <p>{message}</p>
        <p>Günlük Ödül: <strong>{reward}</strong> puan</p>
        <p>Toplam Ödül: <strong>{totalReward}</strong> puan</p>
        <button onClick={onClose} className="close-button">Kapat</button>
      </div>
    </div>
  );
};

export default DailyRewardModal;
