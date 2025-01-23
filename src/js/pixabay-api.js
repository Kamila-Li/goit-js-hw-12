import axios from 'axios';

const keyAPI = '48188433-e0448b24de47b1903ec6a4bb7';

export const fetchPhotos = (query, currentPage) => {
  const axiosOptions = {
    params: {
      key: keyAPI,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 15,
      page: currentPage,
    },
  };

  return axios.get('https://pixabay.com/api/', axiosOptions);
};
