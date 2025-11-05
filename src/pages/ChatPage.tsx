import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Header from "../component/Header";
const mockClients = [
  { id: 1, name: "Alice", profilePic: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Bob", profilePic: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Charlie", profilePic: "https://i.pravatar.cc/100?img=3" },
];

const mockGroups = [
  {
    id: 1,
    name: "Project Team",
    members: [1, 2],
    messages: [
      { sender: "Alice", text: "Hello team!", time: "10:00" },
      { sender: "Bob", text: "Hi Alice!", time: "10:01" },
    ],
  },
  {
    id: 2,
    name: "Friends",
    members: [1, 3],
    messages: [{ sender: "Charlie", text: "Hey everyone!", time: "10:05" }],
  },
];

export default function Chat() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [clients, setClients] = useState(mockClients);
  const [groups, setGroups] = useState(mockGroups);
  const [selectedRoom, setSelectedRoom] = useState<any>(mockGroups[0]);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string[]>([]);

  const handleSignOut = () => {
    setUser(null);
    navigate("/");
  };

  const handleSendMessage = () => {
    if (!message.trim() && preview.length === 0) return;

    const newMsg = {
      sender: user.name,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    if (selectedRoom?.type === "private") {
      const target = selectedRoom.target;
      const key = `chat_${user.name}_${target.name}`;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = [...stored, newMsg];
      localStorage.setItem(key, JSON.stringify(updated));
      setSelectedRoom({ ...selectedRoom, messages: updated });
    } else if (selectedRoom) {
      const updatedRooms = groups.map((room) =>
        room.id === selectedRoom.id
          ? { ...room, messages: [...room.messages, newMsg] }
          : room
      );
      setGroups(updatedRooms);
      setSelectedRoom(updatedRooms.find((r) => r.id === selectedRoom.id));
    }

    setMessage("");
    setPreview([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(filePreviews);
  };

  const handleJoinGroup = (group: any) => {
    const updatedGroups = groups.map((g) =>
      g.id === group.id && !g.members.includes(user.id)
        ? { ...g, members: [...g.members, user.id] }
        : g
    );
    setGroups(updatedGroups);
  };

  const handleLeaveGroup = (group: any) => {
    const updatedGroups = groups.map((g) =>
      g.id === group.id
        ? { ...g, members: g.members.filter((id) => id !== user.id) }
        : g
    );
    setGroups(updatedGroups);
    setSelectedRoom(null);
  };

  const getPrivateMessages = (target: any) => {
    const key = `chat_${user.name}_${target.name}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  };

  const currentMessages =
    selectedRoom?.type === "private"
      ? getPrivateMessages(selectedRoom.target)
      : selectedRoom?.messages || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header/>

      {/* MAIN */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-1/4 bg-white border-r p-4 flex flex-col gap-4">
          <div>
            <h2 className="font-semibold mb-2">Clients</h2>
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => setSelectedRoom({ type: "private", target: c })}
              >
                <img src={c.profilePic} alt="pfp" className="w-8 h-8 rounded-full" />
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

        {/* CHAT AREA */}
        <main className="flex-1 flex flex-col p-4">
          {selectedRoom ? (
            <>
              <div className="border-b pb-2 mb-2 flex justify-between">
                <h2 className="text-xl font-semibold">
                  {selectedRoom.type === "private"
                    ? `Chat with ${selectedRoom.target.name}`
                    : selectedRoom.name}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto mb-3 bg-white rounded-lg shadow-inner p-4 space-y-3">
                {currentMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === user.name ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-2 rounded-lg max-w-xs ${
                        msg.sender === user.name
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
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
                  📎
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
    </div>
  );
}
