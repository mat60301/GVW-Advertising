// 300x250 HTML5 Banner Scaffold
// Add animation/timing here later (GSAP/CSS/vanilla JS).
(function () {
  // Google/Meta click-through convention
  window.clickTag = window.clickTag || window.clickTAG || "";

  function handleClick() {
    if (window.clickTag) window.open(window.clickTag, "_blank");
  }

  window.addEventListener("DOMContentLoaded", function () {
    var ad = document.getElementById("ad");
    if (ad) ad.addEventListener("click", handleClick);

    // Trigger gym shatter 1 second after load
    setTimeout(function () {
      shatterGym({
        gymId: "gymBg",     // IMPORTANT: your gym is #gymBG (not gymLayer)
        rows: 12,
        cols: 18,
        duration: 1000,
        spread: 280
      });
    }, 1000);

    setTimeout(() => {
      assembleLivingRoom({ livingId: "livingBg" });
    }, 3000);
  });
})();

/* ===============================
   GYM SHATTER EFFECT
   =============================== */

function shatterGym({
  gymId = "gymBg",
  rows = 10,
  cols = 14,
  duration = 900,
  spread = 260,
  fade = true
} = {}) {

  const gym = document.getElementById(gymId);
  if (!gym) return;

  const w = gym.offsetWidth;
  const h = gym.offsetHeight;

  const shatter = document.createElement("div");
  shatter.id = "gymShatter";
  shatter.style.width = w + "px";
  shatter.style.height = h + "px";
  shatter.style.left = "0px";
  shatter.style.top  = "0px";

  gym.parentNode.appendChild(shatter);
  gym.style.visibility = "hidden";

  const pieceW = w / cols;
  const pieceH = h / rows;

  const rand = (min, max) => Math.random() * (max - min) + min;

  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = document.createElement("div");
      p.className = "gymPiece";
      p.style.width = pieceW + "px";
      p.style.height = pieceH + "px";
      p.style.left = (c * pieceW) + "px";
      p.style.top = (r * pieceH) + "px";
      p.style.backgroundSize = `${w}px ${h}px`;
      p.style.backgroundPosition = `${-c * pieceW}px ${-r * pieceH}px`;
      shatter.appendChild(p);
      pieces.push(p);
    }
  }

  const cx = w / 2;
  const cy = h / 2;

  shatter.getBoundingClientRect();

  pieces.forEach((p) => {
    const x = parseFloat(p.style.left) + pieceW / 2;
    const y = parseFloat(p.style.top) + pieceH / 2;

    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    const flyX = dx * spread + rand(-40, 40);
    const flyY = dy * spread + rand(-30, 30);
    const rot  = rand(-220, 220);
    const delay = rand(0, 140);
    const z = rand(0, 180);
    const scale = rand(0.75, 1);

    p.style.transition =
      `transform ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms,
       opacity ${duration}ms ease ${delay}ms,
       filter ${duration}ms ease ${delay}ms`;

    requestAnimationFrame(() => {
      p.style.transform =
        `translate3d(${flyX}px, ${flyY}px, ${z}px) rotate(${rot}deg) scale(${scale})`;
      p.style.filter = `blur(${rand(0, 1.2)}px)`;
      if (fade) p.style.opacity = "0";
    });
  });

  setTimeout(() => shatter.remove(), duration + 250);
}

