import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './fetchImages';
import { renderGalleryItem } from './renderGalleryItem';

const refs = {
    input: document.querySelector('input'),
    btnSearch: document.querySelector('.search-form__btn-search'),
    btnLoadMore: document.querySelector('.search-form__btn-load'),
    gallery: document.querySelector('.gallery')
}

let lightbox = new SimpleLightbox('.gallery a',
    {
        overlayOpacity: 0.9,
        captionDelay: 250,
        captionPosition: 'bottom',
        captionData: 'alt',
        nav: true,
        widthRatio: 1,
        heightRatio: 1
    });
    
refs.btnSearch.addEventListener('click', onBtnClickImageSearch);

function onBtnClickImageSearch(event) {
    event.preventDefault();

    const searchQuery = refs.input.value.trim();

    if (searchQuery === "") return Notify.failure('The search field can not be empty! Try again!', {
        position: 'center-center',
        width: '340px',
    });

    fetchImages(searchQuery)
        .then(response => {
            console.log(response);
            const data = response.data;
            if (data.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
                    position: 'center-center',
                    width: '340px',
                });
            } else {
                let galleryListMarkup = '';
                data.hits.map(item => {
                    galleryListMarkup += renderGalleryItem(item);
                });
                refs.gallery.insertAdjacentHTML('afterbegin', galleryListMarkup);
                lightbox.refresh();
            }
        }).catch(error => Notify.failure('OOPS! Something went wrong! Try again!', {
            position: 'center-center',
            width: '340px',
        }));
}

