// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  if (!loading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPassError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPassError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPassError('Password must be at least 6 characters.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Welcome back!');
        navigate(result.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      } else {
        toast.error(result.error || 'Login failed. Check your credentials.');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Branding */}
        <div className="mb-10">
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase mb-2">
            IEEE CS SBC GECI
          </p>
          <h1 className="text-4xl font-bold text-text-primary leading-tight">
            Login Portal.
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} noValidate>

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-text-secondary font-mono text-sm tracking-wider uppercase mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="
                  w-full bg-inner border border-border rounded-sm
                  px-4 py-3 text-text-primary placeholder-text-muted
                  focus:outline-none focus:border-accent-cyan focus:shadow-focus-cyan
                  transition-hover text-sm
                "
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-text-secondary font-mono text-sm tracking-wider uppercase mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full bg-inner border border-border rounded-sm
                    px-4 py-3 pr-12 text-text-primary placeholder-text-muted
                    focus:outline-none focus:border-accent-cyan focus:shadow-focus-cyan
                    transition-hover text-sm
                  "
                  aria-describedby={passError ? 'pass-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none min-h-[48px] min-w-[32px] flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passError && (
                <p id="pass-error" className="mt-2 text-sm text-red-400" role="alert">
                  {passError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full bg-accent-cyan text-black font-bold py-3 rounded-sm
                hover:brightness-110 hover:scale-[1.02] hover:shadow-glow-cyan
                active:scale-[0.98] transition-hover
                disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[48px] text-sm tracking-wide
              "
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="text-text-muted font-mono text-xs text-center mt-6">
          Member accounts are created by the administrator.
        </p>
      </div>
    </div>
  );
}
