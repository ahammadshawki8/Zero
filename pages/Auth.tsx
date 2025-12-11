import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button, Input, Select, Card } from '../components/ui';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform validation and API call here.
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="xl" showText={false} />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Zero Waste Management
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Smart cities start from zero.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 mx-auto w-full max-w-md">
        <Card className="py-6 sm:py-8 px-4 sm:px-10 shadow-xl border-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Select
                label="I am a..."
                options={[
                  { value: 'CITIZEN', label: 'Citizen' },
                  { value: 'CLEANER', label: 'Cleaner' },
                  { value: 'ADMIN', label: 'Administrator' },
                ]}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              />
            </div>

            <Input 
              label="Email address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input 
              label="Password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
