import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date';
import { excerpt } from '../utils/text';
import UserMeta from './UserMeta';
import styles from '../styles/ThreadCard.module.css';

function ThreadCard({ thread }) {
  return (
    <article className={styles.card}>
      <p className={styles.category}>#{thread.category || 'uncategorized'}</p>
      <Link to={`/threads/${thread.id}`} className={styles.title}>{thread.title}</Link>
      <p className={styles.excerpt}>{excerpt(thread.body.replace(/<[^>]+>/g, ''), 160)}</p>
      <div className={styles.meta}>
        <UserMeta name={thread.owner?.name || 'Unknown'} avatar={thread.owner?.avatar} subtitle={formatDate(thread.createdAt)} />
        <span className={styles.comments}>{thread.totalComments} komentar</span>
      </div>
    </article>
  );
}

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default ThreadCard;
