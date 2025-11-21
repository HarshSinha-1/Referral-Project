// src/components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('https://referral-project.onrender.com/api/user', {
          credentials: 'include',
        });

        setAuth(res.ok);
      } catch (err) {
        setAuth(false);
      }
    };

    verifyAuth();
  }, []);

  if (auth === null) return <p>Loading...</p>;

  return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
