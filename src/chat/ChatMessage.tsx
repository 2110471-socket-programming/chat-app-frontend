import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ChatHistory, User } from '../interface/interface';
import { useUser } from '../context/UserContext';
import {
  getGroupChatHistoryById,
  getPrivateChatHistoryById,
} from '../api/chat';
import MessageSendBox from './MessageSendBox';
import { socket } from '../config/config';
import { useRef } from 'react';
type ChatMessageType = {
  chatId: string;
  type: 'private' | 'group';
  clients: User[];
};

export default function ChatMessage({
  chatId,
  type,
  clients,
}: ChatMessageType) {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const { user } = useUser();
  useEffect(() => {
    if (typing) socket.emit('typing', chatId, user._id);
    else socket.emit('stopTyping', chatId, user._id);
    const interval = setInterval(() => {
      if (typing) socket.emit('typing', chatId, user._id);
      else socket.emit('stopTyping', chatId, user._id);
    }, 1000);
    return () => clearInterval(interval);
  }, [typing, chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [messages, typingUsers]);

  useEffect(() => {
    setIsLoading(true);
    setTypingUsers([]);
    (async () => {
      if (type === 'private') {
        setMessages(await getPrivateChatHistoryById(chatId));
      } else {
        setMessages(await getGroupChatHistoryById(chatId));
      }
      setIsLoading(false);
    })();
    return () => {
      socket.emit('stopTyping', chatId, user._id);
    };
  }, [chatId]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: ChatHistory) => {
      setMessages((messages) => [...messages, newMessage]);
    };
    const handleTyping = (fromChatId: string, userId: string) => {
      if (fromChatId === chatId) {
        setTypingUsers((prev) => {
          if (!prev.includes(userId)) return [...prev, userId];
          return prev;
        });
      }
    };
    const handleStopTyping = (fromChatId: string, userId: string) => {
      if (fromChatId === chatId) {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }
    };
    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
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
  const userMap = useMemo(
    () => Object.fromEntries(clients.map((u) => [u._id, u])),
    [clients],
  );
  return (
    <>
      <div className="flex-1 overflow-y-auto mb-3 bg-white rounded-lg shadow-inner p-4 space-y-3 h-screen ">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {messages.map((msg: ChatHistory, index) => {
              const profileUrl = userMap[msg.senderId].profileUrl;
              return (
                <div
                  key={index}
                  className={`flex  ${msg.senderName === user.name ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderName !== user.name && (
                    <img
                      src={
                        profileUrl ||
                        'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg'
                      }
                      alt="pfp"
                      className="w-8 h-8 rounded-full me-5 border-1 border-gray-300"
                    />
                  )}
                  {msg.senderName === user.name && (
                    <div className="self-end text-sm mx-2">
                      {new Date(msg.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
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
                  {msg.senderName !== user.name && (
                    <div className="self-end text-sm mx-2">
                      {new Date(msg.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        <div>
          {typingUsers.length > 0 &&
            typingUsers.map((user) => (
              <div className="flex gap-1 items-center">
                <img
                  src={
                    userMap[user].profileUrl ||
                    'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg'
                  }
                  alt="pfp"
                  className="w-4 h-4 rounded-full me-5 border-1 border-gray-300"
                />
                <p key={user}>{userMap[user].name} กำลังพิมพ์...</p>
              </div>
            ))}
        </div>
        <div ref={endRef}></div>
      </div>
      <MessageSendBox sendNewMessage={sendNewMessage} setTyping={setTyping} />
    </>
  );
}
