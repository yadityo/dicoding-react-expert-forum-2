import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/CommentItem.module.css';
import { sanitizeHtml } from '../utils/html';
import { formatDate } from '../utils/date';
import UserMeta from './UserMeta';
import VoteButtons from './VoteButtons';

function CommentItem({ comment, currentVote, onUpVote, onDownVote }) {
  return (
    <article className={styles.card}>
      <UserMeta name={comment.owner.name} avatar={comment.owner.avatar} subtitle={formatDate(comment.createdAt)} />
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }} />
      <VoteButtons
        upCount={comment.upVotesBy.length}
        downCount={comment.downVotesBy.length}
        currentVote={currentVote}
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />
    </article>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
  }).isRequired,
  currentVote: PropTypes.number,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

CommentItem.defaultProps = {
  currentVote: 0,
};

export default CommentItem;
