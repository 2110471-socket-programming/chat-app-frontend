import { createGroup, leaveGroup } from '../api/group';
import { useUser } from '../context/UserContext';
import type { Chat } from '../interface/interface';
import Members from '../component/members';
type MyGroupChatType = {
  groups: Chat[];
  setSelectedChat: (groupChat: Chat) => void;
  setNewRoom: (room: string) => void;
};

export default function MyGroupChat({
  groups,
  setSelectedChat,
  setNewRoom,
}: MyGroupChatType) {
  const { user } = useUser();
  const myGroupChats = groups.filter((g) => g.membersId.includes(user._id));
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">My Group Chat ({myGroupChats.length})</h2>
        <button
          className="text-2xl cursor-pointer hover:text-gray-600"
          onClick={async () => await createGroup(user._id, 'test_name')}
        >
          +
        </button>
      </div>
      {myGroupChats.map((g) => (
        <div
          key={g._id}
          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          <span
            className="w-full"
            onClick={() => {
              setSelectedChat(g);
              setNewRoom(g._id);
            }}
          >
            {g.name}
          </span>
          <div className="flex gap-2">
            <Members selectedGroup={g}/>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await leaveGroup(g._id, user._id);
              }}
              className="text-red-500 text-sm cursor-pointer"
            >
              Leave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
