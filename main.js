document.getElementById('year').textContent = new Date().getFullYear();

const track = document.getElementById('project-track');
const cards = [...track.querySelectorAll('.project')];
const previous = document.getElementById('project-prev');
const next = document.getElementById('project-next');
const position = document.getElementById('project-position');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateCarousel() {
  const viewport = track.getBoundingClientRect();
  const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index }))
    .filter(({ rect }) => rect.left >= viewport.left - 5 && rect.right <= viewport.right + 5);
  if (visible.length) {
    const first = visible[0].index + 1;
    const last = visible[visible.length - 1].index + 1;
    position.textContent = `${first === last ? first : `${first}–${last}`} / ${cards.length}`;
  }
  previous.disabled = track.scrollLeft <= 5;
  next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 5;
}

function moveCarousel(direction) {
  const step = cards[1].offsetLeft - cards[0].offsetLeft;
  track.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

previous.addEventListener('click', () => moveCarousel(-1));
next.addEventListener('click', () => moveCarousel(1));
track.addEventListener('keydown', event => {
  if (event.target !== track) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveCarousel(event.key === 'ArrowLeft' ? -1 : 1);
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
});
track.addEventListener('scroll', updateCarousel, { passive: true });
new ResizeObserver(updateCarousel).observe(track);
document.querySelector('.carousel-controls').hidden = false;
updateCarousel();
