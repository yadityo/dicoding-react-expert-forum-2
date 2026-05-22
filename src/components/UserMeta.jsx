import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/UserMeta.module.css';

function UserMeta({ name, avatar, subtitle }) {
  return (
    <div className={styles.wrap}>
      <img className={styles.avatar} src={avatar || 'https://ui-avatars.com/api/?name=User'} alt={name} />
      <div>
        <p className={styles.name}>{name}</p>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
    </div>
  );
}

UserMeta.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  subtitle: PropTypes.string,
};

UserMeta.defaultProps = {
  avatar: '',
  subtitle: '',
};

export default UserMeta;
