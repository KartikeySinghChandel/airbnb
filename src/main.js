import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. LENIS SMOOTH SCROLLING SETUP
   ========================================================================== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.3,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ==========================================================================
   CANVAS DRAW COVER HELPER
   ========================================================================== */
function drawCover(ctx, canvas, img) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  const hRatio = cw / img.naturalWidth;
  const vRatio = ch / img.naturalHeight;
  const ratio = Math.max(hRatio, vRatio);

  const shiftX = (cw - img.naturalWidth * ratio) / 2;
  const shiftY = (ch - img.naturalHeight * ratio) / 2;

  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    shiftX,
    shiftY,
    img.naturalWidth * ratio,
    img.naturalHeight * ratio
  );
}

/* ==========================================================================
   2. SHOT 01: AERIAL CLIFTON DESCENT (300 FRAMES SCROLL ANIMATION)
   Pinned at top during scroll. Scrubs through all 300 frames.
   Only when Scene 1 finishes does Scene 2 underneath appear.
   ========================================================================== */
function initShot1() {
  const canvas = document.getElementById('shot1-canvas');
  const track = document.getElementById('shot1-section');
  if (!canvas || !track) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 300;
  const frames = new Array(TOTAL_FRAMES);

  function getFrameUrl(i) {
    const pad = String(i + 1).padStart(3, '0');
    return `/shot1/ezgif-frame-${pad}.jpg`;
  }

  // Preload frame 0 immediately
  const f0 = new Image();
  f0.src = getFrameUrl(0);
  f0.onload = () => drawCover(ctx, canvas, f0);
  frames[0] = f0;

  // Preload remaining frames
  for (let i = 1; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    frames[i] = img;
  }

  function getLoadedImage(targetIdx) {
    if (frames[targetIdx] && frames[targetIdx].complete && frames[targetIdx].naturalWidth > 0) {
      return frames[targetIdx];
    }
    for (let i = targetIdx - 1; i >= 0; i--) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
    }
    for (let i = targetIdx + 1; i < TOTAL_FRAMES; i++) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
    }
    return frames[0];
  }

  const state = { targetFrame: 0, currentFrame: 0 };
  const overlay1 = document.getElementById('shot1-overlay-1');
  const overlay2 = document.getElementById('shot1-overlay-2');
  const overlay3 = document.getElementById('shot1-overlay-3');
  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: '+=3500',
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    anticipatePin: 1,
    onUpdate: (self) => {
      const p = self.progress;
      state.targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(p * (TOTAL_FRAMES - 1)));

      // Overlays for Shot 1
      if (overlay1) {
        if (p < 0.28) {
          const op = 1 - p / 0.22;
          overlay1.style.opacity = Math.max(0, op);
          overlay1.style.transform = `translate(-50%, calc(-50% - ${p * 100}px))`;
          overlay1.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
        } else {
          overlay1.style.opacity = 0;
          overlay1.style.pointerEvents = 'none';
        }
      }

      if (overlay2) {
        if (p >= 0.30 && p <= 0.65) {
          let op = 0;
          if (p < 0.44) {
            op = (p - 0.30) / 0.12;
          } else {
            op = 1 - (p - 0.52) / 0.13;
          }
          overlay2.style.opacity = Math.max(0, Math.min(1, op));
          overlay2.style.transform = `translateY(calc(-50% + ${(0.48 - p) * 50}px))`;
        } else {
          overlay2.style.opacity = 0;
        }
      }

      if (overlay3) {
        if (p >= 0.68) {
          let op = (p - 0.68) / 0.18;
          overlay3.style.opacity = Math.max(0, Math.min(1, op));
          overlay3.style.transform = `translateY(calc(-50% + ${(0.85 - p) * 50}px))`;
        } else {
          overlay3.style.opacity = 0;
        }
      }
    },
  });

  function renderLoop() {
    state.currentFrame += (state.targetFrame - state.currentFrame) * 0.2;
    const targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(state.currentFrame)));
    const img = getLoadedImage(targetIdx);
    if (img) drawCover(ctx, canvas, img);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/* ==========================================================================
   3. SHOT 02: SUITE ARRIVAL (300 FRAMES)
   Positioned directly below Shot 1. Pinned during scroll until completion.
   ========================================================================== */
