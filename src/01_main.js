import './07_style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// MOBILE MENU LOGIC
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  
  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// HERO SECTION CANVAS LOGIC
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d", { willReadFrequently: false });

// Detect mobile device
const isMobile = window.innerWidth < 768;

// Reduce frame count on mobile
const frameCount = isMobile ? 80 : 150;
const currentFrame = index => (
  `/ezgif-6135187c0614d499-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const machine = { frame: 0 };

// Preload sequence
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Use full resolution on mobile
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}
window.addEventListener('resize', resizeCanvas);

function render() {
  const img = images[machine.frame];
  if (img && img.complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight;
    let startX = 0, startY = 0;
    
    // Scale preserving aspect ratio to cover
    if (imgRatio > canvasRatio) {
       drawHeight = canvas.height;
       drawWidth = img.width * (canvas.height / img.height);
       startX = (canvas.width - drawWidth) / 2;
    } else {
       drawWidth = canvas.width;
       drawHeight = img.height * (canvas.width / img.width);
       startY = (canvas.height - drawHeight) / 2;
    }
    context.drawImage(img, startX, startY, drawWidth, drawHeight);
  }
}

images[0].addEventListener('load', () => resizeCanvas());

// The exact scroll distance to pin the hero section (e.g. 2.5 screens tall)
const pinDuration = window.innerHeight * 2.5;

// 1. PIN THE HERO SECTION AND SCRUB THE MACHINE FRAMES
gsap.to(machine, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: () => `+=${pinDuration}`, // Dynamically calculate pin duration
    scrub: isMobile ? 8 : 20, 
    pin: true,
  },
  onUpdate: render
});

// 2. FADE OUT HERO TEXT QUICKLY AS SCROLL STARTS
gsap.to(".hero-text-wrapper", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: () => `+=${pinDuration * 0.15}`, // Fade out in the first 15% of the scroll
    scrub: 24,
  },
  opacity: 0,
  y: -50,
});

gsap.to(".scroll-indicator", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: () => `+=${pinDuration * 0.1}`,
    scrub: 24,
  },
  opacity: 0
});

// PROFESSIONAL FEATURE SECTIONS ANIMATIONS (STAGGERED)
const features = document.querySelectorAll('.feature-section');

features.forEach((section) => {
  const imageWrapper = section.querySelector('.feature-image-wrapper');
  const image = section.querySelector('.feature-image');
  const tagline = section.querySelector('.tagline');
  const title = section.querySelector('.title');
  const desc = section.querySelector('.description');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%", // Triggers when section is 75% down the viewport
      toggleActions: "play none none reverse", // Play forward, reverse when scrolling up
    }
  });

  // Staggered reveal for texts
  tl.fromTo([tagline, title, desc], 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
  );

  // Smooth image reveal with a slight scaling effect
  tl.fromTo(imageWrapper,
    { y: 60, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
    "-=0.8" // start slightly before text finishes
  );

  // Parallax on the image while scrolling past it
  gsap.to(image, {
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: isMobile ? 12 : 24,
    },
    y: 30, // move image down slightly as user scrolls
    ease: "none"
  });
});

// Footer fade in
gsap.fromTo(".pro-footer .footer-content", 
  { y: 50, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 1, ease: "power3.out",
    scrollTrigger: {
      trigger: ".pro-footer",
      start: "top 80%"
    }
  }
);
