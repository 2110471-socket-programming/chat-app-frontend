export interface User {
  _id: string;
  name: string;
  profileUrl: string;
}

export interface ChatHistory {
  senderId: string;
  senderName: string;
  type: 'text' | 'image';
  content: string;
  date: Date;
}

export interface Chat {
  _id: string;
  type: 'private' | 'group';
  name: string | null;
  membersId: string[];
}
