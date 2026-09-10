const cards = [...document.querySelectorAll('.photo-card')];
const dialog = document.querySelector('#viewer');
const image = document.querySelector('#viewer-image');
const caption = document.querySelector('#viewer-caption');
let current = 0;
let opener;
const visible = () => cards.filter(card => !card.hidden);
function show(index) {
  const items = visible();
  current = (index + items.length) % items.length;
  const card = items[current];
  image.src = card.href;
  image.alt = card.dataset.caption;
  caption.textContent = `${current + 1} / ${items.length} · ${card.dataset.caption}`;
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter; });
    document.querySelector('#gallery-count').textContent = `${visible().length} photographs`;
  });
});
cards.forEach(card => card.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || !dialog.showModal) return;
  event.preventDefault();
  opener = card;
  show(visible().indexOf(card));
  dialog.showModal();
}));
document.querySelector('#close-viewer').addEventListener('click', () => dialog.close());
document.querySelector('#previous-photo').addEventListener('click', () => show(current - 1));
document.querySelector('#next-photo').addEventListener('click', () => show(current + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
});
dialog.addEventListener('close', () => opener?.focus());
