import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../features/auth/authSlice';
import styles from '../styles/Page.module.css';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (payload) => {
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <motion.section
      className={styles.authPage}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthForm mode="register" onSubmit={handleSubmit} error={error} />
      <p>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </motion.section>
  );
}

export default RegisterPage;
