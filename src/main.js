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
        message: 'Sorry, no images found. Try again!',
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

    // Якщо зображень більше 15, показуємо кнопку
    if (data.hits.length === 15) {
      loadMoreBtn.classList.remove('is-hidden');
      loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = 'none';
  }
};

const onLoadMoreBtnClick = async () => {
  loader.style.display = 'block';
  page++;
  try {
    const { data } = await fetchPhotos(query, page);
    loader.style.display = 'none';

    const markup = renderPhotoCards(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();

    // Якщо нових зображень менше 15, ховаємо кнопку
    if (data.hits.length < 15) {
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);
    }

    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Failed to load images. Please try again later.',
    });
  }
};

const smoothScroll = () => {
  const cards = document.querySelectorAll('.photo-card');
  if (cards.length >= 2) {
    const cardHeight = cards[0].getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
};
