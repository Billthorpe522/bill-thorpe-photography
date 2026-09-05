document.querySelectorAll('nav').forEach(nav => {
  const button = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.primary-links');
  if (!button || !links) return;
  nav.classList.add('js-nav');
  const close = () => { links.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); };
  button.addEventListener('click', () => { const open = links.classList.toggle('open'); button.setAttribute('aria-expanded', String(open)); });
  links.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  nav.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); button.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target)) close(); });
  matchMedia('(max-width:850px)').addEventListener('change', close);
});
