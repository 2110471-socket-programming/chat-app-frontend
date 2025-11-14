import { useState, useEffect } from 'react';
import { type UserRequest, signup } from '../api/user';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { uploadImage } from '../api/upload';
import userPlaceholder from '../assets/user.png';

function Signup() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  // Use imported image so bundler resolves the file path correctly
  const placeholder = userPlaceholder;

  useEffect(() => {
    if (user._id !== '') {
      window.location.href = '/';
    }
  }, []);

  const mutation = useMutation({
    mutationFn: (userData: UserRequest) => signup(userData),
    onSuccess: (data) => {
      alert(`Welcome, ${data.name}! 🎉 Your account has been created.`);
      const newUser = {
        _id: data._id,
        name: data.name,
        profileUrl: data.profileUrl,
      };
      setUser(newUser);
      navigate('/');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || 'Signup failed';
      alert(`Signup failed: ${message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const preview = URL.createObjectURL(file);
      setProfilePreview(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // default to the placeholder image when the user didn't upload a file
    let profileUrl = placeholder;
    if (profileFile) {
      try {
        profileUrl = await uploadImage(profileFile);
      } catch (error) {
        alert('Failed to upload profile picture');
        setIsUploading(false);
        return;
      }
    }

    const userData: UserRequest = { name, password, profileUrl };
    console.log('signup payload:', userData);

    mutation.mutate(userData);
    setIsUploading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <div className="mb-4 text-center">
          <label
            className="block text-gray-700 font-medium mb-3"
            htmlFor="profilePicture"
          >
            Profile Picture
          </label>
          <img
            src={profilePreview || placeholder}
            alt={profilePreview ? 'preview' : 'placeholder'}
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-blue-400"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== placeholder) target.src = placeholder;
            }}
          />
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="profilePicture"
            className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 cursor-pointer focus-within:ring-2 focus-within:ring-blue-400"
          >
            Choose File
          </label>
          {profileFile && (
            <p className="mt-2 text-sm text-gray-600">{profileFile.name}</p>
          )}
        </div>

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
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || isUploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70"
        >
          {mutation.isPending || isUploading
            ? 'Creating account...'
            : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
