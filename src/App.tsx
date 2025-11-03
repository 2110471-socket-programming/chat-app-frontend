import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mockClients = [
  { id: 1, name: 'Alice', profilePic: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, name: 'Bob', profilePic: 'https://i.pravatar.cc/100?img=2' },
  { id: 3, name: 'Charlie', profilePic: 'https://i.pravatar.cc/100?img=3' },
];

const mockGroups = [
  {
    id: 1,
    name: 'Project Team',
    members: [1, 2],
    messages: [
      { sender: 'Alice', text: 'Hello team!', time: '10:00' },
      { sender: 'Bob', text: 'Hi Alice!', time: '10:01' },
    ],
  },
  {
    id: 2,
    name: 'Friends',
    members: [1, 3],
    messages: [{ sender: 'Charlie', text: 'Hey everyone!', time: '10:05' }],
  },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState(mockClients);
  const [groups, setGroups] = useState(mockGroups);
  const [selectedRoom, setSelectedRoom] = useState(mockGroups[0]); // Default to first group
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '');
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (!name) return;
    const profilePic = `https://i.pravatar.cc/100?u=${name}`;
    const newUser = { id: Date.now(), name, profilePic };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleSendMessage = () => {
    if (!message.trim() && preview.length === 0) return;

    const newMsg = {
      sender: user.name,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    if (selectedRoom.type === 'private') {
      // Handle private chat
      const target = selectedRoom.target;
      const key = `chat_${user.name}_${target.name}`;
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      const updated = [...stored, newMsg];
      localStorage.setItem(key, JSON.stringify(updated));
      setSelectedRoom({ ...selectedRoom, messages: updated });
    } else {
      // Handle group chat
      const updatedRooms = groups.map((room) =>
        room.id === selectedRoom.id
          ? { ...room, messages: [...room.messages, newMsg] }
          : room,
      );
      setGroups(updatedRooms);
      setSelectedRoom(updatedRooms.find((r) => r.id === selectedRoom.id));
    }

    setMessage('');
    setPreview([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(filePreviews);
  };

  const handleJoinGroup = (group) => {
    const updatedGroups = groups.map((g) =>
      g.id === group.id && !g.members.includes(user.id)
        ? { ...g, members: [...g.members, user.id] }
        : g,
    );
    setGroups(updatedGroups);
  };

  const handleLeaveGroup = (group) => {
    const updatedGroups = groups.map((g) =>
      g.id === group.id
        ? { ...g, members: g.members.filter((id) => id !== user.id) }
        : g,
    );
    setGroups(updatedGroups);
    setSelectedRoom(null);
  };

  const getPrivateMessages = (target) => {
    const key = `chat_${user.name}_${target.name}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <form
          onSubmit={handleSignIn}
          className="bg-white p-8 rounded-2xl shadow-md w-80 flex flex-col items-center gap-4"
        >
          <h1 className="text-2xl font-semibold text-gray-700">Sign In</h1>
          <input
            name="name"
            placeholder="Your name"
            className="p-2 w-full border rounded-md"
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    );

  const currentMessages =
    selectedRoom?.type === 'private'
      ? getPrivateMessages(selectedRoom.target)
      : selectedRoom?.messages || [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-full md:w-1/4 bg-white border-r p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic}
            alt="pfp"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{user.name}</span>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Clients</h2>
          {clients.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => setSelectedRoom({ type: 'private', target: c })}
            >
              <img
                src={c.profilePic}
                alt="pfp"
                className="w-8 h-8 rounded-full"
              />
              <span>{c.name}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">My Group Chat</h2>
          {groups
            .filter((g) => g.members.includes(user.id))
            .map((g) => (
              <div
                key={g.id}
                className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => setSelectedRoom(g)}
              >
                <span>{g.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveGroup(g);
                  }}
                  className="text-red-500 text-sm"
                >
                  Leave
                </button>
              </div>
            ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Other Group Chat</h2>
          {groups
            .filter((g) => !g.members.includes(user.id))
            .map((g) => (
              <div
                key={g.id}
                className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
              >
                <span>{g.name}</span>
                <button
                  onClick={() => handleJoinGroup(g)}
                  className="text-blue-500 text-sm"
                >
                  Join
                </button>
              </div>
            ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-4">
        {selectedRoom ? (
          <>
            <div className="border-b pb-2 mb-2">
              <h2 className="text-xl font-semibold">
                {selectedRoom.type === 'private'
                  ? `Chat with ${selectedRoom.target.name}`
                  : selectedRoom.name}
              </h2>
              {selectedRoom.members && (
                <p className="text-sm text-gray-600">
                  Members:{' '}
                  {selectedRoom.members
                    .map((id) => clients.find((c) => c.id === id)?.name)
                    .join(', ')}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-3 bg-white rounded-lg shadow-inner p-4 space-y-3">
              {currentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === user.name ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender === user.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70">{msg.sender}</p>
                  </motion.div>
                </div>
              ))}
            </div>

            {preview.length > 0 && (
              <div className="flex gap-2 mb-2">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="upload"
              />
              <label
                htmlFor="upload"
                className="px-3 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Upload
              </label>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border p-2 rounded-md"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat room to start messaging.
          </div>
        )}
      </main>
    </div>
  );
}
