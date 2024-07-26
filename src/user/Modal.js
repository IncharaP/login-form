import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {children}
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
