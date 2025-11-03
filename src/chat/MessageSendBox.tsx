import { useState } from 'react';

type MessageSendBoxType = {
  handleFileChange: any;
  sendNewMessage: (content: string) => void;
};

export default function MessageSendBox({
  handleFileChange,
  sendNewMessage,
}: MessageSendBoxType) {
  const [newMessage, setNewMessage] = useState<string>('');

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="upload"
      />
      <label
        htmlFor="upload"
        className="px-3 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
      >
        Upload
      </label>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border border-gray-200 p-2 rounded-md"
      />
      <button
        onClick={() => {
          sendNewMessage(newMessage);
          setNewMessage('');
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}
