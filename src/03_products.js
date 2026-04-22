import './07_style.css';
import './06_pages.css';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
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

  const revealElements = gsap.utils.toArray('.gs-reveal-up');
  revealElements.forEach(el => {
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // ── Infinite bounce scroll for testimonials ──────────────────────────────
  const track  = document.querySelector('.marquee-track');
  const inner  = document.querySelector('.marquee-inner');
  if (track && inner) {
    const SPEED  = 1.2;   // px per frame — increase to scroll faster
    let pos      = 0;
    let dir      = -1;    // -1 = scrolling left, +1 = scrolling right
    let paused   = false;

    // pause on hover so users can read
    inner.addEventListener('mouseenter', () => paused = true);
    inner.addEventListener('mouseleave', () => paused = false);

    function tick() {
      if (!paused) {
        const hScroll = inner.scrollWidth - track.clientWidth;
        pos += dir * SPEED;
        if (pos <= -hScroll) { pos = -hScroll; dir = 1; }
        if (pos >= 0) { pos = 0; dir = -1; }
        inner.style.transform = `translateX(${pos}px)`;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Technical Specifications Modal Logic
  const specSheets = {
    horizontal: {
      title: "Horizontal Injection Series",
      specs: [
        ["Clamping Force", "60 - 450 Tons"],
        ["Shot Weight", "100g - 1500g"],
        ["Tie-Bar Distance", "320x320 - 780x780 mm"],
        ["Screw Diameter", "30mm - 75mm"],
        ["Injection Pressure", "1450 - 2100 bar"]
      ]
    },
    pet: {
      title: "PET Preform Series",
      specs: [
        ["Clamping Force", "100 - 320 Tons"],
        ["Cavities", "16 to 48 Max"],
        ["Cycle Time", "8.5s - 14s"],
        ["Plasticizing Capacity", "High-Speed PET Special"],
        ["Screw L/D Ratio", "25:1 Optimized"]
      ]
    },
    pvc: {
      title: "PVC Injection Series",
      specs: [
        ["Clamping Force", "90 - 400 Tons"],
        ["Shot Weight", "150g - 1200g"],
        ["Screw Design", "Bimetallic PVC Specialized"],
        ["Cooling System", "High-Flow Barrel Fans"],
        ["Control Unit", "Precision PID Thermal"]
      ]
    },
    servo: {
      title: "Servo Drive Series",
      specs: [
        ["Energy Efficiency", "Up to 60% Savings"],
        ["Response Time", "< 30ms"],
        ["Repeat Accuracy", "± 0.1%"],
        ["Clamping Force", "60 - 500 Tons"],
        ["System Type", "Permanent Magnet Servo"]
      ]
    }
  };

  const modal = document.getElementById('spec-modal');
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
          <tr>
            <td>${spec[0]}</td>
            <td>${spec[1]}</td>
          </tr>
        `).join('');
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
});
