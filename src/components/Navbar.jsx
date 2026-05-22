import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logoutUser, selectAuthUser, selectIsAuthenticated } from '../features/auth/authSlice';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectAuthUser);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>Forum Notes</Link>
        <div className={styles.links}>
          <NavLink to="/" className={styles.link}>Threads</NavLink>
          <NavLink to="/leaderboards" className={styles.link}>Leaderboard</NavLink>
          {isAuthenticated ? <NavLink to="/new" className={styles.link}>Tulis</NavLink> : null}
        </div>
        <div className={styles.auth}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>{currentUser?.name}</span>
              <button type="button" onClick={() => dispatch(logoutUser())}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.link}>Login</NavLink>
              <NavLink to="/register" className={styles.link}>Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
