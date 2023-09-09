import axios from 'axios';

const useNostrBuild = () => {

  const handleUpload = async (selectedFile: File | null) => {
    if (!selectedFile) return null;

    const dataToSend = new FormData();
    dataToSend.append('file', selectedFile);

    try {
      const response = await axios.post('https://nostr.build/api/v2/upload/files', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = response;

      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0].url;
      }

      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  return { handleUpload };
};

export default useNostrBuild;
