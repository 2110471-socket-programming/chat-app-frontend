import { useUser } from '../context/UserContext';
import type { Chat } from '../interface/interface';

type MyGroupChatType = {
  groups: Chat[];
  setGroups: (groups: Chat[]) => void;
};

export default function OtherGroupChat({ groups, setGroups }: MyGroupChatType) {
  const { user } = useUser();

  const otherGroupChats = groups.filter((g) => !g.membersId.includes(user._id));

  const handleJoinGroup = (groupId: string) => {
    const updatedGroups = groups.map((group) =>
      group._id === groupId
        ? { ...group, membersId: [...group.membersId, user._id] }
        : group,
    );
    setGroups(updatedGroups);
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">
        Other Group Chat ({otherGroupChats.length})
      </h2>
      {otherGroupChats.map((g) => (
        <div
          key={g._id}
          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
        >
          <span>{g.name}</span>
          <button
            onClick={() => handleJoinGroup(g._id)}
            className="text-blue-500 text-sm cursor-pointer"
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );
}
