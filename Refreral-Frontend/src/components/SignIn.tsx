import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInSignUp = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const navigate = useNavigate()
  
  // Sign In Form States
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({});
  const [signInTouched, setSignInTouched] = useState<Record<keyof SignInData, boolean>>({
    email: false,
    password: false
  });
  const [signInLoading, setSignInLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form States
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signUpErrors, setSignUpErrors] = useState<SignUpErrors>({});
  const [signUpTouched, setSignUpTouched] = useState<Record<keyof SignUpData, boolean>>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  // Handle form toggles
  const toggleForm = () => {
    setIsSignUpActive(!isSignUpActive);
    // Reset forms when switching
    setSignInData({ email: '', password: '' });
    setSignUpData({ username: '', email: '', password: '', confirmPassword: '' });
    setSignInErrors({});
    setSignUpErrors({});
    setSignInTouched({ email: false, password: false });
    setSignUpTouched({
      username: false,
      email: false,
      password: false,
      confirmPassword: false
    });
    setMessage('');
  };

  // Sign In handlers
  interface SignInData {
    email: string;
    password: string;
  }

  interface SignInErrors {
    email?: string;
    password?: string;
  }

  const handleSignInChange = (field: keyof SignInData, value: string) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
    if (signInTouched[field]) {
      let error = '';
      if (field === 'email') {
        error = validateEmail(value);
      } else if (field === 'password') {
        error = validatePassword(value);
      }
      setSignInErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSignInBlur = (field: keyof SignInData) => {
    setSignInTouched(prev => ({ ...prev, [field]: true }));
    let error: string = '';
    if (field === 'email') {
      error = validateEmail(signInData.email);
    } else if (field === 'password') {
      error = validatePassword(signInData.password);
    }
    setSignInErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const emailError: string = validateEmail(signInData.email);
    const passwordError: string = validatePassword(signInData.password);

    const newErrors: SignInErrors = {
      email: emailError,
      password: passwordError
    };

    setSignInErrors(newErrors);
    setSignInTouched({ email: true, password: true });

    if (emailError || passwordError) {
      setMessage('Please fix the validation errors');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSignInLoading(true);

    try {
      const response: Response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password,
          auth_type: 'Credentials',
        })
      });

      const res = await response.json();

      if (res.message) {
        setMessage(res.message);
        setTimeout(() => setMessage(''), 3000);
      }

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }

      if (response.ok) {
        setMessage('Login successful!');
        if (res.jwtToken) {
          localStorage.setItem('token', res.jwtToken);
        }
        
        setSignInData({ email: '', password: '' });
        setSignInErrors({});
        setSignInTouched({ email: false, password: false });
        
        setTimeout(() => {
            setMessage('Redirecting to dashboard...');
            navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: unknown) {
    const errorMessage =
    err instanceof Error ? err.message : 'Something went wrong.';
    setMessage(errorMessage);
}
 finally {
      setSignInLoading(false);
    }
  };

  // Sign Up handlers
  const handleSignUpChange = (field: keyof SignUpData, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    if (signUpTouched[field]) {
      let error = '';
      if (field === 'username') {
        error = validateUsername(value);
      } else if (field === 'email') {
        error = validateEmail(value);
      } else if (field === 'password') {
        error = validatePassword(value);
      } else if (field === 'confirmPassword') {
        error = validateConfirmPassword(signUpData.password, value);
      }
      setSignUpErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  interface SignUpData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface SignUpErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }

  const handleSignUpBlur = (field: keyof SignUpData) => {
    setSignUpTouched(prev => ({ ...prev, [field]: true }));
    let error: string = '';
    if (field === 'username') {
      error = validateUsername(signUpData.username);
    } else if (field === 'email') {
      error = validateEmail(signUpData.email);
    } else if (field === 'password') {
      error = validatePassword(signUpData.password);
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(signUpData.password, signUpData.confirmPassword);
    }
    setSignUpErrors(prev => ({ ...prev, [field]: error }));
  };

interface SignUpResponse {
  message?: string;
  jwtToken?: string;
  redirectUrl?: string;
  [key: string]: any;
}

const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();

  const usernameError: string = validateUsername(signUpData.username);
  const emailError: string = validateEmail(signUpData.email);
  const passwordError: string = validatePassword(signUpData.password);
  const confirmPasswordError: string = validateConfirmPassword(
    signUpData.password,
    signUpData.confirmPassword
  );

  const newErrors: SignUpErrors = {
    username: usernameError,
    email: emailError,
    password: passwordError,
    confirmPassword: confirmPasswordError
  };

  setSignUpErrors(newErrors);
  setSignUpTouched({
    username: true,
    email: true,
    password: true,
    confirmPassword: true
  });

  if (usernameError || emailError || passwordError || confirmPasswordError) {
    setMessage('Please fix the validation errors');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  setSignUpLoading(true);

  try {
    const response: Response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
        auth_type: 'Credentials',
      })
    });

    const res: SignUpResponse = await response.json();

    if (response.ok) {
      setMessage('Account created successfully!');
      setSignUpData({ username: '', email: '', password: '', confirmPassword: '' });
      setSignUpErrors({});
      setSignUpTouched({} as Record<keyof SignUpData, boolean>);

      // Redirect directly to SIGNIN
      setTimeout(() => navigate('/signin'), 1500);

    } else {
      throw new Error(res.message || 'Signup failed');
    }

  } catch (err: unknown) {
    const errorMessage =
    err instanceof Error ? err.message : 'Something went wrong.';
    setMessage(errorMessage);
  } finally {
    setSignUpLoading(false);
  }
};


  // Social Login Handler
  interface SocialLoginProvider {
    provider: 'Google' | 'GitHub';
  }

  const handleSocialLogin = (provider: SocialLoginProvider['provider']) => {
    const backendURL = 'http://localhost:3000/auth/signin';

    if (provider === 'Google') {
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=794186765503-qvhanhrou67qu77mg1q23gd51t35dnlk.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent';
    } else if (provider === 'GitHub') {
      window.location.href = `${backendURL}/github`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Message Display */}
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 text-white ${
          message.includes('error') || message.includes('wrong') || message.includes('validation') 
            ? 'bg-red-600' 
            : 'bg-green-600'
        }`}>
          {message}
        </div>
      )}
      
      <div className="relative w-full max-w-4xl h-[700px] bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Sign In Form - Left Side */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-12 transition-all duration-700 ease-in-out ${isSignUpActive ? '-translate-x-full opacity-0' : 'opacity-100 z-10'}`}>
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to continue your journey</p>
            
            <div className="space-y-4">
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
              
              <button 
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-800 rounded-lg py-3 px-4 text-white font-medium hover:bg-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </button>
            </div>
            
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={signInData.email}
                  onChange={(e) => handleSignInChange('email', e.target.value)}
                  onBlur={() => handleSignInBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                    signInTouched.email && signInErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {signInTouched.email && signInErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{signInErrors.email}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input 
                    type={showSignInPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    value={signInData.password}
                    onChange={(e) => handleSignInChange('password', e.target.value)}
                    onBlur={() => handleSignInBlur('password')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                      signInTouched.password && signInErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSignInPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {signInTouched.password && signInErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{signInErrors.password}</p>
                )}
              </div>
              
              <div className="mt-2 text-right">
                <button 
                  type="button"
                  onClick={() => setMessage('Password reset functionality would be implemented here')}
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={signInLoading}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {signInLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up Form - Right Side */}
        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 transition-all duration-700 ease-in-out ${isSignUpActive ? 'opacity-100 z-10' : 'translate-x-full opacity-0'}`}>
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-8">Join us and start your journey</p>
            
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={signUpData.username}
                  onChange={(e) => handleSignUpChange('username', e.target.value)}
                  onBlur={() => handleSignUpBlur('username')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                    signUpTouched.username && signUpErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {signUpTouched.username && signUpErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{signUpErrors.username}</p>
                )}
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={signUpData.email}
                  onChange={(e) => handleSignUpChange('email', e.target.value)}
                  onBlur={() => handleSignUpBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                    signUpTouched.email && signUpErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {signUpTouched.email && signUpErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{signUpErrors.email}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input 
                    type={showSignUpPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    value={signUpData.password}
                    onChange={(e) => handleSignUpChange('password', e.target.value)}
                    onBlur={() => handleSignUpBlur('password')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                      signUpTouched.password && signUpErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSignUpPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {signUpTouched.password && signUpErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{signUpErrors.password}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password" 
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                    onBlur={() => handleSignUpBlur('confirmPassword')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                      signUpTouched.confirmPassword && signUpErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {signUpTouched.confirmPassword && signUpErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{signUpErrors.confirmPassword}</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={signUpLoading}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {signUpLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Overlay Panel - Right Side with Orange Background */}
        <div className={`absolute top-0 right-0 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out ${isSignUpActive ? '-translate-x-full rounded-r-[100px]' : 'rounded-l-[100px]'}`}>
          <div className="relative h-full bg-gradient-to-r from-orange-400 to-orange-600 text-white flex flex-col items-center justify-center px-12">
            <div className="text-center">
              {!isSignUpActive ? (
                // Show when Sign In form is active (overlay on right)
                <>
                  <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                  <p className="mb-8">Enter your personal details and start your journey with us</p>
                  <button 
                    onClick={toggleForm}
                    className="border-2 border-white rounded-full px-8 py-3 font-semibold hover:bg-white hover:text-orange-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                // Show when Sign Up form is active (overlay on left)
                <>
                  <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                  <p className="mb-8">To keep connected with us please login with your personal info</p>
                  <button 
                    onClick={toggleForm}
                    className="border-2 border-white rounded-full px-8 py-3 font-semibold hover:bg-white hover:text-orange-600 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;