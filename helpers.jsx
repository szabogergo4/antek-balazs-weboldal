/* global React */

// Hungarian-locale number formatter
const fmtFt = (n) =>
  new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtPct = (n, d = 1) =>
  new Intl.NumberFormat("hu-HU", { maximumFractionDigits: d }).format(n);

window.fmtFt = fmtFt;
window.fmtPct = fmtPct;

// IntersectionObserver-based scroll reveal hook with stagger
// Uses performance.now() to calculate delay relative to page load,
// so it always fires after the preloader (2300ms hide + 700ms fade = 3000ms),
// regardless of how fast or slow React mounts.
function useReveal() {
  React.useEffect(() => {
    const PRELOADER_DONE_AT = 3100; // ms from page load
    const elapsed = performance.now();
    const delay = Math.max(50, PRELOADER_DONE_AT - elapsed);

    const setup = () => {
      const els = document.querySelectorAll(".reveal:not(.in)");
      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in"));
        return;
      }
      // Stagger siblings within the same container
      const parentMap = new Map();
      els.forEach((el) => {
        const key = el.parentElement;
        if (!parentMap.has(key)) parentMap.set(key, []);
        parentMap.get(key).push(el);
      });
      parentMap.forEach((siblings) => {
        siblings.forEach((el, i) => {
          el.style.transitionDelay = (i * 100) + "ms";
        });
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
      );
      els.forEach((el) => io.observe(el));
    };

    const timer = setTimeout(setup, delay);
    return () => clearTimeout(timer);
  }, []);
}
window.useReveal = useReveal;

// Inline icon — minimal, just for contact section + form arrow
function Icon({ name, size = 20, stroke = 1.5 }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="0"/>
          <path d="m22 6-10 7L2 6"/>
        </svg>
      );
    case "map-pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      );
    case "check":
      return (
        <svg {...common}><path d="M20 6 9 17l-5-5"/></svg>
      );
    case "arrow-right":
      return (
        <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      );
    case "arrow-left":
      return (
        <svg {...common}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      );
    default: return null;
  }
}
window.Icon = Icon;
