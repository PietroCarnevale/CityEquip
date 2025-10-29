// modules/typeAhead.js
import axios from "axios";
import dompurify from "dompurify";

function searchResultsHTML(equipments = []) {
  return equipments
    .map(e => `
      <a class="search__result" href="/equipment/${e._id}">
        <strong>${e.name}</strong><br>
        <small>${e.type || ''}</small>
      </a>
    `)
    .join('');
}

export default function typeAhead(container) {
  console.log('typeAhead init, container:', container);
  if (!container) return;

  const input = container.querySelector('input[name="search"]');
  const results = container.querySelector('.search__results');

  if (!input) {
    console.warn('typeAhead: input[name="search"] not found inside container');
    return;
  }
  if (!results) {
    console.warn('typeAhead: .search__results not found inside container');
    return;
  }

  let debounceTimer = null;

  input.addEventListener('input', function () {
    const q = this.value.trim();
    console.log('typeAhead input:', q);

    // hide when empty
    if (!q) {
      results.style.display = 'none';
      results.innerHTML = '';
      return;
    }

    // show placeholder
    results.style.display = 'block';
    results.innerHTML = `<div class="search__result"><em>Searching…</em></div>`;

    // debounce to reduce requests
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // chiamata relativa alla route della web app che forwarda alla API
      axios.get(`/equipments/search`, { params: { q } })
        .then(res => {
          console.log('typeAhead: response', res && res.data);
          const list = (res.data && (res.data.equipments || res.data)) || [];
          if (!Array.isArray(list)) {
            console.warn('typeAhead: response format unexpected', res.data);
            results.innerHTML = `<div class="search__result"><strong>No results</strong></div>`;
            return;
          }
          if (list.length === 0) {
            results.innerHTML = `<div class="search__result"><strong>No results found</strong></div>`;
            return;
          }
          const html = searchResultsHTML(list);
          results.innerHTML = dompurify.sanitize(html);
        })
        .catch(err => {
          console.error('typeAhead axios error:', err);
          results.innerHTML = `<div class="search__result"><strong>Error fetching results</strong></div>`;
        });
    }, 250);
  });

  input.addEventListener('keydown', function (e) {
    if (![38, 40, 13].includes(e.keyCode)) return;
    const items = results.querySelectorAll('.search__result');
    if (!items.length) return;

    const current = results.querySelector('.search__result--active');
    let next;

    if (e.keyCode === 40) { // down
      next = current ? (current.nextElementSibling || items[0]) : items[0];
    } else if (e.keyCode === 38) { // up
      next = current ? (current.previousElementSibling || items[items.length - 1]) : items[items.length - 1];
    } else if (e.keyCode === 13) { // enter
      if (current && current.href) window.location = current.href;
      return;
    }

    if (current) current.classList.remove('search__result--active');
    if (next) next.classList.add('search__result--active');
  });
}
