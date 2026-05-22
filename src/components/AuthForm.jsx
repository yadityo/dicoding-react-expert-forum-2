import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/AuthForm.module.css';

function AuthForm({ mode, onSubmit, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'register') {
      onSubmit({ name, email, password });
      return;
    }
    onSubmit({ email, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>{mode === 'register' ? 'Buat akun baru' : 'Masuk ke akun Anda'}</h1>
      {mode === 'register' ? (
        <label htmlFor="name">
          Nama
          <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
      ) : null}
      <label htmlFor="email">
        Email
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label htmlFor="password">
        Password
        <input id="password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button type="submit">{mode === 'register' ? 'Daftar' : 'Login'}</button>
    </form>
  );
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

AuthForm.defaultProps = {
  error: '',
};

export default AuthForm;
