/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSlider */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#c9a96e",
  "typePairing": "editorial",
  "heroTreatment": "video",
  "heroSize": 100
}/*EDITMODE-END*/;

const TYPE_PAIRINGS = {
  editorial: {
    label: "Editorial",
    serif: '"Bodoni Moda", Georgia, serif',
    sans:  '"Inter", system-ui, sans-serif',
  },
  modern: {
    label: "Modern",
    serif: '"Playfair Display", Georgia, serif',
    sans:  '"Manrope", system-ui, sans-serif',
  },
  classic: {
    label: "Classic",
    serif: '"EB Garamond", Georgia, serif',
    sans:  '"Outfit", system-ui, sans-serif',
  },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // CSS változók frissítése
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-glow", hexToRgba(t.accent, 0.18));
    const pair = TYPE_PAIRINGS[t.typePairing] || TYPE_PAIRINGS.editorial;
    root.style.setProperty("--serif-display", pair.serif);
    root.style.setProperty("--sans-body", pair.sans);
    document.body.dataset.hero = t.heroTreatment;
  }, [t.accent, t.typePairing, t.heroTreatment]);

  // Arany kurzor glow
  React.useEffect(() => {
    const root = document.documentElement;
    let rafId = null;
    let tx = -9999, ty = -9999;
    let cx = -9999, cy = -9999;
    function onMove(e) { tx = e.clientX; ty = e.clientY; }
    function tick() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      root.style.setProperty("--cx", cx + "px");
      root.style.setProperty("--cy", cy + "px");
      rafId = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Preloader elrejtése: csak React mount után fut, megvárja a minimum 2,3s preloadert,
  // majd AZONNAL jelzi a hero-nak (preloader:done) — crossfade, nem szekvenciális.
  React.useEffect(function() {
    var elapsed = performance.now();
    var minDelay = Math.max(0, 1500 - elapsed);
    var hideTimer = setTimeout(function() {
      window.__preloaderDone = true;
      window.dispatchEvent(new CustomEvent("preloader:done"));
    }, minDelay);
    return function() { clearTimeout(hideTimer); };
  }, []);

  return (
    <>
      <div id="cursor-glow" aria-hidden="true"/>
      <window.Nav/>
      <window.Hero treatment={t.heroTreatment}/>
      <window.Services/>
      <window.Calculator/>
      <window.Timeline/>
      <window.Team/>
      <window.Contact/>
      <window.Footer/>

      <TweaksPanel>
        <TweakSection label="Brand"/>
        <TweakColor label="Accent" value={t.accent}
          onChange={(v) => setTweak("accent", v)}/>
        <TweakRadio label="Type" value={t.typePairing}
          options={["editorial","modern","classic"]}
          onChange={(v) => setTweak("typePairing", v)}/>
        <TweakSection label="Hero"/>
        <TweakRadio label="Treatment" value={t.heroTreatment}
          options={["video","still","minimal"]}
          onChange={(v) => setTweak("heroTreatment", v)}/>
      </TweaksPanel>
    </>
  );
}

function hexToRgba(hex, a) {
  const m = hex.replace("#","").match(/.{1,2}/g);
  if (!m || m.length < 3) return `rgba(201,169,110,${a})`;
  const [r,g,b] = m.map((h) => parseInt(h, 16));
  return `rgba(${r},${g},${b},${a})`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

// Scroll reveal — preloader:done után indul, így mindig React mount után fut
(function() {
  var parentCounters = new Map();

  function revealEl(el) {
    var p = el.parentElement;
    var idx = parentCounters.get(p) || 0;
    el.style.transitionDelay = (idx * 80) + "ms";
    parentCounters.set(p, idx + 1);
    el.classList.add("in");
  }

  function checkReveals() {
    var vh = window.innerHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach(function(el) {
      if (el.getBoundingClientRect().top < vh + 60) revealEl(el);
    });
  }

  function initReveal() {
    checkReveals();
    window.addEventListener("scroll", checkReveals, { passive: true });
    window.addEventListener("resize", checkReveals, { passive: true });
  }

  // Globálisan elérhetővé tesszük: dinamikusan mountolt .reveal elemekhez
  // (pl. kalkulátor tab-váltás) hívható kívülről is
  window.__revealCheck = checkReveals;

  if (window.__preloaderDone) {
    initReveal();
  } else {
    window.addEventListener("preloader:done", initReveal, { once: true });
  }
})();
