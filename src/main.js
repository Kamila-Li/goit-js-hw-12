import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPhotos } from './js/pixabay-api';
import { renderPhotoCards } from './js/render-functions';

const formEl = document.querySelector('.form-search');
const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page = 1;
let query = '';

loader.style.display = 'none';

const onFormSubmit = async event => {
  try {
    event.preventDefault();
    galleryContainer.innerHTML = '';
    loader.style.display = 'block';

    query = event.currentTarget.elements.user_query.value.trim();

    if (query === '') {
      iziToast.warning({
        title: 'Warning',
        position: 'topRight',
        message: 'Please enter a search query!',
      });
      return;
    }

    page = 1;
    loadMoreBtn.classList.add('is-hidden');

    const { data } = await fetchPhotos(query, page);

    loader.style.display = 'none';

    if (!data.hits.length) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    const markup = renderPhotoCards(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery-item', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    formEl.reset();

    if (data.totalHits > 1) {
      loadMoreBtn.classList.remove('is-hidden');

      loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
    }
  } catch (error) {
    loader.style.display = 'none';
  }
};

formEl.addEventListener('submit', onFormSubmit);

const onLoadMoreBtnClick = async event => {
  try {
    page++;

    const { data } = await fetchPhotos(query, page);

    const markup = renderPhotoCards(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);

    if (page * 15 >= data.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);

      smoothScroll();

      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Failed to load images. Please try again later.',
    });
  }
};

const smoothScroll = () => {
  const cardHeight =
    document.galleryContainer.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
