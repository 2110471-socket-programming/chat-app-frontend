import { useUser } from '../context/UserContext';
import type { Chat, User } from '../interface/interface';

type ChatHeaderType = {
  selectedChat: Chat;
  clients: User[];
};

function getFriendId(userId: string, chatId: string): string | null {
  if (!chatId) return null;

  const parts = chatId.split('_');
  if (parts.length !== 2) return null;

  const [a, b] = parts;

  if (a === userId && b !== userId) return b;
  if (b === userId && a !== userId) return a;
  return null;
}

export default function ChatHeader({ selectedChat, clients }: ChatHeaderType) {
  const user = useUser();

  return (
    <div className="border-b border-gray-200 pb-2 mb-2">
      <h2 className="text-xl font-semibold">
        {selectedChat.type === 'private'
          ? `Chat with ${
              clients.find(
                (c) => c._id === getFriendId(user._id, selectedChat._id),
              )?.name
            }`
          : selectedChat.name}
      </h2>
      {selectedChat.type === 'group' && (
        <p className="text-sm text-gray-600">
          Members:{' '}
          {selectedChat.membersId
            .map((id) => clients.find((c) => c._id === id)?.name)
            .join(', ')}
        </p>
      )}
    </div>
  );
}
