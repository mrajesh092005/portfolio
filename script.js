

window.addEventListener("load", () => {

    const animations = [
        { selector: ".top-tags", class: "from-top", delay: 0 },
        { selector: ".left h1", class: "from-left", delay: 0.3 },
        { selector: ".desc", class: "from-left", delay: 0.6 },
        { selector: ".live-line", class: "from-bottom", delay: 0.9 },
        { selector: ".buttons", class: "zoom-in", delay: 1.2 },
        { selector: ".site-link", class: "from-bottom", delay: 1.5 },
        { selector: ".right", class: "from-right", delay: 0.6 },
        { selector: ".stats", class: "from-bottom", delay: 1.8 },
    ];

    animations.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.style.animationDelay = `${item.delay}s`;
            el.classList.add(item.class);
        }
    });

    // ===== HIDE INTRO =====
    setTimeout(() => {
        const intro = document.getElementById("intro");
        const site = document.getElementById("real-site");

        intro.classList.add("smooth-out");

        setTimeout(() => {
            intro.style.display = "none";
            site.style.display = "block";
            initScrollAnimations();
        }, 1200);
    }, 3800);
});


// ===============================
// SCROLL REVEAL (SECTIONS)
// ===============================
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        ".slide-in-left, .slide-in-right, .slide-in-up"
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translate(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
}


// ===============================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".ul-list li");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: "smooth"
            });
        }
    });
});

// ===============================

// ===============================certificate section

const track = document.getElementById("carouselTrack");
const cards = document.querySelectorAll(".card");

let current = 0;
const cardWidth = 420 + 30; // card width + gap

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove("active", "near", "far");

        const diff = Math.abs(index - current);

        if (index === current) {
            card.classList.add("active");
        } else if (diff === 1) {
            card.classList.add("near");
        } else {
            card.classList.add("far");
        }
    });

    const wrapper = document.querySelector(".carousel-wrapper");
    const wrapperWidth = wrapper.offsetWidth;
    const centerOffset = (wrapperWidth / 2) - (280 / 2) - 60;

    track.style.transform = `translateX(${-current * cardWidth + centerOffset}px)`;
}

function moveSlide(direction) {
    current += direction;

    if (current < 0) current = cards.length - 1;
    if (current >= cards.length) current = 0;

    updateCarousel();
}

setInterval(() => {
    moveSlide(1);
}, 3000);

updateCarousel();
window.addEventListener("resize", updateCarousel);


// =============================
// CONTACT FORM → SEND SMS
// =============================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const response = await fetch("/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Failed to send message");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  });
}

function downloadCV() {
  window.location.href = "/download-resume";
}