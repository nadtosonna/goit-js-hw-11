const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29034983-efec06dd5286ef1d9795c8211';
  
export async function fetchImages(searchQuery) {
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`);
    return response;
}