function initShot2() {
  const canvas = document.getElementById('shot2-canvas');
  const track = document.getElementById('shot2-section');
  if (!canvas || !track) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 300;
  const frames = new Array(TOTAL_FRAMES);

  function getFrameUrl(i) {
    const pad = String(i + 1).padStart(3, '0');
    return `/shot2/ezgif-frame-${pad}.jpg`;
  }

  const f0 = new Image();
  f0.src = getFrameUrl(0);
  f0.onload = () => drawCover(ctx, canvas, f0);
  frames[0] = f0;

  for (let i = 1; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    frames[i] = img;
  }

  function getLoadedImage(targetIdx) {
    if (frames[targetIdx] && frames[targetIdx].complete && frames[targetIdx].naturalWidth > 0) {
      return frames[targetIdx];
    }
    for (let i = targetIdx - 1; i >= 0; i--) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
    }
    for (let i = targetIdx + 1; i < TOTAL_FRAMES; i++) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
    }
    return frames[0];
  }

  const state = { targetFrame: 0, currentFrame: 0 };
  const overlay1 = document.getElementById('shot2-overlay-1');
  const overlay2 = document.getElementById('shot2-overlay-2');
  const overlay3 = document.getElementById('shot2-overlay-3');
  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: '+=3500',
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    anticipatePin: 1,
    onUpdate: (self) => {
      const p = self.progress;
      state.targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(p * (TOTAL_FRAMES - 1)));

      // Overlays for Shot 2
      if (overlay1) {
        if (p < 0.28) {
          const op = 1 - p / 0.22;
          overlay1.style.opacity = Math.max(0, op);
          overlay1.style.transform = `translate(-50%, calc(-50% - ${p * 100}px))`;
          overlay1.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
        } else {
          overlay1.style.opacity = 0;
          overlay1.style.pointerEvents = 'none';
        }
      }

      if (overlay2) {
        if (p >= 0.30 && p <= 0.65) {
          let op = 0;
          if (p < 0.44) {
            op = (p - 0.30) / 0.12;
          } else {
            op = 1 - (p - 0.52) / 0.13;
          }
          overlay2.style.opacity = Math.max(0, Math.min(1, op));
          overlay2.style.transform = `translateY(calc(-50% + ${(0.48 - p) * 50}px))`;
        } else {
          overlay2.style.opacity = 0;
        }
      }

      if (overlay3) {
        if (p >= 0.68) {
          let op = (p - 0.68) / 0.18;
          overlay3.style.opacity = Math.max(0, Math.min(1, op));
          overlay3.style.transform = `translateY(calc(-50% + ${(0.85 - p) * 50}px))`;
        } else {
          overlay3.style.opacity = 0;
        }
      }
    },
  });

  function renderLoop() {
    state.currentFrame += (state.targetFrame - state.currentFrame) * 0.2;
    const targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(state.currentFrame)));
    const img = getLoadedImage(targetIdx);
    if (img) drawCover(ctx, canvas, img);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/* ==========================================================================
   4. RESERVATION COST CALCULATOR & CONFIRMATION MODAL
   ========================================================================== */
function initReservationEngine() {
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const chefSelect = document.getElementById('chef-service');
  const nightsLabel = document.getElementById('calc-nights-label');
  const stayTotalEl = document.getElementById('calc-stay-total');
  const grandTotalEl = document.getElementById('calc-grand-total');

  const BASE_RATE = 1850;
  const DEPOSIT = 1000;

  function calculate() {
    if (!checkin || !checkout) return;
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);

    const diff = Math.max(1000 * 60 * 60 * 24, d2 - d1);
    const nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));

    let chefCostPerDay = 0;
    if (chefSelect?.value === 'breakfast') chefCostPerDay = 150;
    if (chefSelect?.value === 'full') chefCostPerDay = 450;

    const accommodationTotal = BASE_RATE * nights;
    const chefTotal = chefCostPerDay * nights;
    const grandTotal = accommodationTotal + chefTotal + DEPOSIT;

    if (nightsLabel) nightsLabel.innerText = `${nights} Night${nights > 1 ? 's' : ''} × $${BASE_RATE.toLocaleString()}`;
    if (stayTotalEl) stayTotalEl.innerText = `$${accommodationTotal.toLocaleString()}`;
    if (grandTotalEl) grandTotalEl.innerText = `$${grandTotal.toLocaleString()} USD`;

    return { nights, grandTotal, d1, d2 };
  }

  checkin?.addEventListener('change', calculate);
  checkout?.addEventListener('change', calculate);
  chefSelect?.addEventListener('change', calculate);
  calculate();

  const form = document.getElementById('reservation-form');
  const modal = document.getElementById('confirm-modal');
  const modalCloseX = document.getElementById('modal-close-x');
  const modalDoneBtn = document.getElementById('modal-done-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = calculate();
    const guestName = document.getElementById('guest-name')?.value || 'Guest';

    document.getElementById('conf-name').innerText = guestName;
    document.getElementById('conf-nights').innerText = `${data.nights} Nights`;
    document.getElementById('conf-total').innerText = `$${data.grandTotal.toLocaleString()} USD`;

    const opt = { month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('conf-dates').innerText = `${data.d1.toLocaleDateString('en-US', opt)} – ${data.d2.toLocaleDateString('en-US', opt)}`;

    modal?.classList.add('open');
  });

  modalCloseX?.addEventListener('click', () => modal?.classList.remove('open'));
  modalDoneBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
    form?.reset();
    calculate();
  });
}

/* ==========================================================================
   5. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  toggle?.addEventListener('click', () => drawer?.classList.add('open'));
  closeBtn?.addEventListener('click', () => drawer?.classList.remove('open'));

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => drawer?.classList.remove('open'));
  });

  // Anchor links smooth navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { duration: 1.2 });
        }
      }
    });
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  initShot1();
  initShot2();
  initReservationEngine();
  initNavigation();
  ScrollTrigger.refresh();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
