/* =========================================================
   DIGITTECH — VANILLA JAVASCRIPT
   Mobile navigation, FAQ, portfolio modal, pricing context,
   smooth scrolling, WhatsApp tracking, reveal animations.
   ========================================================= */

(() => {
  "use strict";

  const WHATSAPP_URL =
    "https://wa.me/2349125274323?text=Hello%20DigitTech%2C%20I%27d%20like%20to%20discuss%20a%20website%20project.";

  const PACKAGE_MESSAGES = {
    starter: "Hello DigitTech, I'd like to discuss a website project. Great choice. Tell us what your landing page needs.",
    business: "Hello DigitTech, I'd like to discuss a website project. Let's map out the full business website you have in mind."
  };

  const PROJECTS = {
    realestate: {
      category: "Real Estate",
      title: "Modern Real Estate Landing Page",
      description: "Luxury property marketing with a high-converting hero, trust signals, and a strong WhatsApp lead flow for buyer inquiries.",
      focus: "Property enquiries",
      tone: "Confident / considered",
      outcome: "A sharper path from property browsing to buyer conversation.",
      accent: "lime"
    },
    fitness: {
      category: "Fitness",
      title: "Fitness Landing Page Designed to Convert",
      description: "High-energy membership pages built to showcase training plans, programme highlights, and WhatsApp booking.",
      focus: "Membership bookings",
      tone: "Energetic / direct",
      outcome: "A focused first step for people ready to book a session.",
      accent: "coral"
    },
    education: {
      category: "Education",
      title: "Bright Future Academy",
      description: "A world-class education landing page that inspires creativity, leadership, confidence, and academic excellence.",
      focus: "Admissions interest",
      tone: "Bright / reassuring",
      outcome: "A warm, credible welcome for prospective families.",
      accent: "lavender"
    },
    church: {
      category: "Church",
      title: "GraceLife Church",
      description: "A faith-focused landing page that welcomes new visitors to grow in relationship, worship, and community.",
      focus: "Visitor welcome",
      tone: "Open / grounded",
      outcome: "A clear online front door for first-time visitors.",
      accent: "gold"
    }
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation ---------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const navPanel = document.querySelector(".nav-panel");

  function closeMenu() {
    if (!menuToggle || !navPanel) return;
    menuToggle.classList.remove("is-open");
    navPanel.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
      const open = !navPanel.classList.contains("is-open");
      navPanel.classList.toggle("is-open", open);
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    navPanel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Smooth internal navigation ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const selector = link.getAttribute("href");
      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* ---------- FAQ accordion ---------- */

  const faqItems = [...document.querySelectorAll(".faq-item")];

  function setFaq(item, open) {
    const button = item.querySelector(".faq-question");
    item.classList.toggle("is-open", open);
    if (button) button.setAttribute("aria-expanded", String(open));
  }

  faqItems.forEach(item => {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("is-open");
      faqItems.forEach(other => setFaq(other, false));
      setFaq(item, shouldOpen);
    });
  });

  /* ---------- Portfolio modal ---------- */

  const modal = document.getElementById("portfolio-modal");
  const modalClose = document.querySelector(".modal-close");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalFocus = document.getElementById("modal-focus");
  const modalTone = document.getElementById("modal-tone");
  const modalOutcome = document.getElementById("modal-outcome");
  const modalAccent = document.getElementById("modal-accent");
  const modalWhatsapp = document.querySelector(".modal-whatsapp");

  let lastFocusedProject = null;

  function getFocusableElements(container) {
    return [...container.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null);
  }

  function openProject(projectKey, trigger) {
    const project = PROJECTS[projectKey];
    if (!project || !modal) return;

    lastFocusedProject = trigger || document.activeElement;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalFocus.textContent = project.focus;
    modalTone.textContent = project.tone;
    modalOutcome.textContent = project.outcome;
    modalAccent.style.background =
      project.accent === "coral" ? "var(--coral)" :
      project.accent === "lavender" ? "#cfc8df" :
      project.accent === "gold" ? "#e4c45e" :
      "var(--lime)";

    modalWhatsapp.href =
      WHATSAPP_URL + "&project=" + encodeURIComponent(project.title);

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeProject() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastFocusedProject && typeof lastFocusedProject.focus === "function") {
      lastFocusedProject.focus();
    }
  }

  document.querySelectorAll(".portfolio-card").forEach(card => {
    card.addEventListener("click", () => openProject(card.dataset.project, card));
  });

  modalClose?.addEventListener("click", closeProject);

  modal?.addEventListener("click", event => {
    if (event.target === modal) closeProject();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (modal && !modal.hidden) {
        closeProject();
      } else {
        closeMenu();
      }
    }

    if (event.key === "Tab" && modal && !modal.hidden) {
      const focusable = getFocusableElements(modal);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- Pricing -> contact context ---------- */

  const contactCardTitle = document.getElementById("contact-card-title");
  const contactWhatsapp = document.querySelector(".contact-whatsapp");

  document.querySelectorAll(".price-button").forEach(button => {
    button.addEventListener("click", () => {
      const packageName = button.dataset.package;
      const isStarter = packageName === "starter";

      if (contactCardTitle) {
        contactCardTitle.textContent = isStarter
          ? "Great choice. Tell us what your landing page needs."
          : "Let’s map out the full business website you have in mind.";
      }

      if (contactWhatsapp) {
        contactWhatsapp.href =
          "https://wa.me/2349125274323?text=" +
          encodeURIComponent(PACKAGE_MESSAGES[packageName] || "Hello DigitTech, I'd like to discuss a website project.");
      }

      const contact = document.getElementById("contact");
      if (contact) {
        contact.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  /* ---------- WhatsApp click tracking ---------- */

  document.querySelectorAll(".whatsapp-link").forEach(link => {
    link.addEventListener("click", () => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact");
      }
    });
  });

  /* ---------- Reveal animations ---------- */

  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach(item => revealObserver.observe(item));
  }
})();
