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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full bg-inner border border-border rounded-sm
                  px-4 py-3 text-text-primary placeholder-text-muted
                  focus:outline-none focus:border-accent-cyan focus:shadow-focus-cyan
                  transition-hover text-sm
                "
                aria-describedby={passError ? 'pass-error' : undefined}
              />
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
