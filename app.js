const HOME_SLIDE = 2;
const TOTAL_SLIDES = 52;
const HIDDEN_CONTENT_SLIDES = new Set([5, 7, 12, 15, 20, 27, 32, 46, 49, 51]);

const slides = Array.from({ length: TOTAL_SLIDES }, (_, index) => ({
  number: index + 1,
  image: `assets/slides/slide-${String(index + 1).padStart(2, "0")}.png`,
}));

const sectionSequences = [
  [1, HOME_SLIDE],
  [3, 4],
  [6],
  [8, 9, 10, 11],
  [13, 14],
  [16, 17, 18, 19],
  [21, 22, 23, 24, 25, 26],
  [28, 29, 30, 31],
  [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  [47, 48],
  [50, 52],
];

const homeZone = {
  kind: "home",
  label: "Ana sayfaya dön",
  target: HOME_SLIDE,
  x: 0.82,
  y: 91.92,
  w: 4.55,
  h: 6.92,
};

const contentsHotspots = [
  {
    label: "Tarih Dersinde Değişen Yöntemler",
    target: 3,
    x: 14.26,
    y: 28.63,
    w: 34.78,
    h: 12.55,
  },
  {
    label: "Türkiye Yüzyılı Maarif Modeli Tarih Dersi Öğretim Programının Özgün Yanı",
    target: 6,
    x: 14.26,
    y: 44.18,
    w: 34.78,
    h: 10.98,
  },
  {
    label: "Tarih Alan Becerileri",
    target: 8,
    x: 14.26,
    y: 58.17,
    w: 34.78,
    h: 10.98,
  },
  {
    label: "Kavram Değişiklikleri",
    target: 13,
    x: 14.26,
    y: 72.27,
    w: 34.78,
    h: 10.98,
  },
  {
    kind: "integrated-button",
    label: "2018 Tarih Kitabı Örnekleri",
    target: 28,
    x: 14.26,
    y: 86.78,
    w: 34.78,
    h: 10.87,
  },
  {
    label: "Ders Kitaplarında Ne Değişti?",
    target: 16,
    x: 50.96,
    y: 28.63,
    w: 34.78,
    h: 12.81,
  },
  {
    label: "İçerik Olarak Ne Değişti?",
    target: 21,
    x: 50.96,
    y: 44.3,
    w: 34.78,
    h: 10.87,
  },
  {
    label: "Tarih Ders Kitaplarında Süreklilik",
    target: 47,
    x: 52.04,
    y: 58.02,
    w: 33.69,
    h: 11.13,
  },
  {
    label: "2026-2027 Eğitim Öğretim Yılında Tarih Alanındaki Değişiklikler",
    target: 50,
    x: 50.96,
    y: 72.27,
    w: 34.78,
    h: 10.98,
  },
  {
    kind: "integrated-button",
    label: "TYMM 2024 Tarih Kitabı Örnekleri",
    target: 33,
    x: 51.33,
    y: 86.78,
    w: 36.62,
    h: 10.35,
  },
];

const hotspotsBySlide = {
  1: [
    {
      label: "Sunuma başla",
      target: HOME_SLIDE,
      x: 0,
      y: 0,
      w: 100,
      h: 100,
    },
  ],
  [HOME_SLIDE]: contentsHotspots.map((hotspot) => ({
    kind: hotspot.kind || "toc",
    ...hotspot,
  })),
  33: [
    {
      kind: "topic",
      label: "Düşünelim",
      target: 36,
      x: 7.54,
      y: 42.63,
      w: 15.21,
      h: 24.19,
    },
    {
      kind: "topic",
      label: "Keşfedelim",
      target: 34,
      x: 24.01,
      y: 42.63,
      w: 14.43,
      h: 24.19,
    },
    {
      kind: "topic",
      label: "Öğrenelim",
      target: 37,
      x: 39.99,
      y: 41.45,
      w: 18.51,
      h: 25.38,
    },
    {
      kind: "topic",
      label: "Uygulayalım",
      target: 38,
      x: 60.05,
      y: 42.63,
      w: 14.62,
      h: 24.19,
    },
    {
      kind: "topic",
      label: "Değerlendirelim",
      target: 39,
      x: 77.01,
      y: 42.63,
      w: 15.43,
      h: 24.19,
    },
  ],
};

const slideImage = document.querySelector("#slideImage");
const hotspotsRoot = document.querySelector("#hotspots");
const stage = document.querySelector("#stage");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const homeBtn = document.querySelector("#homeBtn");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const slideCounter = document.querySelector("#slideCounter");
const flipLayer = document.querySelector("#flipLayer");
const flipBack = document.querySelector("#flipBack");
const flipFront = document.querySelector("#flipFront");
const flipPage = document.querySelector("#flipPage");

let currentSlide = getInitialSlide();
let pointerStart = null;
let isFlipping = false;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getInitialSlide() {
  const match = window.location.hash.match(/slide-(\d+)/);
  if (!match) return 1;

  return normalizeSlide(Number(match[1]));
}

function getSlideHash(slideNumber) {
  return `#slide-${String(slideNumber).padStart(2, "0")}`;
}

function normalizeSlide(slideNumber) {
  const normalized = clamp(slideNumber, 1, TOTAL_SLIDES);
  return HIDDEN_CONTENT_SLIDES.has(normalized) ? HOME_SLIDE : normalized;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSectionSequence(slideNumber) {
  return sectionSequences.find((sequence) => sequence.includes(slideNumber));
}

function getStepTarget(slideNumber, direction) {
  const sequence = getSectionSequence(slideNumber);
  if (!sequence) return null;

  const index = sequence.indexOf(slideNumber);
  const nextSlide = sequence[index + direction];
  return nextSlide || null;
}

function canStepFrom(slideNumber, direction) {
  return getStepTarget(slideNumber, direction) !== null;
}

function stepSlide(direction) {
  const target = getStepTarget(currentSlide, direction);
  if (!target) return;
  goToSlide(target);
}

function goToSlide(slideNumber, options = {}) {
  const nextSlide = normalizeSlide(slideNumber);
  if (isFlipping || (nextSlide === currentSlide && slideImage.src)) return;

  const previousSlide = currentSlide;
  const shouldFlip =
    options.flip !== false &&
    slideImage.getAttribute("src") &&
    Math.abs(nextSlide - previousSlide) === 1 &&
    !prefersReducedMotion.matches;

  if (shouldFlip) {
    flipToSlide(previousSlide, nextSlide);
    return;
  }

  currentSlide = nextSlide;
  render();
}

function render(options = {}) {
  const slide = slides[currentSlide - 1];
  if (options.basicTransition !== false) {
    stage.classList.remove("is-transitioning");
    void stage.offsetWidth;
    stage.classList.add("is-transitioning");
  } else {
    stage.classList.remove("is-transitioning");
  }

  slideImage.src = slide.image;
  slideImage.alt = `Slayt ${slide.number}`;
  slideCounter.textContent = `${slide.number} / ${TOTAL_SLIDES}`;
  prevBtn.disabled = !canStepFrom(slide.number, -1);
  nextBtn.disabled = !canStepFrom(slide.number, 1);
  homeBtn.disabled = slide.number === HOME_SLIDE;
  history.replaceState(null, "", getSlideHash(slide.number));
  renderHotspots(slide.number);
  preload(getStepTarget(slide.number, 1));
  preload(getStepTarget(slide.number, -1));
}

function flipToSlide(previousSlide, nextSlide) {
  isFlipping = true;
  const direction = nextSlide > previousSlide ? "next" : "prev";

  flipFront.src = slides[previousSlide - 1].image;
  flipBack.src = slides[nextSlide - 1].image;
  flipLayer.className = `flip-layer is-active flip-${direction}`;

  currentSlide = nextSlide;
  render({ basicTransition: false });

  const finish = () => {
    flipLayer.className = "flip-layer";
    flipFront.removeAttribute("src");
    flipBack.removeAttribute("src");
    isFlipping = false;
  };

  flipPage.addEventListener("animationend", finish, { once: true });
  window.setTimeout(() => {
    if (isFlipping) finish();
  }, 900);
}

function renderHotspots(slideNumber) {
  hotspotsRoot.replaceChildren();

  const slideHotspots = [...(hotspotsBySlide[slideNumber] || [])];
  if (slideNumber !== 1 && slideNumber !== HOME_SLIDE) {
    slideHotspots.push(homeZone);
  }

  for (const hotspot of slideHotspots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = getHotspotClassName(hotspot);
    button.setAttribute("aria-label", hotspot.label);
    button.title = hotspot.label;
    button.style.left = `${hotspot.x}%`;
    button.style.top = `${hotspot.y}%`;
    button.style.width = `${hotspot.w}%`;
    button.style.height = `${hotspot.h}%`;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      goToSlide(hotspot.target, { flip: false });
    });
    hotspotsRoot.append(button);
  }
}

