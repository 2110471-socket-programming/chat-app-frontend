import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signout } from '../api/user';
import { useUser } from '../context/UserContext';
import { LogOut, Home } from 'lucide-react';
import { socket } from '../config/config';

function Header() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const signoutMutation = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      setUser({ _id: '', name: '', profileUrl: '' });
      localStorage.removeItem('user');
      socket.emit('become_offline');
      navigate('/signin');
    },
    onError: (err) => {
      console.error('Sign out failed:', err);
      alert('Sign out failed, please try again.');
      navigate('/');
    },
  });

  const handleSignout = () => {
    signoutMutation.mutate();
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-blue-500 text-white shadow-md sticky top-0 z-50">
      {/* Logo / Home */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition"
        onClick={() => navigate('/')}
      >
        <Home className="w-6 h-6" />
        <h1 className="text-xl font-bold">Chat App</h1>
      </div>

      {/* Right-side buttons */}
      <div className="flex gap-4 items-center">
        <button
          onClick={handleSignout}
          disabled={signoutMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition disabled:opacity-70"
        >
          <LogOut className="w-5 h-5" />
          {signoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </header>
  );
}

export default Header;
