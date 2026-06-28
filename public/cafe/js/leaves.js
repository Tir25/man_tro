/* ============================================
   LEAVES — SVG falling leaves with organic sway
             + periodic wind gusts
   ============================================ */

const LeavesModule = (function () {
    'use strict';

    let leafContainer = null;
    let leaves = [];
    let windGustTimer = null;

    /* ---- Create a single SVG leaf ---- */
    function createLeafSVG(pathIndex, color) {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 12 20");
        svg.setAttribute("fill", color);

        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", SVG_PATHS.LEAVES[pathIndex]);
        svg.appendChild(path);

        return svg;
    }

    /* ---- Spawn leaves ---- */
    function createLeaves() {
        leafContainer = document.createElement('div');
        leafContainer.className = 'fixed inset-0 pointer-events-none overflow-hidden';
        leafContainer.style.zIndex = 'var(--z-background, 1)';
        leafContainer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(leafContainer);

        const isMobile = window.innerWidth < CONFIG.MOBILE_WIDTH;
        const count = isMobile ? CONFIG.LEAF_COUNT_MOBILE : CONFIG.LEAF_COUNT_DESKTOP;

        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('leaf-element');

            /* Randomize leaf properties */
            const pathIdx = Math.floor(Math.random() * SVG_PATHS.LEAVES.length);
            const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
            const size = Math.random() * 10 + 10; // 10–20px
            const duration = Math.random() * 12 + 10; // 10–22s
            const delay = Math.random() * 12; // 0–12s
            const startX = Math.random() * 100; // 0–100vw

            const leafSvg = createLeafSVG(pathIdx, color);
            leafSvg.style.width = `${size}px`;
            leafSvg.style.height = `${size * 1.6}px`;
            leafSvg.style.opacity = '0.5';

            wrapper.style.left = `${startX}vw`;
            wrapper.style.animationDuration = `${duration}s`;
            wrapper.style.animationDelay = `${delay}s`;

            wrapper.appendChild(leafSvg);
            leafContainer.appendChild(wrapper);
            leaves.push(wrapper);
        }

        /* Start wind gusts */
        startWindGusts();
    }

    /* ---- Wind Gust Effect ---- */
    function startWindGusts() {
        windGustTimer = setInterval(() => {
            triggerWindGust();
        }, CONFIG.WIND_GUST_INTERVAL);
    }

    function triggerWindGust() {
        /* Temporarily speed up all leaves and push them sideways */
        const gustDirection = Math.random() > 0.5 ? 1 : -1;
        const gustStrength = Math.random() * 40 + 30; // 30–70px

        leaves.forEach((leaf, index) => {
            const delay = index * 80; // staggered effect

            setTimeout(() => {
                /* Apply a quick sideways push via GSAP if available, else CSS */
                if (typeof gsap !== 'undefined') {
                    gsap.to(leaf, {
                        x: `+=${gustDirection * gustStrength}`,
                        duration: 1.5,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(leaf, {
                                x: 0,
                                duration: 2,
                                ease: "power1.inOut"
                            });
                        }
                    });
                }
            }, delay);
        });
    }

    /* ---- Cleanup ---- */
    function destroy() {
        if (windGustTimer) {
            clearInterval(windGustTimer);
            windGustTimer = null;
        }
        if (leafContainer && leafContainer.parentNode) {
            leafContainer.remove();
        }
        leaves = [];
    }

    /* ---- Initialize ---- */
    function init() {
        /* Only start after the user enters the cafe */
        document.addEventListener('cafe:entered', () => {
            try {
                createLeaves();
            } catch (err) {
                console.warn('[LeavesModule] Failed to initialize:', err);
            }
        });
    }

    return { init, destroy };
})();
