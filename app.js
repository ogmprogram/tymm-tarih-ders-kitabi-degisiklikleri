const HOME_SLIDE = 2;
const TOTAL_SLIDES = 36;

const slides = Array.from({ length: TOTAL_SLIDES }, (_, index) => ({
  number: index + 1,
  image: `assets/slides/slide-${String(index + 1).padStart(2, "0")}.png`,
}));

const commonHomeZone = {
  kind: "home",
  label: "İçindekilere dön",
  target: HOME_SLIDE,
  x: 1.25,
  y: 92.5,
  w: 3.25,
  h: 5.75,
};

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
  2: [
    {
      label: "Türkiye Yüzyılı Maarif Modeli'nde tarih anlatımı değişiyor mu?",
      target: 3,
      x: 6.2,
      y: 31.2,
      w: 38.7,
      h: 16.3,
    },
    {
      label: "Tarih Dersi Öğretim Programının en güçlü ve özgün yanı",
      target: 5,
      x: 6.2,
      y: 49.2,
      w: 38.7,
      h: 16.2,
    },
    {
      label: "Tarih dersinde yapılan kavram değişiklikleri",
      target: 6,
      x: 6.2,
      y: 67.1,
      w: 38.7,
      h: 16.6,
    },
    {
      label: "Tarih ders kitaplarında ne değişti?",
      target: 8,
      x: 52.7,
      y: 31.3,
      w: 41.5,
      h: 10.1,
    },
    {
      label: "İçerik açısından ne değişti?",
      target: 8,
      x: 52.1,
      y: 43.2,
      w: 20.7,
      h: 28.4,
    },
    {
      label: "Teknik açıdan ne değişti?",
      target: 12,
      x: 74.6,
      y: 43.2,
      w: 19.8,
      h: 28.4,
    },
    {
      label: "2018 programına göre yazılan tarih kitaplarından örnekler",
      target: 18,
      x: 4.2,
      y: 84.7,
      w: 45.8,
      h: 7.9,
    },
    {
      label: "2026-2027 eğitim öğretim yılında uygulanacak değişiklikler",
      target: 35,
      x: 52.5,
      y: 77.0,
      w: 36.8,
      h: 12.4,
    },
  ],
  22: [
    {
      label: "Düşünelim",
      target: 25,
      x: 25.0,
      y: 45.0,
      w: 8.9,
      h: 8.1,
    },
    {
      label: "Keşfedelim",
      target: 23,
      x: 36.2,
      y: 45.0,
      w: 8.9,
      h: 8.1,
    },
    {
      label: "Öğrenelim",
      target: 26,
      x: 47.5,
      y: 45.0,
      w: 8.9,
      h: 8.1,
    },
    {
      label: "Uygulayalım",
      target: 27,
      x: 58.8,
      y: 45.0,
      w: 8.9,
      h: 8.1,
    },
    {
      label: "Değerlendirelim",
      target: 28,
      x: 70.0,
      y: 45.0,
      w: 10.0,
      h: 8.1,
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

  return clamp(Number(match[1]), 1, TOTAL_SLIDES);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function goToSlide(slideNumber, options = {}) {
  const nextSlide = clamp(slideNumber, 1, TOTAL_SLIDES);
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
  prevBtn.disabled = slide.number === 1;
  nextBtn.disabled = slide.number === TOTAL_SLIDES;
  history.replaceState(null, "", `#slide-${String(slide.number).padStart(2, "0")}`);
  renderHotspots(slide.number);
  preload(slide.number + 1);
  preload(slide.number - 1);
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
  if (slideNumber >= 2 && slideNumber <= 35) {
    slideHotspots.push(commonHomeZone);
  }

  for (const hotspot of slideHotspots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hotspot ${hotspot.kind === "home" ? "home-zone" : ""}`;
    button.setAttribute("aria-label", hotspot.label);
    button.title = hotspot.label;
    button.style.left = `${hotspot.x}%`;
    button.style.top = `${hotspot.y}%`;
    button.style.width = `${hotspot.w}%`;
    button.style.height = `${hotspot.h}%`;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      goToSlide(hotspot.target);
    });
    hotspotsRoot.append(button);
  }
}

function preload(slideNumber) {
  if (slideNumber < 1 || slideNumber > TOTAL_SLIDES) return;

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

prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));
homeBtn.addEventListener("click", () => goToSlide(HOME_SLIDE));
fullscreenBtn.addEventListener("click", toggleFullscreen);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    goToSlide(currentSlide + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(currentSlide - 1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(HOME_SLIDE);
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
    goToSlide(currentSlide + (deltaX < 0 ? 1 : -1));
    return;
  }

  if (elapsed < 420) {
    const clickedRightHalf = event.clientX > stageRect.left + stageRect.width / 2;
    goToSlide(currentSlide + (clickedRightHalf ? 1 : -1));
  }
});

stage.addEventListener("pointercancel", () => {
  pointerStart = null;
});

window.addEventListener("hashchange", () => {
  const nextSlide = getInitialSlide();
  if (nextSlide !== currentSlide) goToSlide(nextSlide);
});

render();
