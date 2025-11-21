import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from './components/Welcome.jsx';
import Signup from './components/SignUp.js';
import Signin from './components/SignIn.js';
import OAuthSuccess from './components/oauth-success.js';


import Dashboard from './components/dashboard.tsx';
import UseReferral from "./components/UseReferral";

import './index.css';

// 🔒 Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/use-referral"
          element={
            <ProtectedRoute>
              <UseReferral />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
