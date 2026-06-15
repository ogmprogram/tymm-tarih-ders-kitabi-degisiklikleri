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

let currentSlide = getInitialSlide();
let touchStartX = null;

function getInitialSlide() {
  const match = window.location.hash.match(/slide-(\d+)/);
  if (!match) return 1;

  return clamp(Number(match[1]), 1, TOTAL_SLIDES);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function goToSlide(slideNumber) {
  const nextSlide = clamp(slideNumber, 1, TOTAL_SLIDES);
  if (nextSlide === currentSlide && slideImage.src) return;

  currentSlide = nextSlide;
  render();
}

function render() {
  const slide = slides[currentSlide - 1];
  stage.classList.remove("is-transitioning");
  void stage.offsetWidth;
  stage.classList.add("is-transitioning");

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

stage.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

stage.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;

  const delta = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) < 48) return;
  goToSlide(currentSlide + (delta < 0 ? 1 : -1));
});

window.addEventListener("hashchange", () => {
  const nextSlide = getInitialSlide();
  if (nextSlide !== currentSlide) goToSlide(nextSlide);
});

render();
