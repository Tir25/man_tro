/* ============================================
   LANDING — Dust motes, enter button, page flip,
             bird burst transition
   ============================================ */

const LandingModule = (function () {
    'use strict';

    let isTransitioning = false;

    /* ---- Dust Motes ---- */
    function createDustMotes() {
        const container = document.getElementById('dust-container');
        if (!container) return;

        for (let i = 0; i < CONFIG.DUST_COUNT; i++) {
            const mote = document.createElement('div');
            mote.classList.add('dust-mote');
            const size = Math.random() * 4 + 1;
            mote.style.width = `${size}px`;
            mote.style.height = `${size}px`;
            mote.style.left = `${Math.random() * 100}vw`;
            mote.style.animationDelay = `${Math.random() * 10}s`;
            mote.style.animationDuration = `${Math.random() * 10 + 10}s`;
            container.appendChild(mote);
        }
    }

    /* ---- Bird Burst (Ghibli-style flying sparrows) ---- */
    function createBurstBird() {
        const ns = "http://www.w3.org/2000/svg";
        const palette = BIRD_PALETTES[Math.floor(Math.random() * BIRD_PALETTES.length)];

        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 40 40");
        svg.style.position = 'fixed';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = 'var(--z-burst-birds, 60)';
        svg.style.opacity = '0';
        svg.style.filter = 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))';

        const size = Math.random() * 20 + 22;
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;

        /* Tail */
        const tail = document.createElementNS(ns, "path");
        tail.setAttribute("d", SVG_PATHS.FLY_TAIL);
        tail.setAttribute("fill", palette.wing);
        svg.appendChild(tail);

        /* Body */
        const body = document.createElementNS(ns, "path");
        body.setAttribute("d", SVG_PATHS.FLY_BODY);
        body.setAttribute("fill", palette.body);
        svg.appendChild(body);

        /* Wing (flapping via interval) */
        const wing = document.createElementNS(ns, "path");
        wing.setAttribute("d", SVG_PATHS.FLY_WING_UP);
        wing.setAttribute("fill", palette.wing);
        svg.appendChild(wing);

        let flapUp = true;
        const flapInterval = setInterval(() => {
            wing.setAttribute("d", flapUp ? SVG_PATHS.FLY_WING_DOWN : SVG_PATHS.FLY_WING_UP);
            flapUp = !flapUp;
        }, 120);

        /* Head */
        const head = document.createElementNS(ns, "path");
        head.setAttribute("d", SVG_PATHS.FLY_HEAD);
        head.setAttribute("fill", palette.head);
        svg.appendChild(head);

        /* Beak */
        const beak = document.createElementNS(ns, "path");
        beak.setAttribute("d", SVG_PATHS.FLY_BEAK);
        beak.setAttribute("fill", palette.beak);
        svg.appendChild(beak);

        /* Eye */
        const eye = document.createElementNS(ns, "circle");
        eye.setAttribute("cx", "25");
        eye.setAttribute("cy", "11");
        eye.setAttribute("r", "1.5");
        eye.setAttribute("fill", "white");
        svg.appendChild(eye);

        const pupil = document.createElementNS(ns, "circle");
        pupil.setAttribute("cx", "26");
        pupil.setAttribute("cy", "11");
        pupil.setAttribute("r", "0.8");
        pupil.setAttribute("fill", "#1a1a1a");
        svg.appendChild(pupil);

        /* Store interval for cleanup */
        svg._flapInterval = flapInterval;

        return svg;
    }

    function spawnBurstBirds() {
        const directions = CONFIG.BURST_DIRECTIONS;

        for (let i = 0; i < CONFIG.BURST_BIRD_COUNT; i++) {
            const svg = createBurstBird();
            const dir = directions[Math.floor(Math.random() * directions.length)];

            svg.style.animation = `${dir} ${Math.random() * 1.5 + 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            svg.style.animationDelay = `${Math.random() * 0.3}s`;

            document.body.appendChild(svg);

            /* Auto-cleanup */
            setTimeout(() => {
                if (svg._flapInterval) clearInterval(svg._flapInterval);
                if (svg.parentNode) svg.remove();
            }, 3500);
        }
    }

    /* ---- Page Flip Transition ---- */
    function triggerTransition() {
        if (isTransitioning) return;
        isTransitioning = true;

        const enterBtn = document.getElementById('enter-btn');
        const landingCover = document.getElementById('landing-cover');
        const landingWrapper = document.getElementById('landing-wrapper');
        const mainContent = document.getElementById('main-content');

        if (!enterBtn || !landingCover || !landingWrapper || !mainContent) return;

        /* Disable button to prevent double-click */
        enterBtn.disabled = true;
        enterBtn.setAttribute('aria-disabled', 'true');

        /* Start flip + burst */
        landingCover.classList.add('flipped');
        spawnBurstBirds();

        /* Reveal main content */
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            mainContent.classList.remove('h-screen', 'overflow-hidden');
            mainContent.classList.add('opacity-100');
            window.scrollTo(0, 0);
        }, CONFIG.CONTENT_FADE_DELAY);

        /* Cleanup and initialize environment */
        setTimeout(() => {
            landingWrapper.style.display = 'none';

            /* Dispatch custom event for other modules to hook into */
            document.dispatchEvent(new CustomEvent('cafe:entered'));
        }, CONFIG.CLEANUP_DELAY);
    }

    /* ---- Initialize ---- */
    function init() {
        createDustMotes();

        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', triggerTransition);
        }
    }

    return { init };
})();
