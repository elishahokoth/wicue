
import { Link } from 'react-router-dom';
const NotFound = () => {
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-gray-900">
        Page not found
      </h2>
      <p className="mt-2 text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to="/" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Go back home
      </Link>
    </div>;
};
export default NotFound;