import './08_mobile.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// MOBILE NAVIGATION LOGIC
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const menuLinks = document.querySelectorAll('.mobile-menu-links a');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    if (isActive) {
      document.body.style.overflow = 'hidden';
      // Staggered link reveal
      gsap.fromTo(menuLinks, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu on link click
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// LIGHTWEIGHT HERO LOGIC FOR MOBILE
// We skip the 240-frame sequence on mobile for rapid loading.
// Instead, we show a professional static background with a slight parallax.
const hero = document.getElementById("hero");
if (hero) {
  gsap.to(".hero-text-wrapper", {
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: 100,
    opacity: 0
  });
}

// MOBILE REVEAL ANIMATIONS
const reveals = document.querySelectorAll('.gs-reveal-up, .gs-reveal');
reveals.forEach(el => {
  gsap.fromTo(el, 
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    }
  );
});

// TESTIMONIALS TOUCH OPTIMIZATION
const track = document.querySelector('.marquee-track');
const inner = document.querySelector('.marquee-inner');
if (track && inner) {
  let pos = 0;
  const SPEED = 0.8; // Slower for mobile
  let paused = false;

  inner.addEventListener('touchstart', () => paused = true);
  inner.addEventListener('touchend', () => paused = false);

  function tick() {
    if (!paused) {
      const hScroll = inner.scrollWidth - track.clientWidth;
      pos -= SPEED;
      if (pos <= -hScroll) pos = 0;
      inner.style.transform = `translateX(${pos}px)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// MODAL LOGIC (Simplified for Mobile)
const modal = document.getElementById('spec-modal');
if (modal) {
  const specSheets = {
    horizontal: { title: "Horizontal Series", specs: [["Force", "60-450T"], ["Shot", "100-1500g"]] },
    pet: { title: "PET Series", specs: [["Cavities", "16-48"], ["Cycle", "8s-14s"]] },
    pvc: { title: "PVC Series", specs: [["Force", "90-400T"], ["Screw", "Bimetallic"]] },
    servo: { title: "Servo Series", specs: [["Savings", "60%"], ["Accuracy", "±0.1%"]] }
  };

  const modalTitle = document.getElementById('modal-title');
  const specsTable = document.getElementById('specs-table');
  const closeBtn = document.querySelector('.close-modal');

  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const machineKey = btn.closest('.fleet-card').dataset.machine;
      const data = specSheets[machineKey];
      if (data) {
        modalTitle.textContent = data.title;
        specsTable.innerHTML = data.specs.map(spec => `
          <tr><td>${spec[0]}</td><td>${spec[1]}</td></tr>
        `).join('');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}
