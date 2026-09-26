import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function DummyAuthModal() {
  const { authModal, closeAuthModal, loginUser, registerUser } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (authModal.isOpen && authModal.mode) {
      setMode(authModal.mode);
      setFormError('');
    }
  }, [authModal.isOpen, authModal.mode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (authModal.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModal.isOpen, closeAuthModal]);

  if (!authModal.isOpen) return null;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFormError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanName = name.trim();

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // 2. Password validation
    if (!cleanPassword || cleanPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      // Name validation
      if (!cleanName || cleanName.length < 2) {
        setFormError('Please enter your full name (minimum 2 characters).');
        return;
      }

      const res = registerUser({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword
      });

      if (!res.success) {
        setFormError(res.error);
        return;
      }

      closeAuthModal();
    } else {
      // Mode is 'login'
      const res = loginUser({
        email: cleanEmail,
        password: cleanPassword
      });

      if (!res.success) {
        setFormError(res.error);
        return;
      }

      closeAuthModal();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-elevated border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 text-white relative">
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 id="auth-modal-title" className="text-2xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Sign In to FreshFind' : 'Create an Account'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            {mode === 'login'
              ? 'Welcome back! Sign in to access your saved markets and recommendations.'
              : 'Sign up to discover and support local neighborhood farmers and markets.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Mode Switch Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{formError}</span>
                {formError.includes('create an account') && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="block mt-1 font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
                  >
                    Click here to Create Account →
                  </button>
                )}
                {formError.includes('already exists') && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="block mt-1 font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
                  >
                    Click here to Sign In →
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="e.g. Ali Khan"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-stone-400 mt-1">Must be at least 6 characters long.</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-soft transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Switch between Sign In / Create Account */}
            <div className="pt-3 border-t border-stone-100 text-center">
              {mode === 'signup' ? (
                <p className="text-xs text-stone-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-stone-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500">
            FreshFind is designed as a public discovery portal. All directory browsing and guides are fully accessible without an account!
          </p>
        </div>
      </div>
    </div>
  );
}
