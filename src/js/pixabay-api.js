import axios from 'axios';
import api from './api';

export const getImagesByQuery = async (query, page = 1) => {
  const { pixabay } = api;
  axios.defaults.baseURL = pixabay.BASE_URL;

  try {
    const response = await axios.get('/', {
      params: {
        key: pixabay.API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: pixabay.PER_PAGE,
      },
    });

    return {
      images: response.data?.hits || [],
      total: response.data?.totalHits || 0,
    };
  } catch (error) {
    return error;
  }
};
