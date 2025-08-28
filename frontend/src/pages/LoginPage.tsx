import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card, Alert } from '../components';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.error.default'));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-gold rounded-lg flex items-center justify-center">
              <span className="text-primary-black font-bold text-3xl">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('login.email')}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              icon={Mail}
              required
              fullWidth
            />

            <Input
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              icon={showPassword ? EyeOff : Eye}
              required
              fullWidth
              iconPosition="right"
              onIconClick={togglePasswordVisibility}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-gold focus:ring-primary-gold border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {t('login.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-gold hover:text-opacity-80 transition-colors"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              {t('login.signIn')}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {t('login.or')}
                </span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {/* Handle Google login */}}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => {/* Handle Microsoft login */}}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.5 2.75l-8.5 4.5v9.5c0 .55.45 1 1 1h7.5v-9.5l-8.5-4.5z"
                />
                <path
                  fill="currentColor"
                  d="M13.5 2.75l8.5 4.5v9.5c0 .55-.45 1-1 1h-7.5v-9.5l8.5-4.5z"
                />
              </svg>
              Microsoft
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('login.noAccount')}{' '}
              <Link
                to="/register"
                className="font-medium text-primary-gold hover:text-opacity-80 transition-colors"
              >
                {t('login.signUp')}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
