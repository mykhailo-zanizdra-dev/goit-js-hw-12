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
import { scrollDown } from './js/helpers.js';

const { form, loadMoreButton } = refs;

let currentQueryString = '';

const onSubmitForm = async e => {
  e.preventDefault();

  const queryString = e.target.elements['search-text'].value.trim();

  if (!queryString) {
    showError('Please enter a search term.');
    return;
  }

  clearGallery();
  loadMoreButton.dataset.page = 1;
  hideLoadMoreLoader();
  hideLoadMoreButton();
  currentQueryString = queryString;
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
  const currentPage = parseInt(loadMoreButton.dataset.page) || 1;

  showLoadMoreLoader();
  hideLoadMoreButton();

  try {
    const { images, isLastPage } = await getImagesByQuery(
      currentQueryString,
      currentPage + 1
    );
    console.log('images', images);

    if (isLastPage) {
      hideLoadMoreButton();
      showInfo(`We're sorry, but you've reached the end of search results.`);
    } else {
      showLoadMoreButton();
      scrollDown();
      loadMoreButton.dataset.page = currentPage + 1;
    }
    createGallery(images);
  } catch (error) {
    showError(`Error fetching images: ${error.message}`);
  } finally {
    hideLoadMoreLoader();
  }
};

form.addEventListener('submit', onSubmitForm);
loadMoreButton.addEventListener('click', onLoadImages);
