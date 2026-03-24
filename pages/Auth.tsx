import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';
import { Button, Input, Select, Card, Toast } from '../components/ui';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        await register({
          email,
          password,
          name,
          role,
          phone: phone || undefined,
        });
        setToast({ show: true, message: 'Account created successfully!', type: 'success' });
      } else {
        await login(email, password);
        setToast({ show: true, message: 'Login successful!', type: 'success' });
      }
    } catch (error: any) {
      setToast({ 
        show: true, 
        message: error.message || 'Authentication failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-4 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors safe-area">
        {/* Back Button - Mobile optimized */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors active:opacity-70"
          >
            <ArrowLeft size={16} className="flex-shrink-0" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-md px-0">
          <div className="flex justify-center mb-4 sm:mb-6 pt-8 sm:pt-0">
            <Logo size="xl" showText={false} />
          </div>
          <h2 className="mt-3 sm:mt-4 text-center text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white px-2">
            Zero Waste Management
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-2">
            Clean cities start from zero.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 mx-auto w-full max-w-md px-0">
          <Card className="py-6 sm:py-8 px-4 sm:px-8 shadow-lg border-0 mx-3 sm:mx-0 rounded-lg sm:rounded-xl">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'CITIZEN', label: 'Citizen' },
                    { value: 'CLEANER', label: 'Cleaner' },
                    { value: 'ADMIN', label: 'Admin' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value as UserRole)}
                      className={`py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all active:scale-95 touch-manipulation ${
                        role === option.value
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  Password
                </label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Phone Number <span className="text-slate-500 dark:text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-2.5 sm:py-3 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 text-white text-sm sm:text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRegistering ? 'Creating...' : 'Signing In...'}
                  </span>
                ) : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">Or</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 text-center">
                <button 
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    // Clear form when switching modes
                    setEmail('');
                    setPassword('');
                    setName('');
                    setPhone('');
                  }}
                  className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 active:opacity-70 transition-all touch-manipulation"
                  disabled={isLoading}
                >
                  {isRegistering ? (
                    <>
                      <span className="hidden sm:inline">Already have an account? </span>
                      <span className="sm:hidden">Have an account? </span>
                      <span className="underline">Sign in</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">New here? </span>
                      <span className="sm:hidden">No account? </span>
                      <span className="underline">Create one</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
