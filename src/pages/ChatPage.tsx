import { useState, useEffect } from 'react';
import type { Chat, User } from '../interface/interface';
import { useUser } from '../context/UserContext';
import ClientList from '../sidebar/ClientList';
import MyGroupChat from '../sidebar/MyGroupChat';
import OtherGroupChat from '../sidebar/OtherGroupChat';
import ChatHeader from '../chat/ChatHeader';
import ChatMessage from '../chat/ChatMessage';
import Header from '../component/Header';
import { socket } from '../config/config';
import { getClients } from '../api/user';
import { getGroupChats } from '../api/chat';

export default function App() {
  const { user } = useUser();
  const [clients, setClients] = useState<User[]>([]);
  const [room, setRoom] = useState<string | null>(null);
  const [groups, setGroups] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [sidebarIsLoading, setSidebarIsLoading] = useState<boolean>(true);

  useEffect(() => {
    socket.emit('become_online', user._id);
    (async () => {
      setClients(await getClients());
      setGroups(await getGroupChats());
      setSidebarIsLoading(false);
    })();
  }, []);

  socket.on('new_group', (newGroup: Chat) => {
    setGroups((groups) => {
      return [...groups, newGroup];
    });
  });

  function setNewRoom(newRoom: string) {
    if (room) {
      socket.emit('leave_room', room);
    }
    socket.emit('join_room', newRoom);
    setRoom(newRoom);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="flex flex-1">
        <aside className="w-full md:w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.profileUrl}
              alt="pfp"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{user.name}</span>
          </div>
          {sidebarIsLoading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <ClientList
                clients={clients}
                setNewRoom={setNewRoom}
                setSelectedChat={setSelectedChat}
              />
              <MyGroupChat
                groups={groups}
                setSelectedChat={setSelectedChat}
                setGroups={setGroups}
              />
              <OtherGroupChat groups={groups} setGroups={setGroups} />
            </>
          )}
        </aside>

        <main className="flex-1 flex flex-col p-4">
          {selectedChat ? (
            <>
              <ChatHeader selectedChat={selectedChat} clients={clients} />
              <ChatMessage chatId={selectedChat._id} />
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
