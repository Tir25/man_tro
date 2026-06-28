/* ============================================
   SCROLL ANIMATIONS — GSAP ScrollTrigger reveals,
                       parallax, scroll progress
   ============================================ */

const ScrollAnimationsModule = (function () {
    'use strict';

    /* ---- Section Reveals ---- */
    function setupSectionReveals() {
        /* Chapter badges */
        gsap.utils.toArray('.chapter-badge').forEach(badge => {
            gsap.from(badge, {
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: badge,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* Section headings */
        gsap.utils.toArray('.gsap-heading').forEach(heading => {
            gsap.from(heading, {
                opacity: 0,
                x: -40,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* Body text blocks */
        gsap.utils.toArray('.gsap-text').forEach(text => {
            gsap.from(text, {
                opacity: 0,
                y: 25,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* Images — scale reveal */
        gsap.utils.toArray('.gsap-image').forEach(img => {
            gsap.from(img, {
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* Menu cards — staggered entrance */
        const menuCards = gsap.utils.toArray('.menu-card');
        if (menuCards.length > 0) {
            gsap.from(menuCards, {
                opacity: 0,
                y: 40,
                stagger: 0.15,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: menuCards[0].parentElement,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        /* Gallery items — staggered */
        const galleryItems = gsap.utils.toArray('.gallery-item');
        if (galleryItems.length > 0) {
            gsap.from(galleryItems, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: galleryItems[0].parentElement,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        /* Testimonial cards — staggered */
        const testimonialCards = gsap.utils.toArray('.testimonial-card');
        if (testimonialCards.length > 0) {
            gsap.from(testimonialCards, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: testimonialCards[0].parentElement,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        /* Glass cards — fade up */
        gsap.utils.toArray('.gsap-glass').forEach(card => {
            gsap.from(card, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* Arrow dividers */
        gsap.utils.toArray('.gsap-divider').forEach(div => {
            gsap.from(div, {
                opacity: 0,
                scale: 0,
                duration: 0.4,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: div,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ---- Parallax ---- */
    function setupParallax() {
        /* Background parallax on sections with images */
        gsap.utils.toArray('.parallax-image').forEach(img => {
            gsap.to(img, {
                y: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });

        /* Center divider line subtle pulse */
        const centerLine = document.getElementById('center-line');
        if (centerLine) {
            gsap.to(centerLine, {
                opacity: 0.5,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });
        }
    }

    /* ---- Scroll Progress Bar ---- */
    function setupProgressBar() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    /* ---- Navbar scroll behavior ---- */
    function setupNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const navInner = navbar.querySelector('.nav-inner');

        ScrollTrigger.create({
            start: 50,
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    if (navInner) {
                        navInner.classList.add('scrolled');
                    }
                } else {
                    if (navInner) {
                        navInner.classList.remove('scrolled');
                    }
                }
            }
        });
    }

    /* ---- Initialize ---- */
    function init() {
        document.addEventListener('cafe:entered', () => {
            try {
                if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                    console.warn('[ScrollAnimationsModule] GSAP or ScrollTrigger not loaded. Skipping.');
                    return;
                }

                gsap.registerPlugin(ScrollTrigger);

                /* Small delay to let the DOM settle after transition */
                setTimeout(() => {
                    setupSectionReveals();
                    setupParallax();
                    setupProgressBar();
                    setupNavbar();

                    /* Refresh ScrollTrigger after everything is set up */
                    ScrollTrigger.refresh();
                }, CONFIG.ENV_INIT_DELAY - CONFIG.CLEANUP_DELAY + 200);
            } catch (err) {
                console.warn('[ScrollAnimationsModule] Failed to initialize:', err);
            }
        });
    }

    return { init };
})();
