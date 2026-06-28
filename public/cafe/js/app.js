/* ============================================
   APP — Main orchestrator
   Initializes all modules safely.
   Each module is isolated; if one fails,
   the rest continue working.
   ============================================ */

(function () {
    'use strict';

    /* Mark GSAP as loaded if available */
    if (typeof gsap !== 'undefined') {
        document.documentElement.classList.add('gsap-loaded');
    }

    /* ---- Initialize Lucide Icons ---- */
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (err) {
        console.warn('[App] Lucide icons failed:', err);
    }

    /* ---- Initialize All Modules ---- */
    const modules = [
        { name: 'Landing',          module: typeof LandingModule !== 'undefined' ? LandingModule : null },
        { name: 'Leaves',           module: typeof LeavesModule !== 'undefined' ? LeavesModule : null },
        { name: 'Birds',            module: typeof BirdsModule !== 'undefined' ? BirdsModule : null },
        { name: 'ScrollAnimations', module: typeof ScrollAnimationsModule !== 'undefined' ? ScrollAnimationsModule : null },
        { name: 'UI',               module: typeof UIModule !== 'undefined' ? UIModule : null },
        { name: 'Modal',            module: typeof ModalModule !== 'undefined' ? ModalModule : null },
    ];

    modules.forEach(({ name, module }) => {
        if (!module) {
            console.warn(`[App] Module "${name}" not found. Skipping.`);
            return;
        }

        try {
            module.init();
        } catch (err) {
            console.warn(`[App] Module "${name}" failed to initialize:`, err);
        }
    });

    /* ---- Log successful boot ---- */
    console.log(
        '%c🌿 The Whispering Vine Cafe — All systems ready',
        'color: #6B8E7B; font-weight: bold; font-size: 14px;'
    );
})();
