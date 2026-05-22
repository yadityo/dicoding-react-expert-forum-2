import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../features/auth/authSlice';

export function useAuthRedirect() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const ensureAuth = () => {
    if (isAuthenticated) return true;
    navigate('/login', { state: { from: location.pathname } });
    return false;
  };

  return { ensureAuth, isAuthenticated };
}
