const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  mainNav.classList.remove('is-open');
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMenu();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const visitingCardDialog = document.querySelector('#visiting-card-dialog');
const showCardButton = document.querySelector('.card-show-trigger');
const closeCardButton = document.querySelector('.visiting-card-close');

if (visitingCardDialog && showCardButton && closeCardButton) {
  showCardButton.addEventListener('click', () => visitingCardDialog.showModal());
  closeCardButton.addEventListener('click', () => visitingCardDialog.close());
  visitingCardDialog.addEventListener('click', (event) => {
    if (event.target === visitingCardDialog) visitingCardDialog.close();
  });
}
