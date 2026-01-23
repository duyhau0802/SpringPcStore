import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAuth } from '../redux/actions/authActions';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Delay initialization slightly to ensure everything is loaded
    const timer = setTimeout(() => {
      dispatch(initAuth());
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
