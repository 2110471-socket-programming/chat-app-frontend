import type { Chat } from '../interface/interface';
import Axios from './Axios';

export const createGroup = async (
  userId: string,
  groupName: string,
): Promise<Chat> => {
  const response = await Axios.post('/api/groups', {
    userId: userId,
    groupName: groupName,
  });
  return response.data;
};

export const joinGroup = async (
  groupId: string,
  userId: string,
): Promise<void> => {
  await Axios.put('/api/groups', {
    groupId: groupId,
    userId: userId,
  });
};

export const leaveGroup = async (
  groupId: string,
  userId: string,
): Promise<void> => {
  await Axios.delete('/api/groups', {
    data: {
      groupId: groupId,
      userId: userId,
    },
  });
};
