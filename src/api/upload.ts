import Axios from './Axios';

const ASSET_BASE = 'https://baan-saat.sgp1.digitaloceanspaces.com';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await Axios.post('/api/storage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return `${ASSET_BASE}/${response.data.fileKey}`;
};
