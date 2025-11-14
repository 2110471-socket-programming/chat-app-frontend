import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ChatHistory } from '../interface/interface';
import { useUser } from '../context/UserContext';
import {
  getGroupChatHistoryById,
  getPrivateChatHistoryById,
} from '../api/chat';
import MessageSendBox from './MessageSendBox';
import { socket } from '../config/config';

type ChatMessageType = {
  chatId: string;
  type: 'private' | 'group';
};

export default function ChatMessage({ chatId, type }: ChatMessageType) {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (type === 'private') {
        setMessages(await getPrivateChatHistoryById(chatId));
      } else {
        setMessages(await getGroupChatHistoryById(chatId));
      }
      setIsLoading(false);
    })();
  }, [chatId]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: ChatHistory) => {
      setMessages((messages) => [...messages, newMessage]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  function sendNewMessage(type: 'text' | 'image', content: string) {
    const newMessage: ChatHistory = {
      senderId: user._id,
      senderName: user.name,
      type: type,
      content: content,
      date: new Date(),
    };

    socket.emit('send_message', newMessage, chatId);

    setMessages((messages) => {
      return [...messages, newMessage];
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto mb-3 bg-white rounded-lg shadow-inner p-4 space-y-3 h-screen">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.senderName === user.name ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded-lg max-w-md break-words ${
                  msg.senderName === user.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                <p className="text-xs opacity-70">
                  {msg.senderId !== user._id && msg.senderName}
                </p>
                {msg.type === 'text' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <img
                    src={msg.content}
                    className="w-[150px] h-[112px] object-cover rounded-md"
                  />
                )}
              </motion.div>
            </div>
          ))
        )}
      </div>
      <MessageSendBox sendNewMessage={sendNewMessage} />
    </>
  );
}
