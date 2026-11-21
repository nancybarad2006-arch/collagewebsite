document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      contactForm.querySelector(".form-success").textContent =
        "Thanks for reaching out! This demo form is ready to connect to a college inbox.";
      contactForm.reset();
    });
  }

  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");
    let lastFocusedElement;

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        lastFocusedElement = item;
        lightboxImage.src = item.dataset.full;
        lightboxImage.alt = item.querySelector("img").alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  const adminPage = document.querySelector(".admin-page");
  if (adminPage) {
    const panels = document.querySelectorAll(".admin-panel");
    const navItems = document.querySelectorAll(".admin-nav-link[data-panel]");
    const breadcrumb = document.querySelector("#breadcrumb-current");
    const sidebar = document.querySelector(".admin-sidebar");
    const toast = document.querySelector(".admin-toast");
    let toastTimer;

    const showToast = (message) => {
      toast.textContent = message;
      toast.classList.add("show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
    };

    const openPanel = (panelName) => {
      const target = document.querySelector(`#panel-${panelName}`);
      if (!target) return;
      panels.forEach((panel) => panel.classList.toggle("active", panel === target));
      navItems.forEach((item) => item.classList.toggle("active", item.dataset.panel === panelName));
      if (breadcrumb) {
        const activeLink = Array.from(navItems).find((item) => item.dataset.panel === panelName);
        const label = activeLink && Array.from(activeLink.childNodes)
          .find((node) => node.nodeType === Node.TEXT_NODE);
        breadcrumb.textContent = label ? label.textContent.trim() : "Overview";
      }
      sidebar?.classList.remove("mobile-open");
    };

    navItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        openPanel(item.dataset.panel);
      });
    });
    document.querySelectorAll("[data-panel-link]").forEach((button) => {
      button.addEventListener("click", () => openPanel(button.dataset.panelLink));
    });

    document.querySelectorAll(".admin-add-button").forEach((button) => {
      button.addEventListener("click", () => showToast("Announcement editor is ready to connect to your content system."));
    });

    document.querySelectorAll(".table-search").forEach((input) => {
      input.addEventListener("input", () => {
        const table = input.closest(".admin-card").querySelector("tbody");
        const query = input.value.trim().toLowerCase();
        table.querySelectorAll("tr").forEach((row) => {
          row.hidden = !row.textContent.toLowerCase().includes(query);
        });
      });
    });

    const uploadInput = document.querySelector(".upload-button input");
    if (uploadInput) {
      uploadInput.addEventListener("change", () => {
        if (uploadInput.files.length) {
          showToast(`${uploadInput.files.length} photo${uploadInput.files.length === 1 ? "" : "s"} selected. Connect storage to publish them.`);
          uploadInput.value = "";
        }
      });
    }

    const mobileMenu = document.querySelector(".admin-mobile-menu");
    if (mobileMenu && sidebar) {
      mobileMenu.addEventListener("click", () => sidebar.classList.toggle("mobile-open"));
    }
  }
});
