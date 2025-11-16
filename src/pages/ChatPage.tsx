import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const handleNewGroup = (newGroup: Chat) => {
    setGroups((groups) => [...groups, newGroup]);
  };

  const updateGroupMembers = (
    groupId: string,
    updateFn: (membersId: string[]) => string[],
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group._id === groupId
          ? { ...group, membersId: updateFn(group.membersId) }
          : group,
      ),
    );
    setSelectedChat((prevChat) =>
      prevChat?._id === groupId
        ? { ...prevChat, membersId: updateFn(prevChat.membersId) }
        : prevChat,
    );
  };

  const handleLeaveGroup = (groupId: string, userId: string) => {
    updateGroupMembers(groupId, (members) =>
      members.filter((id) => id !== userId),
    );
  };

  const handleJoinGroup = (groupId: string, userId: string) => {
    updateGroupMembers(groupId, (members) => [...members, userId]);
  };

  const handleNewUser = (newUser: User) => {
    setClients((clients) => [...clients, newUser]);
  };

  useEffect(() => {
    if (user._id === '') {
      navigate('/signin');
    }

    socket.emit('become_online', user._id);
    socket.on('new_group', handleNewGroup);
    socket.on('join_group', handleJoinGroup);
    socket.on('leave_group', handleLeaveGroup);
    socket.on('new_user', handleNewUser);

    (async () => {
      setClients(await getClients());
      setGroups(await getGroupChats());
      setSidebarIsLoading(false);
    })();

    return () => {
      socket.off('new_group', handleNewGroup);
      socket.off('join_group', handleJoinGroup);
      socket.off('leave_group', handleLeaveGroup);
      socket.off('new_user', handleNewUser);
    };
  }, []);

  function setNewRoom(newRoom: string) {
    if (room) {
      socket.emit('leave_room', room);
    }
    socket.emit('join_room', newRoom);
    setRoom(newRoom);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <Header />
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        <aside
          className="w-full sm:w-70 md:w-80 lg:w-1/4 bg-white border-r 
          border-gray-200 p-4 flex flex-col gap-4 overflow-y-auto"
        >
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
                setNewRoom={setNewRoom}
              />
              <OtherGroupChat groups={groups} setGroups={setGroups} />
            </>
          )}
        </aside>

        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          {selectedChat ? (
            <>
              <ChatHeader selectedChat={selectedChat} clients={clients} />
              <ChatMessage
                chatId={selectedChat._id}
                type={selectedChat.type}
                clients={clients}
              />
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
