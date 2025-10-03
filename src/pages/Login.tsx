import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/Logo';
import { LockIcon, MailIcon, SunIcon, MoonIcon } from 'lucide-react';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'lecturer') {
        navigate('/lecturer');
      } else {
        navigate('/student');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
    setLoading(false);
  };
  return <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out" style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: theme === 'dark' ? 'soft-light' : 'overlay'
  }}>
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${theme === 'dark' ? 'bg-blue-950/70' : theme === 'jungle' ? 'bg-green-900/70' : theme === 'extra-dark' ? 'bg-gray-900/80' : 'bg-green-900/70'}`}></div>
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-emerald-700 text-emerald-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors z-10" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <Logo size="large" darkMode={theme === 'dark'} />
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-white/90 dark:bg-emerald-800/90 jungle:bg-green-800/90 p-6 rounded-lg shadow-xl transform transition-all duration-500" onSubmit={handleSubmit}>
          {error && <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
              <div className="text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            </div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-emerald-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md bg-white dark:bg-emerald-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-emerald-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md bg-white dark:bg-emerald-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-sm text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300 hover:underline">
                Register here
              </Link>
            </p>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Demo credentials:</p>
            <p>Admin: admin@wicue.com / admin123</p>
            <p>Lecturer: lecturer1@wicue.com / lecturer123</p>
            <p>Student: student1@wicue.com / student123</p>
          </div>
        </form>
      </div>
    </div>;
};
export default Login;