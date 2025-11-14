import { useEffect, useState } from 'react';
import type { Chat, User } from '../interface/interface';
import { useUser } from '../context/UserContext';
import { getOnlineClientsId } from '../api/user';
import { socket } from '../config/config';

type ClientListType = {
  clients: User[];
  setNewRoom: (room: string) => void;
  setSelectedChat: (privateChat: Chat) => void;
};

function privateChatId(a: string, b: string) {
  return a.localeCompare(b) <= 0 ? `${a}_${b}` : `${b}_${a}`;
}

export default function ClientList({
  clients,
  setNewRoom,
  setSelectedChat,
}: ClientListType) {
  const { user } = useUser();
  const [onlineClientsId, setOnlineClientsId] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setOnlineClientsId(await getOnlineClientsId());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    socket.on('online_clients', (clientsId: string[]) => {
      setOnlineClientsId(clientsId);
    });
  }, []);

  const onlineClients = clients.filter((c) => onlineClientsId.includes(c._id));
  const offlineClients = clients.filter(
    (c) => !onlineClientsId.includes(c._id),
  );

  const handleClientClick = (clientId: string) => {
    const newPrivateChatId = privateChatId(user._id, clientId);

    setSelectedChat({
      _id: newPrivateChatId,
      type: 'private',
      name: '',
      membersId: [user._id, clientId],
    });

    setNewRoom(newPrivateChatId);
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      <h2 className="font-semibold mb-2">
        Online ({onlineClients.length - 1})
      </h2>
      {onlineClients.map(
        (c) =>
          c._id !== user._id && (
            <div
              key={c._id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => handleClientClick(c._id)}
            >
              <img
                src={c.profileUrl}
                alt="pfp"
                className="w-8 h-8 rounded-full"
              />
              <span>{c.name}</span>
            </div>
          ),
      )}

      <br />

      <h2 className="font-semibold mb-2">Offline ({offlineClients.length})</h2>
      {offlineClients.map((c) => (
        <div
          key={c._id}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => handleClientClick(c._id)}
        >
          <img src={c.profileUrl} alt="pfp" className="w-8 h-8 rounded-full" />
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}
