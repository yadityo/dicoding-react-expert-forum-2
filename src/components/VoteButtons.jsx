import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/VoteButtons.module.css';

function VoteButtons({ upCount, downCount, currentVote, onUpVote, onDownVote }) {
  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.button} ${currentVote === 1 ? styles.activeUp : ''}`} onClick={onUpVote}>
        ▲ {upCount}
      </button>
      <button type="button" className={`${styles.button} ${currentVote === -1 ? styles.activeDown : ''}`} onClick={onDownVote}>
        ▼ {downCount}
      </button>
    </div>
  );
}

VoteButtons.propTypes = {
  upCount: PropTypes.number.isRequired,
  downCount: PropTypes.number.isRequired,
  currentVote: PropTypes.number,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

VoteButtons.defaultProps = {
  currentVote: 0,
};

export default VoteButtons;
