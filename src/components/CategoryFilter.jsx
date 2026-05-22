import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/CategoryFilter.module.css';

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className={styles.wrap}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.button} ${selected === category ? styles.active : ''}`}
          onClick={() => onSelect(category)}
        >
          #{category}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
