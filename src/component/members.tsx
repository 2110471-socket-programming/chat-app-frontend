import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import type { Chat, User } from '../interface/interface';
import { useState, useEffect } from 'react';
import { getClients } from '../api/user';
type MembersProps = {
  selectedGroup: Chat;
};
export default function Members({ selectedGroup }: MembersProps) {
  const [clients, setClients] = useState<User[] | null>([]);
  useEffect(() => {
    (async () => {
      setClients(await getClients());
    })();
  }, [clients]);
  const myClients = clients?.filter((c) =>
    selectedGroup.membersId.includes(c._id),
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-people-fill hover:fill-blue-500"
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedGroup.name} ({selectedGroup.membersId?.length}{' '}
              {selectedGroup.membersId?.length === 1 ? 'Member' : 'Members'})
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col overflow-y-auto min-h-[40vh] max-h-[60vh]">
            {myClients?.length ? (
              myClients?.map((c, index) => (
                <div key={index} className="flex my-3 mx-3">
                  <img
                    src={c.profileUrl}
                    alt="pfp"
                    className="w-8 h-8 rounded-full me-5 border-1 border-gray-300"
                  />
                  <div>{c.name}</div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-60">
                <div> No members found</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
