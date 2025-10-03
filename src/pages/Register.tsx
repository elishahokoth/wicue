import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/Logo';
import { UserIcon, MailIcon, LockIcon, UserCheckIcon, SunIcon, MoonIcon, ChevronDownIcon } from 'lucide-react';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role
      });
      // Show pending message for both lecturers and students
      if (role === 'lecturer' || role === 'student') {
        setSuccess(`Your ${role} account request has been submitted. ${role === 'lecturer' ? 'An administrator' : 'A lecturer or administrator'} will review your request.`);
      } else {
        // This shouldn't happen with current UI, but keeping as a fallback
        navigate('/login');
      }
    } catch (error) {
      setError('Failed to create an account');
    }
    setLoading(false);
  };
  return <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out" style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: theme === 'dark' ? 'soft-light' : 'overlay'
  }}>
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${theme === 'dark' ? 'bg-blue-950/70' : theme === 'jungle' ? 'bg-green-900/70' : theme === 'extra-dark' ? 'bg-gray-900/80' : 'bg-blue-900/70'}`}></div>
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-emerald-700 text-emerald-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors z-10" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <Logo size="large" darkMode={true} />
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Create your account
          </h2>
        </div>
        {success ? <div className="rounded-md bg-emerald-50 dark:bg-emerald-800/90 p-4 shadow-xl transform transition-all duration-500 animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <UserCheckIcon className="h-5 w-5 text-emerald-400 dark:text-emerald-300" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Registration successful
                </h3>
                <div className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <p>{success}</p>
                </div>
                <div className="mt-4">
                  <Link to="/login" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          </div> : <form className="mt-8 space-y-6 bg-white/90 dark:bg-blue-900/90 p-6 rounded-lg shadow-xl transform transition-all duration-500" onSubmit={handleSubmit}>
            {error && <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="text-sm text-red-700 dark:text-red-200">
                  {error}
                </div>
              </div>}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </div>
                  <input id="name" name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-blue-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md bg-white dark:bg-blue-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </div>
                  <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-blue-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-blue-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
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
                  <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-blue-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-blue-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </div>
                  <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-blue-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-blue-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </div>
                  <select id="role" name="role" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md bg-white dark:bg-blue-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </div>
            <div className="text-sm text-center">
              <p className="text-gray-700 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
            {(role === 'lecturer' || role === 'student') && <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Note for {role === 'lecturer' ? 'Lecturers' : 'Students'}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        {role === 'lecturer' ? 'Lecturer accounts require administrator approval.' : 'Student accounts require approval from a lecturer or administrator.'}
                        After registration, your account will be in a pending
                        state until approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>}
          </form>}
      </div>
    </div>;
};
export default Register;