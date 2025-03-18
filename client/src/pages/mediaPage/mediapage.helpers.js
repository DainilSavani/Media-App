import axios from 'axios';

// Constants
import { BASE_URL, PAGE_SIZE, FIRST_PAGE } from './mediaPage.constants';

export const fetchMediaFiles = ({ setMediaFiles, setIsLoading, selectedTab }) => async (pageSize = PAGE_SIZE, currentPage = FIRST_PAGE) => {
  try {
    setIsLoading(true);
    const payload = { mediaType: selectedTab };
    const response = await axios.post(`${BASE_URL}/api/media/all?page=${currentPage}&limit=${pageSize}`, payload);
    setMediaFiles(response.data);
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
} 
