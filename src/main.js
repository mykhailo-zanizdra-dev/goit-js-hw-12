import refs from './js/refs.js';
import { onLoadImages } from './js/handlers.js';

const { form, loadMoreButton } = refs;

form.addEventListener('submit', onLoadImages);
loadMoreButton.addEventListener('click', onLoadImages);
