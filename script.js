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

const workSection = document.querySelector('.work-section');
const workTrack = document.querySelector('.work-track');
const workCards = workTrack ? [...workTrack.querySelectorAll('.work-card')] : [];
const backdropImages = workSection ? [...workSection.querySelectorAll('.backdrop-image')] : [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (workSection && workTrack && !reduceMotion.matches) {
  let scrollFrame = 0;
  let activeBackdrop = 0;
  let selectedCard = -1;
  const anglePerCard = 360 / workCards.length;

  const placeCards = () => {
    // Explicit 400px cylinder radius constraint
    const radius = 350; 
    workTrack.style.setProperty('--cylinder-radius', `${radius}px`);
    
    workCards.forEach((card, index) => {
      card.style.setProperty('--item-angle', `${index * anglePerCard}deg`);
      card.style.transform = `rotateX(${index * anglePerCard}deg) translateZ(${radius}px)`;
      
      // Enforce clean, smooth rounded corners across your components
      card.style.borderRadius = '16px'; 
      card.style.overflow = 'hidden'; 
    });
  };

  const moveWorkTrack = () => {
    scrollFrame = 0;
    const sectionTop = window.scrollY + workSection.getBoundingClientRect().top;
    const travel = Math.max(1, workSection.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / travel));
    
    const rotation = progress * anglePerCard * (workCards.length - 1);
    workTrack.style.setProperty('--scroll-rotation', `${rotation}deg`);
    
    const nextCard = (workCards.length - Math.round(rotation / anglePerCard)) % workCards.length;
    const facingPosition = workCards.length - rotation / anglePerCard;

    workCards.forEach((card, index) => {
      const offset = (index - facingPosition + workCards.length * 2) % workCards.length;
      const distance = Math.min(offset, workCards.length - offset);
      const image = card.querySelector('img');
      
      if (image) {
        // Enforce maximum 10px blur cap
        image.style.filter = `blur(${Math.min(10, distance * 5)}px)`;
      }
    });

    if (nextCard !== selectedCard && backdropImages.length === 2) {
      selectedCard = nextCard;
      const nextBackdrop = 1 - activeBackdrop;
      const targetSrc = workCards[nextCard]?.querySelector('img')?.getAttribute('src');
      if (targetSrc) {
        backdropImages[nextBackdrop].src = targetSrc;
        backdropImages[nextBackdrop].classList.add('is-active');
        backdropImages[activeBackdrop].classList.remove('is-active');
        activeBackdrop = nextBackdrop;
      }
    }
  };

  const requestTrackMove = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(moveWorkTrack);
  };

  placeCards();
  window.addEventListener('scroll', requestTrackMove, { passive: true });
  window.addEventListener('resize', () => { placeCards(); requestTrackMove(); });
  moveWorkTrack();
}


const revealTargets = document.querySelectorAll('main > section:not(.work-section), .work-heading, .work-marquee, .work-hint, .site-footer');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => {
    target.classList.add('scroll-reveal');
    revealObserver.observe(target);
  });
}