function getHotspotClassName(hotspot) {
  const classes = ["hotspot"];
  if (hotspot.kind === "home") classes.push("home-zone");
  if (hotspot.kind === "toc") classes.push("toc-zone");
  if (hotspot.kind === "topic") classes.push("topic-zone");
  if (hotspot.kind === "integrated-button") classes.push("integrated-button");
  return classes.join(" ");
}

function preload(slideNumber) {
  if (!slideNumber || slideNumber < 1 || slideNumber > TOTAL_SLIDES) return;

  const image = new Image();
  image.src = slides[slideNumber - 1].image;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

prevBtn.addEventListener("click", () => stepSlide(-1));
nextBtn.addEventListener("click", () => stepSlide(1));
homeBtn.addEventListener("click", () => goToSlide(HOME_SLIDE, { flip: false }));
fullscreenBtn.addEventListener("click", toggleFullscreen);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    stepSlide(1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    stepSlide(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(HOME_SLIDE, { flip: false });
  }
  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFullscreen();
  }
});

stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".hotspot")) return;

  pointerStart = {
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
  };
  stage.setPointerCapture?.(event.pointerId);
});

stage.addEventListener("pointerup", (event) => {
  if (!pointerStart || event.target.closest(".hotspot")) {
    pointerStart = null;
    return;
  }

  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  const elapsed = Date.now() - pointerStart.time;
  const stageRect = stage.getBoundingClientRect();
  pointerStart = null;

  if (Math.abs(deltaY) > Math.abs(deltaX) * 1.25) return;

  if (Math.abs(deltaX) >= 46) {
    stepSlide(deltaX < 0 ? 1 : -1);
    return;
  }

  if (elapsed < 420) {
    const clickedRightHalf = event.clientX > stageRect.left + stageRect.width / 2;
    stepSlide(clickedRightHalf ? 1 : -1);
  }
});

stage.addEventListener("pointercancel", () => {
  pointerStart = null;
});

window.addEventListener("hashchange", () => {
  const nextSlide = getInitialSlide();
  if (nextSlide !== currentSlide) {
    goToSlide(nextSlide, { flip: false });
    return;
  }

  if (window.location.hash !== getSlideHash(currentSlide)) {
    history.replaceState(null, "", getSlideHash(currentSlide));
  }
});

render();
