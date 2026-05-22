import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createThread,
  fetchThreads,
  selectThreadCategoriesForForm,
} from '../features/threads/threadsSlice';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import styles from '../styles/Page.module.css';

const CUSTOM_CATEGORY_VALUE = '__custom__';

export function resolveCategoryValue(selectedCategory, customCategory) {
  if (selectedCategory === CUSTOM_CATEGORY_VALUE) {
    const trimmedCustomCategory = customCategory.trim();
    return trimmedCustomCategory || undefined;
  }

  const trimmedSelectedCategory = selectedCategory.trim();
  return trimmedSelectedCategory || undefined;
}

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const threadStatus = useSelector((state) => state.threads.status);
  const categories = useSelector(selectThreadCategoriesForForm);
  const { ensureAuth } = useAuthRedirect();
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [body, setBody] = useState('');
  const hasCategories = categories.length > 0;

  const defaultSelectedCategory = useMemo(() => {
    if (!hasCategories) {
      return CUSTOM_CATEGORY_VALUE;
    }
    return categories[0];
  }, [categories, hasCategories]);

  useEffect(() => {
    if (threadStatus === 'idle') {
      dispatch(fetchThreads());
    }
  }, [dispatch, threadStatus]);

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory(defaultSelectedCategory);
    }
  }, [defaultSelectedCategory, selectedCategory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ensureAuth()) return;

    const category = resolveCategoryValue(selectedCategory, customCategory);
    const payload = category ? { title, body, category } : { title, body };
    const result = await dispatch(createThread({ payload, token }));
    if (createThread.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <section className={styles.page}>
      <h1>Tulis thread baru</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input placeholder="Judul" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <label htmlFor="categorySelect">
          Kategori
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
            <option value={CUSTOM_CATEGORY_VALUE}>Kategori baru...</option>
          </select>
        </label>
        {selectedCategory === CUSTOM_CATEGORY_VALUE ? (
          <input
            placeholder="Tulis kategori baru"
            value={customCategory}
            onChange={(event) => setCustomCategory(event.target.value)}
          />
        ) : null}
        <textarea rows={10} placeholder="Isi thread (mendukung HTML sederhana dari API)" value={body} onChange={(event) => setBody(event.target.value)} required />
        <button type="submit">Publikasikan</button>
      </form>
    </section>
  );
}

export default NewThreadPage;
