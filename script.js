document.addEventListener("DOMContentLoaded", () => {

  document.documentElement.classList.add("js");

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
  }, { capture: true });

  document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  }, { capture: true });

  document.addEventListener("selectstart", (event) => {
    event.preventDefault();
  }, { capture: true });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const modifierKey = event.ctrlKey || event.metaKey;
    const blockedCombos = ["i", "c", "j", "k", "u", "s", "p", "m", "x", "v"];
    const blockedKeys = ["f12", "printscreen"];

    if (blockedKeys.includes(key) || blockedKeys.includes(event.code?.toLowerCase())) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (modifierKey && event.shiftKey && blockedCombos.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (modifierKey && blockedCombos.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });

  const siteLoader = document.getElementById("siteLoader");
  const dismissLoader = () => {
    if (!siteLoader || siteLoader.classList.contains("is-leaving")) return;

    siteLoader.classList.add("is-leaving");
    siteLoader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => siteLoader.remove(), 500);
  };

  if (siteLoader) {
    if (document.readyState === "complete") {
      dismissLoader();
    } else {
      window.addEventListener("load", dismissLoader, { once: true });
      window.setTimeout(dismissLoader, 5000);
    }
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const workSection = document.querySelector("#work");
  const filterButtons = workSection ? workSection.querySelectorAll(".filter-btn") : [];
  const workProjects = workSection ? workSection.querySelectorAll(".project-card") : [];
  const designSection = document.querySelector("#design");

  const shouldShowProject = (project, filter, index) => {
    const category = project.dataset.category;

    if (filter === "all") {
      if (category === "design") {
        return index < 3;
      }
      return true;
    }

    if (filter === "video") return category === "video";
    if (filter === "design") return category === "design";

    return true;
  };

  if (workSection && filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        workProjects.forEach((project, index) => {
          project.classList.toggle("hidden", !shouldShowProject(project, filter, index));
        });

        if (designSection) {
          designSection.hidden = filter !== "design";

          if (filter === "design") {
            designSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }
      });
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealElements.length) {
    const observeReveal = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observeReveal.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("in-view"));
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const designThumbs = document.querySelectorAll('.project-card[data-category="design"] .design-thumb');

  if (designThumbs.length) {
    const designLightbox = document.createElement("div");
    designLightbox.className = "design-lightbox";
    designLightbox.setAttribute("aria-hidden", "true");
    designLightbox.innerHTML = `
      <div class="design-lightbox-inner">
        <button class="design-lightbox-close" type="button" aria-label="Close design preview">×</button>
        <img src="" alt="Large design preview" />
      </div>
    `;
    document.body.appendChild(designLightbox);

    const lightboxImage = designLightbox.querySelector("img");
    const closeDesignLightbox = () => {
      designLightbox.classList.remove("open");
      designLightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lightboxImage) lightboxImage.removeAttribute("src");
    };

    designThumbs.forEach((button) => {
      button.addEventListener("click", () => {
        const image = button.querySelector("img");
        if (!image || !lightboxImage) return;

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "Design preview";
        designLightbox.classList.add("open");
        designLightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      });
    });

    designLightbox.querySelector(".design-lightbox-close")?.addEventListener("click", closeDesignLightbox);
    designLightbox.addEventListener("click", (event) => {
      if (event.target === designLightbox) closeDesignLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && designLightbox.classList.contains("open")) {
        closeDesignLightbox();
      }
    });
  }

  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const modalClose = document.querySelector(".video-modal-close");
  const videoCards = document.querySelectorAll(".video-thumb");

  const closeVideoModal = () => {
    if (!videoModal || !modalVideo) return;

    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const openVideoModal = async (videoPath) => {
    if (!videoModal || !modalVideo || !videoPath) {
      return;
    }

    try {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.src = videoPath;
      modalVideo.load();

      videoModal.classList.add("open");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      await modalVideo.play().catch(() => {
        modalVideo.muted = true;
        modalVideo.play().catch(() => {});
      });
    } catch (error) {
      closeVideoModal();
    }
  };

  if (videoModal && modalVideo && modalClose) {
    videoCards.forEach((card) => {
      card.addEventListener("click", () => {
        const videoPath = card.dataset.video;
        if (!videoPath) return;
        openVideoModal(videoPath);
      });
    });

    modalClose.addEventListener("click", closeVideoModal);
    videoModal.addEventListener("click", (event) => {
      if (event.target === videoModal) closeVideoModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("open")) {
        closeVideoModal();
      }
    });

    modalVideo.addEventListener("error", () => {
      closeVideoModal();
    });
  }

  const tiltTargets = document.querySelectorAll(
    ".hero-art, .project-card, .review-card, .software-grid span, .filter-btn, .header-cta, .round-link, .contact-button"
  );

  tiltTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 16;
      const rotateX = (0.5 - y) * 16;

      target.style.setProperty("--rx", `${rotateX}deg`);
      target.style.setProperty("--ry", `${rotateY}deg`);
      target.style.setProperty("--tx", `${(x - 0.5) * 12}px`);
      target.style.setProperty("--ty", `${(y - 0.5) * 12}px`);
    });

    target.addEventListener("pointerleave", () => {
      target.style.setProperty("--rx", "0deg");
      target.style.setProperty("--ry", "0deg");
      target.style.setProperty("--tx", "0px");
      target.style.setProperty("--ty", "0px");
    });
  });

  console.log("HESH VISUALS JavaScript initialized successfully.");
});
