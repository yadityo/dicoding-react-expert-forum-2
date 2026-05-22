import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboards, selectLeaderboards } from '../features/leaderboards/leaderboardsSlice';
import styles from '../styles/Page.module.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectLeaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <section className={styles.page}>
      <h1>Leaderboard</h1>
      <div className={styles.leaderboard}>
        {items.map((item, index) => (
          <article key={item.user.id} className={styles.leaderItem}>
            <span className={styles.rank}>{index + 1}</span>
            <img src={item.user.avatar} alt={item.user.name} className={styles.avatar} />
            <span className={styles.name}>{item.user.name}</span>
            <strong className={styles.score}>{item.score}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LeaderboardPage;
