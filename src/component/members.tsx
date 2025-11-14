import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { Chat, User } from '../interface/interface';
import { useState, useEffect } from 'react';
import { getClients } from '../api/user';
import Draggable from 'react-draggable';
import React from 'react';
import Paper, { type PaperProps } from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type MembersProps = {
  selectedGroup: Chat;
};

function PaperComponent(props: PaperProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"], [class*="close-button"]'}
    >
      <Paper {...props} ref={nodeRef} className="min-w-[400px]" />
    </Draggable>
  );
}

export default function Members({ selectedGroup }: MembersProps) {
  const [clients, setClients] = useState<User[] | null>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setClients(await getClients());
    })();
  }, [clients]);

  const myClients = clients?.filter((c) =>
    selectedGroup.membersId.includes(c._id),
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size="medium"
        sx={{ padding: 1, minWidth: 0 }}
        className="hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleClickOpen();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-people-fill hover:fill-blue-500 "
          viewBox="0 0 16 16"
        >
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        </svg>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle className="flex justify-between items-center cursor-move">
          <div className="text-center">
            {selectedGroup.name} ({selectedGroup.membersId?.length}{' '}
            {selectedGroup.membersId?.length === 1 ? 'Member' : 'Members'})
          </div>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            className="close-button "
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="flex flex-col overflow-y-auto min-h-[40vh] max-h-[60vh]">
              {myClients?.length ? (
                myClients?.map((c, index) => (
                  <div key={index} className="flex my-3 mx-3">
                    <img
                      src={c.profileUrl}
                      alt="pfp"
                      className="w-8 h-8 rounded-full me-5 border-1 border-gray-300"
                    />
                    <div className="text-ellipsis overflow-hidden whitespace-nowrap mt-1">
                      {c.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-60">
                  <div> No members found</div>
                </div>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
