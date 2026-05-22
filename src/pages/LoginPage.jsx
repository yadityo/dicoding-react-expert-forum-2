import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../features/auth/authSlice';
import styles from '../styles/Page.module.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (payload) => {
    const result = await dispatch(loginUser(payload));
    if (loginUser.fulfilled.match(result)) {
      navigate(location.state?.from || '/');
    }
  };

  return (
    <motion.section
      className={styles.authPage}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthForm mode="login" onSubmit={handleSubmit} error={error} />
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </motion.section>
  );
}

export default LoginPage;
