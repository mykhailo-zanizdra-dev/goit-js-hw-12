import { getImagesByQuery } from './pixabay-api.js';
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
} from './render-functions.js';
import api from './api.js';
import { getCurrentPage, scrollDown } from './helpers.js';
import refs from './refs.js';

const { pixabay } = api;
const { form, loadMoreButton } = refs;

export const onLoadImages = async e => {
  e.preventDefault();

  const isSearchButton = e.target.classList.contains('form');
  let totalItems = 0;

  if (isSearchButton) {
    clearGallery();
    loadMoreButton.dataset.page = 1;
    hideLoadMoreLoader();
    hideLoadMoreButton();
  }

  const queryString = form.elements['search-text'].value.trim();
  const currentPage = parseInt(loadMoreButton.dataset.page) || 1;
  const nextPage = isSearchButton ? currentPage : currentPage + 1;

  if (!queryString) {
    return;
  }

  if (isSearchButton) {
    showLoader();
    disableSearchButton();
  } else {
    showLoadMoreLoader();
    hideLoadMoreButton();
  }

  try {
    const { images, total } = await getImagesByQuery(queryString, nextPage);
    totalItems = total;

    if (!images.length) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }
    createGallery(images);
    showLoadMoreButton();
    if (!isSearchButton) {
      scrollDown();
    }

    loadMoreButton.dataset.page = nextPage;
  } catch (error) {
    showError(`Error fetching images: ${error.message}`);
  } finally {
    hideLoader();
    enableSearchButton();
    hideLoadMoreLoader();

    const currentPage = getCurrentPage();
    const isLastPage = currentPage >= Math.ceil(totalItems / pixabay.PER_PAGE);

    if (isLastPage) {
      hideLoadMoreButton();
      showInfo(`We're sorry, but you've reached the end of search results.`);
    }
  }
};
