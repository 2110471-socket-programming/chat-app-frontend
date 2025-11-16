import { useState } from 'react';
import { uploadImage } from '../api/upload';
type MessageSendBoxType = {
  sendNewMessage: (type: 'text' | 'image', content: string) => void;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function MessageSendBox({
  sendNewMessage,
  setTyping,
}: MessageSendBoxType) {
  const [newMessage, setNewMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  return (
    <>
      {file && (
        <div className="flex gap-2 mb-2">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="hidden"
          id="upload"
        />
        <label
          htmlFor="upload"
          className="px-3 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
        >
          Image
        </label>
        <input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            setTyping(e.target.value.length !== 0);
          }}
          placeholder="Type your message..."
          className="flex-1 border border-gray-200 p-2 rounded-md"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              if (newMessage) {
                setTyping(false);
                sendNewMessage('text', newMessage);
                setNewMessage('');
              }
              if (file) {
                setIsUploading(true);
                const fileUrl = await uploadImage(file);
                sendNewMessage('image', fileUrl);
                setIsUploading(false);
                setFile(null);
              }
            }
          }}
        />
        <button
          disabled={isUploading}
          onClick={async () => {
            if (newMessage) {
              setTyping(false);
              sendNewMessage('text', newMessage);
              setNewMessage('');
            }
            if (file) {
              setIsUploading(true);
              const fileUrl = await uploadImage(file);
              sendNewMessage('image', fileUrl);
              setIsUploading(false);
              setFile(null);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </>
  );
}
