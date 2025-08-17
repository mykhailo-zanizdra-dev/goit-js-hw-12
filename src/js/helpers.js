import refs from './refs.js';

const { galleryList, loadMoreButton } = refs;

export const getCurrentPage = () => parseInt(loadMoreButton.dataset.page) || 1;

export const scrollDown = () => {
  const image = galleryList.querySelector('li');
  const { top, bottom } = image.getBoundingClientRect();

  window.scrollBy({
    top: (bottom - top) * 2,
    behavior: 'smooth',
  });
};
