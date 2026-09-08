/* ==========================================================
   1. MOBILE NAV TOGGLE
   Opens/closes the nav menu on small screens and keeps the
   button's aria-expanded state in sync for accessibility.
========================================================== */
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu once a link is picked, so it doesn't stay open
  // after the page scrolls to the new section.
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================
   2. STAT COUNT-UP ANIMATION
   Each .stat-number starts at 0 and counts up to its
   data-target once it scrolls into view. IntersectionObserver
   means this only fires when the visitor actually sees it,
   and only once.
========================================================== */
const statNumbers = document.querySelectorAll(".stat-number");

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1200; // ms
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out so the count-up settles rather than stopping abruptly
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && statNumbers.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((el) => observer.observe(el));
} else {
  // Fallback for older browsers: just show the final numbers.
  statNumbers.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    el.textContent = `${el.dataset.prefix || ""}${target.toFixed(decimals)}${el.dataset.suffix || ""}`;
  });
}

/* ==========================================================
   3. COMPARISON TABLE COLUMN FOCUS
   Hovering (or tapping, on touch devices) a city's column
   header dims the other column, making it easy to read one
   city's numbers straight down.
========================================================== */
const table = document.getElementById("compare-table");

if (table) {
  const cityHeaders = table.querySelectorAll("th[data-city]");

  function setFocus(city) {
    const allCells = table.querySelectorAll("[data-city]");
    allCells.forEach((cell) => {
      if (!city) {
        cell.classList.remove("is-dim", "is-focused");
        return;
      }
      const isMatch = cell.dataset.city === city;
      cell.classList.toggle("is-focused", isMatch);
      cell.classList.toggle("is-dim", !isMatch);
    });
  }

  cityHeaders.forEach((header) => {
    header.addEventListener("mouseenter", () => setFocus(header.dataset.city));
    header.addEventListener("mouseleave", () => setFocus(null));
    header.addEventListener("click", () => {
      // Tap toggles focus, so it works without a mouse.
      const alreadyFocused = header.classList.contains("is-focused");
      setFocus(alreadyFocused ? null : header.dataset.city);
    });
  });
}
