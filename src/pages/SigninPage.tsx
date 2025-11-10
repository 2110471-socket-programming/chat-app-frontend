import { useEffect, useState } from 'react';
import { type UserRequest, signin } from '../api/user';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Signin() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user._id !== '') {
      window.location.href = '/';
    }
  }, []);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: (userData: UserRequest) => signin(userData),
    onSuccess: (data) => {
      alert(`Welcome back, ${data.name}!`);
      setUser({ _id: data._id, name: data.name, profileUrl: data.profileUrl }); // ✅ store in context
      navigate('/'); // redirect after signin
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || 'Signin failed';
      alert(`Signin failed: ${message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserRequest = { name, password, profileUrl: '' };
    console.log('signin payload:', userData);
    mutation.mutate(userData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {mutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signin;
