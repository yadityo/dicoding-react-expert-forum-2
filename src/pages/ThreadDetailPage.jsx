import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils/date';
import { sanitizeHtml } from '../utils/html';
import UserMeta from '../components/UserMeta';
import VoteButtons from '../components/VoteButtons';
import CommentItem from '../components/CommentItem';
import {
  applyCommentVoteOptimistic,
  applyDetailThreadVoteOptimistic,
  clearThreadDetail,
  createComment,
  fetchThreadDetail,
  selectThreadDetail,
  toggleCommentVote,
} from '../features/threadDetail/threadDetailSlice';
import { applyThreadVoteOptimistic, toggleThreadVote } from '../features/threads/threadsSlice';
import { selectAuthUser } from '../features/auth/authSlice';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import styles from '../styles/Page.module.css';

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector(selectThreadDetail);
  const currentUser = useSelector(selectAuthUser);
  const token = useSelector((state) => state.auth.token);
  const [content, setContent] = useState('');
  const { ensureAuth } = useAuthRedirect();

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, id]);

  if (!thread) return null;

  const userId = currentUser?.id;
  const threadVote = userId ? (thread.upVotesBy.includes(userId) ? 1 : thread.downVotesBy.includes(userId) ? -1 : 0) : 0;

  const handleThreadVote = async (voteType) => {
    if (!ensureAuth()) return;
    const nextVote = threadVote === voteType ? 0 : voteType;
    dispatch(applyDetailThreadVoteOptimistic({ userId, voteType: nextVote }));
    dispatch(applyThreadVoteOptimistic({ threadId: thread.id, userId, voteType: nextVote }));

    const result = await dispatch(toggleThreadVote({ threadId: thread.id, voteType, token, currentVote: threadVote }));
    if (toggleThreadVote.rejected.match(result)) {
      dispatch(applyDetailThreadVoteOptimistic({ userId, voteType: threadVote }));
      dispatch(applyThreadVoteOptimistic({ threadId: thread.id, userId, voteType: threadVote }));
    }
  };

  const handleCommentVote = async (comment, voteType) => {
    if (!ensureAuth()) return;
    const currentVote = comment.upVotesBy.includes(userId) ? 1 : comment.downVotesBy.includes(userId) ? -1 : 0;
    const nextVote = currentVote === voteType ? 0 : voteType;
    dispatch(applyCommentVoteOptimistic({ commentId: comment.id, userId, voteType: nextVote }));
    const result = await dispatch(toggleCommentVote({ threadId: id, commentId: comment.id, voteType, token, currentVote }));
    if (toggleCommentVote.rejected.match(result)) {
      dispatch(applyCommentVoteOptimistic({ commentId: comment.id, userId, voteType: currentVote }));
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!ensureAuth()) return;
    await dispatch(createComment({ threadId: id, content, token }));
    setContent('');
  };

  return (
    <article className={styles.page}>
      <p className={styles.category}>#{thread.category || 'uncategorized'}</p>
      <h1>{thread.title}</h1>
      <UserMeta name={thread.owner.name} avatar={thread.owner.avatar} subtitle={formatDate(thread.createdAt)} />
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: sanitizeHtml(thread.body) }} />
      <VoteButtons
        upCount={thread.upVotesBy.length}
        downCount={thread.downVotesBy.length}
        currentVote={threadVote}
        onUpVote={() => handleThreadVote(1)}
        onDownVote={() => handleThreadVote(-1)}
      />

      <section className={styles.commentsSection}>
        <h2>Komentar ({thread.comments.length})</h2>
        <form className={styles.form} onSubmit={handleSubmitComment}>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} required />
          <button type="submit">Kirim komentar</button>
        </form>
        <div className={styles.stack}>
          {thread.comments.map((comment) => {
            const currentVote = userId ? (comment.upVotesBy.includes(userId) ? 1 : comment.downVotesBy.includes(userId) ? -1 : 0) : 0;
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentVote={currentVote}
                onUpVote={() => handleCommentVote(comment, 1)}
                onDownVote={() => handleCommentVote(comment, -1)}
              />
            );
          })}
        </div>
      </section>
    </article>
  );
}

export default ThreadDetailPage;
