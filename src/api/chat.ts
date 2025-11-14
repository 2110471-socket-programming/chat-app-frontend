import type { Chat, ChatHistory } from '../interface/interface';
import Axios from './Axios';

export const getPrivateChatHistoryById = async (
  chatId: string,
): Promise<ChatHistory[]> => {
  const response = await Axios.get(`/api/chats/private/${chatId}`);
  return response.data.messages;
};

export const getGroupChatHistoryById = async (
  chatId: string,
): Promise<ChatHistory[]> => {
  const response = await Axios.get(`/api/chats/group/${chatId}`);
  return response.data.messages;
};

export const getGroupChats = async (): Promise<Chat[]> => {
  const response = await Axios.get(`/api/chats/group`);
  return response.data.group_chats;
};
