import { useState } from "react";
import { type UserRequest, signup } from "../api/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Signup() {
    const { setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (userData: UserRequest) => signup(userData),
    onSuccess: (data) => {
      alert(`Welcome, ${data.name}! 🎉 Your account has been created.`);
      navigate("/profile"); // ✅ usually go to sign-in after signup
      setUser({ _id: data._id, name: data.name, profileUrl: data.profileUrl }); // ✅ store in context
    },
    onError: (error: any) => {
      // Axios errors often have response.data.message
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      alert(`Signup failed: ${message}`);
    },
  });
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserRequest = { name, password, profileUrl };
    console.log("signup payload:", userData);

    mutation.mutate(userData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

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

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="profileUrl"
          >
            Profile URL
          </label>
          <input
            id="profileUrl"
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your profile URL"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
