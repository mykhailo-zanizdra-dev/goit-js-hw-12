import refs from './js/refs.js';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showError,
  showInfo,
  enableSearchButton,
  disableSearchButton,
  showLoadMoreLoader,
  showLoadMoreButton,
  hideLoadMoreLoader,
  hideLoadMoreButton,
} from './js/render-functions.js';

const { form, loadMoreButton, galleryList } = refs;

let currentQueryString = '';
let page = 1;

const scrollDown = () => {
  const { top, bottom } =
    galleryList.querySelector('li')?.getBoundingClientRect() || {};

  window.scrollBy({
    top: (bottom - top) * 2,
    behavior: 'smooth',
  });
};

const onSubmitForm = async e => {
  e.preventDefault();

  const queryString = e.target.elements['search-text'].value.trim();

  if (!queryString) {
    showError('Please enter a search term.');
    return;
  }

  page = 1;
  currentQueryString = queryString;
  clearGallery();
  hideLoadMoreLoader();
  hideLoadMoreButton();
  showLoader();
  disableSearchButton();

  try {
    const { images, isLastPage } = await getImagesByQuery(queryString, 1);

    if (!images.length) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    if (isLastPage) {
      showInfo(`We're sorry, but you've reached the end of search results.`);
    } else {
      showLoadMoreButton();
    }
    createGallery(images);
  } catch (error) {
    showError(`Error fetching images: ${error.message}`);
  } finally {
    hideLoader();
    enableSearchButton();
  }
};

const onLoadImages = async () => {
  showLoadMoreLoader();
  hideLoadMoreButton();

  try {
    const { images, isLastPage } = await getImagesByQuery(
      currentQueryString,
      page + 1
    );
    createGallery(images);
    scrollDown();

    if (isLastPage) {
      hideLoadMoreButton();
      showInfo(`We're sorry, but you've reached the end of search results.`);
    } else {
      page += 1;
      showLoadMoreButton();
    }
  } catch (error) {
    showError(`Error fetching images: ${error.message}`);
  } finally {
    hideLoadMoreLoader();
  }
};

form.addEventListener('submit', onSubmitForm);
loadMoreButton.addEventListener('click', onLoadImages);
