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
let lightbox;

loader.style.display = 'none';

const onFormSubmit = async event => {
  event.preventDefault();
  galleryContainer.innerHTML = '';

  query = event.currentTarget.elements.user_query.value.trim();
  page = 1;
  loadMoreBtn.classList.add('is-hidden');
  loader.style.display = 'block';

  if (query === '') {
    iziToast.warning({
      title: 'Warning',
      position: 'topRight',
      message: 'Please enter a search query!',
    });
    loader.style.display = 'none';
    return;
  }

  try {
    const { data } = await fetchPhotos(query, page);

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

    lightbox = new SimpleLightbox('.gallery-item', {
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
    console.log(error);
  } finally {
    loader.style.display = 'none';
  }
};

formEl.addEventListener('submit', onFormSubmit);

const onLoadMoreBtnClick = async event => {
  loader.style.display = 'block';
  page++;
  try {
    const { data } = await fetchPhotos(query, page);
    loader.style.display = 'none';

    const markup = renderPhotoCards(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    smoothScroll();
    lightbox.refresh();

    if (page * 15 >= data.totalHits) {
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);
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
  const { height: cardHeight } =
    galleryContainer.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};