document.querySelectorAll('[data-lightbox]').forEach((item) => {
  item.addEventListener('click', () => {
    const box = document.querySelector('.lightbox');
    const image = box.querySelector('img');
    image.src = item.dataset.lightbox;
    image.alt = item.dataset.alt || '证书大图';
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
  });
});

const closeLightbox = () => {
  const box = document.querySelector('.lightbox');
  if (!box) return;
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
};

document.querySelector('.lightbox button')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox')?.addEventListener('click', (event) => {
  if (event.target.classList.contains('lightbox')) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
