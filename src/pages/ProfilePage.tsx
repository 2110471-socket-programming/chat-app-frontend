import { useUser } from '../context/UserContext';
import Header from '../component/Header';
function Profile() {
  const { user } = useUser();

  return (
    <div>
      <Header />

      <div className="flex items-center justify-center min-h-[86vh] bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>

          {user?.profileUrl ? (
            <img
              src={user.profileUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}

          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span>{' '}
              {user?.name || 'No name'}
            </p>
            <p>
              <span className="font-semibold">User ID:</span>{' '}
              {user?._id || 'No ID'}
            </p>
          </div>

          <button
            className="mt-6 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
            onClick={() => alert('You clicked edit!')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
