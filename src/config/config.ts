import io from 'socket.io-client';

export const serverUrl = import.meta.env.SERVER_URL || 'http://localhost:5000';

export const socket = io(serverUrl);
