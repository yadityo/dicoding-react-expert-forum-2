import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilter from '../components/CategoryFilter';
import ThreadCard from '../components/ThreadCard';
import {
  fetchThreads,
  selectFilteredThreads,
  selectThreadCategories,
  setCategoryFilter,
} from '../features/threads/threadsSlice';
import styles from '../styles/Page.module.css';

function ThreadListPage() {
  const dispatch = useDispatch();
  const threads = useSelector(selectFilteredThreads);
  const categories = useSelector(selectThreadCategories);
  const categoryFilter = useSelector((state) => state.threads.categoryFilter);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  return (
    <section className={styles.page}>
      <div className={styles.pageHeading}>
        <h1>Diskusi terbaru</h1>
        <Link to="/new" className={styles.cta}>Buat Thread</Link>
      </div>
      <CategoryFilter
        categories={categories}
        selected={categoryFilter}
        onSelect={(value) => dispatch(setCategoryFilter(value))}
      />
      <div className={styles.stack}>
        <AnimatePresence mode="popLayout">
          {threads.map((thread) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ThreadCard thread={thread} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ThreadListPage;
