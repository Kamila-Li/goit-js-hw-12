import axios from 'axios';

const keyAPI = '48435213-edc98ac088ac3c077da86a508';

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
