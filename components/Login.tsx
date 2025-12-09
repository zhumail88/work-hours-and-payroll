import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Mail, Lock, Loader2, Building, Briefcase } from 'lucide-react';
import { useToast } from './Toast';

interface LoginProps {
  onGoogleLogin: () => Promise<void>;
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, organization: string, position: string) => Promise<void>;
  // Removed old error props in favor of Toast
}

export const Login: React.FC<LoginProps> = ({ onGoogleLogin, onEmailLogin, onRegister }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      if (password !== confirmPassword) {
        showToast("Passwords do not match.", 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await onRegister(email, password, organization, position);
      } else {
        await onEmailLogin(email, password);
      }
    } catch (error) {
      // Error is already handled by the hook via Toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-300 my-8">
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
          <TrendingUp className="text-white" size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Track your hours, calculate your salary, and manage your work-life balance securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <>
              <div className="relative text-left">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company Name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="relative text-left">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Job Title"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            </>
          )}

          <div className="relative text-left">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="relative text-left">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="relative text-left">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={() => onGoogleLogin()}
          className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Google</span>
        </button>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); }}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          <span>Your data is private and secure</span>
        </div>
      </div>
    </div>
  );
};