import { useState, useEffect } from 'react';
import type { Chat, User } from './interface/interface';
import { useUser } from './context/UserContext';
import ClientList from './sidebar/ClientList';
import MyGroupChat from './sidebar/MyGroupChat';
import OtherGroupChat from './sidebar/OtherGroupChat';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import { socket } from './config/config';
import { getClients } from './api/user';
import { getGroupChats } from './api/chat';

// const mockClients: User[] = [
//   { id: '1', name: 'Alice', profileUrl: 'https://i.pravatar.cc/100?img=1' },
//   { id: '2', name: 'Bob', profileUrl: 'https://i.pravatar.cc/100?img=2' },
//   { id: '3', name: 'Charlie', profileUrl: 'https://i.pravatar.cc/100?img=3' }
// ];

// const mockGroupChats: Chat[] = [
//   {
//     id: '1',
//     type: 'group',
//     name: 'Project Team',
//     membersId: ['1', '2'],
//   },
//   {
//     id: '2',
//     type: 'group',
//     name: 'Friends',
//     membersId: ['1', '3'],
//   }
// ];

export default function App() {
  const user = useUser();
  const [clients, setClients] = useState<User[]>([]);
  const [room, setRoom] = useState<string | null>(null);
  const [groups, setGroups] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [sidebarIsLoading, setSidebarIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setClients(await getClients());
      setGroups(await getGroupChats());
      setSidebarIsLoading(false);
    })();
  }, []);

  socket.emit('become_online', user._id);

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
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

      <main className="flex-1 flex flex-col p-4 overflow-y-auto">
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
  );
}
