import axios from 'axios';

// Constants
import { BASE_URL } from './mediaPage.constants';

export const fetchMediaFiles = async (setMediaFiles, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${BASE_URL}/api/media/all`);
    setMediaFiles(response.data);
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
} 
