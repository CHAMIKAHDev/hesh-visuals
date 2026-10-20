document.documentElement.classList.add('js');

// Basic deterrent for casual copying. This cannot secure files that the browser
// must download; keep passwords, API keys, and server-side logic off the site.
document.addEventListener('contextmenu', event => {
  event.preventDefault();
});

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  const hasModifier = event.ctrlKey || event.metaKey;
  const isDeveloperShortcut =
    event.key === 'F12' ||
    (hasModifier && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
    (event.metaKey && event.altKey && ['i', 'j', 'c', 'u'].includes(key));
  const isSourceOrSaveShortcut = hasModifier && ['u', 's'].includes(key);

  if (isDeveloperShortcut || isSourceOrSaveShortcut) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

const siteLoader = document.getElementById('siteLoader');

if (siteLoader) {
  let loaderDismissed = false;

  const dismissLoader = () => {
    if (loaderDismissed) return;
    loaderDismissed = true;
    siteLoader.classList.add('is-leaving');
    window.setTimeout(() => siteLoader.remove(), 600);
  };

  const loaderFallback = window.setTimeout(dismissLoader, 1200);
  window.addEventListener('load', () => {
    window.clearTimeout(loaderFallback);
    window.setTimeout(dismissLoader, 180);
  }, { once: true });
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const workSection = document.querySelector('#work');
const workGrid = workSection?.querySelector('.project-grid');
const filterButtons = workSection?.querySelectorAll('.filter-btn') ?? [];
const designSection = document.querySelector('#design');

if (filterButtons.length) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      if (workGrid) {
        workGrid.hidden = filter === 'design';
      }

      if (designSection) {
        designSection.hidden = filter === 'video';
      }

      if (filter === 'design' && designSection) {
        designSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('in-view'));
}

const tiltTargets = document.querySelectorAll(
  '.hero-art, .project-card, .review-card, .software-grid span, .filter-btn, .header-cta, .round-link, .contact-button'
);

tiltTargets.forEach(target => {
  target.addEventListener('pointermove', event => {
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    target.style.setProperty('--rx', `${(0.5 - y) * 16}deg`);
    target.style.setProperty('--ry', `${(x - 0.5) * 16}deg`);
    target.style.setProperty('--tx', `${(x - 0.5) * 12}px`);
    target.style.setProperty('--ty', `${(y - 0.5) * 12}px`);
  });

  target.addEventListener('pointerleave', () => {
    target.style.setProperty('--rx', '0deg');
    target.style.setProperty('--ry', '0deg');
    target.style.setProperty('--tx', '0px');
    target.style.setProperty('--ty', '0px');
  });
});

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const syncModalState = () => {
  const hasOpenModal = document.querySelector('.design-lightbox.open, .video-modal.open');
  document.body.classList.toggle('modal-open', Boolean(hasOpenModal));
};

const designThumbs = document.querySelectorAll('.project-card[data-category="design"] .design-thumb');

if (designThumbs.length) {
  const designLightbox = document.createElement('div');
  designLightbox.className = 'design-lightbox';
  designLightbox.setAttribute('aria-hidden', 'true');
  designLightbox.setAttribute('aria-modal', 'true');
  designLightbox.setAttribute('aria-label', 'Design preview');
  designLightbox.setAttribute('role', 'dialog');
  designLightbox.innerHTML = `
    <div class="design-lightbox-inner">
      <button class="design-lightbox-close" type="button" aria-label="Close design preview">×</button>
      <img src="" alt="" />
    </div>
  `;
  document.body.appendChild(designLightbox);

  const designImage = designLightbox.querySelector('img');
  const closeButton = designLightbox.querySelector('.design-lightbox-close');
  let designTrigger = null;

  const closeDesignLightbox = () => {
    designLightbox.classList.remove('open');
    designLightbox.setAttribute('aria-hidden', 'true');
    designImage.removeAttribute('src');
    syncModalState();
    designTrigger?.focus();
  };

  designThumbs.forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image) return;

      designTrigger = button;
      designImage.src = image.currentSrc || image.src;
      designImage.alt = image.alt || 'Design preview';
      designLightbox.classList.add('open');
      designLightbox.setAttribute('aria-hidden', 'false');
      syncModalState();
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closeDesignLightbox);
  designLightbox.addEventListener('click', event => {
    if (event.target === designLightbox) closeDesignLightbox();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && designLightbox.classList.contains('open')) {
      closeDesignLightbox();
    }
  });
}

const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.querySelector('.video-modal-close');

if (videoModal && modalVideo && modalClose) {
  let videoTrigger = null;

  const closeVideoModal = () => {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    syncModalState();
    videoTrigger?.focus();
  };

  document.querySelectorAll('.video-thumb').forEach(card => {
    card.addEventListener('click', () => {
      const source = card.dataset.video;
      if (!source) return;

      videoTrigger = card;
      modalVideo.src = source;
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      syncModalState();
      modalClose.focus();
      modalVideo.play().catch(() => {});
    });
  });

  modalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', event => {
    if (event.target === videoModal) closeVideoModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}
