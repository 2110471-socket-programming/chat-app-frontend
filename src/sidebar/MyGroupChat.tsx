import { createGroup, leaveGroup } from '../api/group';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import type { Chat } from '../interface/interface';
import Members from '../component/members';

type MyGroupChatType = {
  groups: Chat[];
  setSelectedChat: (groupChat: Chat | null) => void;
  setNewRoom: (room: string) => void;
};

export default function MyGroupChat({
  groups,
  setSelectedChat,
  setNewRoom,
}: MyGroupChatType) {
  const [flag, setFlag] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();
  const myGroupChats = groups.filter((g) => g.membersId.includes(user._id));

  const handleAddGroup = () => {
    setFlag(!flag);
    setGroupName('');
    setError('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (groupName.trim() === '') {
      setError('Group name cannot be empty.');
      return;
    }

    if (groups.find((g) => g.name === groupName)) {
      setError('Group name already exists.');
      return;
    }

    try {
      const newGroup = await createGroup(user._id, groupName);
      setFlag(false);
      setGroupName('');
      setError('');
      setSelectedChat(newGroup);
      setNewRoom(newGroup._id);
    } catch {
      setError('Failed to create group. Try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">My Group Chat ({myGroupChats.length})</h2>
        <button
          className="text-2xl cursor-pointer hover:text-gray-600"
          onClick={handleAddGroup}
        >
          {!flag ? '+' : '×'}
        </button>
      </div>

      {flag && (
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2 mb-2"
        >
          <div className="flex flex-col w-full">
            <input
              type="text"
              name="groupName"
              value={groupName}
              placeholder="Enter group name"
              className={`flex-grow p-2 border rounded-md ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError('');
              }}
            />
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!!error || groupName.trim() === ''}
          >
            Submit
          </button>
        </form>
      )}

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
            <Members selectedGroup={g} />
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setSelectedChat(null);
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
