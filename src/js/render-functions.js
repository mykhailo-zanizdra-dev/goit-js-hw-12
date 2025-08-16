import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconStop from '../img/ic_stop.svg';

const galleryList = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
let lightbox = new SimpleLightbox('.gallery a');

const createGalleryItem = ({
  webformatURL,
  largeImageURL,
  views,
  comments,
  downloads,
  likes,
  tags,
}) => {
  const alt = tags.substring(0, tags.indexOf(','));

  return `<li class="gallery-item">
            <a class="gallery-link" href=${largeImageURL}>
            <img
                class="gallery-image"
                src="${webformatURL}"
                alt="${alt}"
            />
            <div class="info-block">
                <p class="info-item">
                    <span>Likes</span> ${likes}
                </p>
                <p class="info-item">
                    <span>Views</span> ${views}
                </p>
                <p class="info-item">
                    <span>Comments</span> ${comments}
                </p>
                <p class="info-item">
                    <span>Downloads</span> ${downloads}
                </p>
            </div>
            </a>
        </li>`;
};

export const createGallery = images => {
  galleryList.innerHTML = images.map(createGalleryItem).join('');
  lightbox.refresh();
};

export const clearGallery = () => (galleryList.innerHTML = '');

export const showLoader = () => loader.classList.remove('visually-hidden');

export const hideLoader = () => loader.classList.add('visually-hidden');

export const showError = errorText =>
  iziToast.error({
    title: 'Error',
    message: errorText,
    position: 'topRight',
    timeout: 3000,
    close: true,
    color: '#EF4040',
    titleColor: '#FFFFFF',
    messageColor: '#FFFFFF',
    progressBarColor: '#B51B1B',
    iconUrl: iconStop,
    iconSize: '24px',
  });