function assembleLivingRoom({
  livingId = "livingRoomBG", // <-- change this to your actual living room element id
  rows = 12,
  cols = 18,
  duration = 900,
  spread = 280,              // how far pieces start from their final position
  fadeIn = true
} = {}) {
  const living = document.getElementById(livingId);
  const ad = document.getElementById("ad");
  if (!living || !ad) return;

  // Create container above living layer
  const container = document.createElement("div");
  container.id = "livingAssemble";
  ad.appendChild(container);

  // Get the living room image from either:
  // - computed background-image (if living is a div)
  // - src attribute (if living is an img)
  let bgImg = "";
  const computedBg = getComputedStyle(living).backgroundImage;
  if (computedBg && computedBg !== "none") {
    bgImg = computedBg; // `url("...")`
  } else {
    const src = living.getAttribute("src");
    if (src) bgImg = `url("${src}")`;
  }
  if (!bgImg) return;

  // Hide the final living layer until assembly finishes
  living.style.visibility = "hidden";

  const w = 300, h = 250;
  const pieceW = w / cols;
  const pieceH = h / rows;

  const rand = (min, max) => Math.random() * (max - min) + min;

  const cx = w / 2, cy = h / 2;
  const pieces = [];

  // Build pieces already "scattered"
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = document.createElement("div");
      p.className = "livingPiece";
      p.style.width = pieceW + "px";
      p.style.height = pieceH + "px";
      p.style.left = (c * pieceW) + "px";
      p.style.top  = (r * pieceH) + "px";
      p.style.backgroundImage = bgImg;
      p.style.backgroundPosition = `${-c * pieceW}px ${-r * pieceH}px`;

      // Scatter offset based on distance/direction from center
      const x = (c * pieceW) + pieceW / 2;
      const y = (r * pieceH) + pieceH / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      const startX = dx * spread + rand(-40, 40);
      const startY = dy * spread + rand(-30, 30);
      const startRot = rand(-220, 220);
      const startScale = rand(0.75, 1.0);

      // Start scattered
      p.style.transform =
        `translate3d(${startX}px, ${startY}px, 0px) rotate(${startRot}deg) scale(${startScale})`;
      p.style.filter = `blur(${rand(0, 1.2)}px)`;
      p.style.opacity = fadeIn ? "0" : "1";

      container.appendChild(p);
      pieces.push(p);
    }
  }

  // Force layout so transitions apply
  container.getBoundingClientRect();

  // Animate pieces INTO place
  pieces.forEach((p) => {
    const delay = rand(0, 140);

    p.style.transition =
      `transform ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms,
       opacity ${duration}ms ease ${delay}ms,
       filter ${duration}ms ease ${delay}ms`;

    requestAnimationFrame(() => {
      p.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg) scale(1)`;
      p.style.filter = "blur(0px)";
      if (fadeIn) p.style.opacity = "1";
    });
  });

  // Cleanup: show the real living layer after assembly and remove pieces
  setTimeout(() => {
    living.style.visibility = "visible";
    container.remove();
    setTimeout(() => {
      animateFinalFrame();
    }, 200);
  }, duration + 250);
}

function animateFinalFrame() {
  const cta = document.getElementById("cta");
  const tagBar = document.getElementById("tagBar");
  const encouragement = document.getElementById("encouragement");

  if (cta) {
  // Full-on wiggle: pop + multi-rotation wobble + settle
    cta.animate(
      [
        { opacity: 0, transform: "scale(0.2) rotate(-18deg)" },

        { opacity: 1, transform: "scale(0.64) rotate(14deg)" },
        { opacity: 1, transform: "scale(0.58) rotate(-10deg)" },
        { opacity: 1, transform: "scale(0.62) rotate(8deg)" },
        { opacity: 1, transform: "scale(0.56) rotate(-4deg)" },

        { opacity: 1, transform: "scale(0.5) rotate(0deg)" }
      ],
      {
        duration: 1400, // slightly longer to let the wiggle breathe
        delay: 80,
        easing: "cubic-bezier(.25,.9,.25,1)",
        fill: "forwards"
      }
    );
  }


  // Tagbar sneaks in from bottom — slower + heavier
  if (tagBar) {
    tagBar.animate(
      [
        { opacity: 0, transform: "scale(0.5) translate3d(0, 60px, 0)" },
        { opacity: 1, transform: "scale(0.5) translate3d(0, 0px, 0)" }
      ],
      {
        duration: 1040, // ⬅️ was ~520ms
        delay: 300,
        easing: "cubic-bezier(.25,.85,.25,1)",
        fill: "forwards"
      }
    );
  }

  // Encouragement follows tagbar with a slightly longer stagger
  if (encouragement) {
    encouragement.animate(
      [
        { opacity: 0, transform: "scale(0.5) translate3d(0, 60px, 0)" },
        { opacity: 1, transform: "scale(0.5) translate3d(0, 0px, 0)" }
      ],
      {
        duration: 1040, // ⬅️ was ~520ms
        delay: 550,     // ⬅️ stagger increased
        easing: "cubic-bezier(.25,.85,.25,1)",
        fill: "forwards"
      }
    );
  }
}