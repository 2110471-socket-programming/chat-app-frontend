import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Chat from './pages/ChatPage';
import Signin from './pages/SigninPage';
import Signup from './pages/SignupPage';
import Profile from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
