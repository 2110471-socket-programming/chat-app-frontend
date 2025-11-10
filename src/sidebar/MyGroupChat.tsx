import { leaveGroup } from '../api/group';
import { useUser } from '../context/UserContext';
import type { Chat } from '../interface/interface';

type MyGroupChatType = {
  groups: Chat[];
  setSelectedChat: (groupChat: Chat) => void;
  setGroups: (groups: Chat[]) => void;
};

export default function MyGroupChat({
  groups,
  setSelectedChat,
  setGroups,
}: MyGroupChatType) {
  const { user } = useUser();

  const myGroupChats = groups.filter((g) => g.membersId.includes(user._id));

  const handleLeaveGroup = async (groupId: string) => {
    const updatedGroups = groups.map((group) =>
      group._id === groupId
        ? {
            ...group,
            membersId: group.membersId.filter((id) => id !== user._id),
          }
        : group,
    );
    setGroups(updatedGroups);
    await leaveGroup(groupId, user._id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">My Group Chat ({myGroupChats.length})</h2>
        <button className="text-2xl cursor-pointer hover:text-gray-600">
          +
        </button>
      </div>
      {myGroupChats.map((g) => (
        <div
          key={g._id}
          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => setSelectedChat(g)}
        >
          <span>{g.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLeaveGroup(g._id);
            }}
            className="text-red-500 text-sm cursor-pointer"
          >
            Leave
          </button>
        </div>
      ))}
    </div>
  );
}
