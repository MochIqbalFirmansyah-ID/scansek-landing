import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-2xl md:text-3xl font-heading font-semibold text-gray-900 mt-4 mb-6">
        Page not found
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;