import { joinGroup } from '../api/group';
import { useUser } from '../context/UserContext';
import type { Chat } from '../interface/interface';
import Members from "../component/members"
type MyGroupChatType = {
  groups: Chat[];
  setGroups: (groups: Chat[]) => void;
};

export default function OtherGroupChat({ groups }: MyGroupChatType) {
  const { user } = useUser();

  const otherGroupChats = groups.filter((g) => !g.membersId.includes(user._id));

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
          <div className="flex gap-2">
            <Members selectedGroup={g}/>
          <button
            onClick={async () => await joinGroup(g._id, user._id)}
            className="text-blue-500 text-sm cursor-pointer"
          >
            Join
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}
