import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to the Home Page
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        This is the main landing page of the application.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/signin')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Signin
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Go to Signup
        </button>
      </div>
    </div>
  );
}

export default HomePage;
