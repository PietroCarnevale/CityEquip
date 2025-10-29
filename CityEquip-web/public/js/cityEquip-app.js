import { content } from './modules/test';
import typeAhead from './modules/typeAhead';

document.addEventListener('DOMContentLoaded', () => {
  const searchContainer = document.querySelector('.form-inline.search') || document.querySelector('.form-inline');
  console.log('init typeAhead, found container:', searchContainer);
  typeAhead(searchContainer);
});