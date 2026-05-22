import React from 'react';
import styles from '../styles/LoadingIndicator.module.css';

function LoadingIndicator() {
  return (
    <div className={styles.barWrap} aria-label="loading-indicator">
      <div className={styles.bar} />
    </div>
  );
}

export default LoadingIndicator;
