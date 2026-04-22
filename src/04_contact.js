import './07_style.css';
import './06_pages.css';
import gsap from 'gsap';

// Smooth reveal for content elements upon loading
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

  gsap.fromTo('.gs-reveal', 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
  );

  const form = document.getElementById("systems-form");
  if(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      btn.innerText = "Transmitting...";
      setTimeout(() => {
        btn.style.background = "#FF6600"; // Amber success
        btn.innerText = "Transmission Complete";
      }, 1500);
    });
  }
});
