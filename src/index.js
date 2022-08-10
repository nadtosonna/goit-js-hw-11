import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { renderGalleryItem } from './renderGalleryItem';

const refs = {
    form: document.querySelector('.search-form'),
    btnSearch: document.querySelector('.search-form__btn-search'),
    btnLoadMore: document.querySelector('.search-form__btn-load'),
    gallery: document.querySelector('.gallery')
}

let lightbox = new SimpleLightbox('.gallery a',
    {
        overlayOpacity: 1,
        captionDelay: 250,
        nav: true,
        widthRatio: 1,
        heightRatio: 1
    });

const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29034983-efec06dd5286ef1d9795c8211';
let searchQuery = '';
let pageCount = 1;
  
async function fetchImages(searchQuery) {
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`);
    const data = await response;
    return data;
}

refs.form.addEventListener('submit', onImageSearch);
refs.btnLoadMore.addEventListener('click', onBtnClickLoadMoreImages);

function onImageSearch(event) {
    event.preventDefault();

    refs.gallery.innerHTML = '';

    searchQuery = event.target[0].value;

    if (searchQuery === "") return Notify.failure('The search field can not be empty! Try again!', {
        position: 'center-center',
        width: '340px',
    });

    processImages();

    refs.btnLoadMore.removeAttribute('disabled');
}

function onBtnClickLoadMoreImages(event) {
    event.preventDefault();

    pageCount += 1;
    processImages();    
    Scroll();
}

function processImages(data) {
    fetchImages(searchQuery)
        .then(data => {
            if (data.data.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
                    position: 'center-center',
                    width: '340px',
                });
            } else {
                Notify.success(`Hooray! We found ${data.data.total} images.`, {
                    width: '340px',
                });
                let galleryListMarkup = '';
                data.data.hits.map(item => {
                    galleryListMarkup += renderGalleryItem(item);
                });
                refs.gallery.insertAdjacentHTML('beforeend', galleryListMarkup);
                lightbox.refresh();
            }
        }).catch(error => Notify.failure('OOPS! Something went wrong! Try again!', {
            position: 'center-center',
            width: '340px',
        }));
}

function Scroll() {
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 5,
  behavior: "smooth",
});
}
