/* ============================================
   MODAL — Custom order success modal
   ============================================ */

const ModalModule = (function () {
    'use strict';

    let dismissTimer = null;

    /* ---- Show modal ---- */
    function show() {
        const backdrop = document.getElementById('success-modal');
        if (!backdrop) return;

        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');

        /* Trap focus inside modal */
        const closeBtn = backdrop.querySelector('.modal-close-btn');
        if (closeBtn) closeBtn.focus();

        /* Auto-dismiss after timeout */
        dismissTimer = setTimeout(() => {
            hide();
        }, CONFIG.MODAL_AUTO_DISMISS);

        /* Close on backdrop click */
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) hide();
        });

        /* Close on Escape key */
        document.addEventListener('keydown', handleEscape);
    }

    /* ---- Hide modal ---- */
    function hide() {
        const backdrop = document.getElementById('success-modal');
        if (!backdrop) return;

        backdrop.classList.remove('active');
        backdrop.setAttribute('aria-hidden', 'true');

        if (dismissTimer) {
            clearTimeout(dismissTimer);
            dismissTimer = null;
        }

        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') hide();
    }

    /* ---- Form submission handler ---- */
    function handleFormSubmit(e) {
        e.preventDefault();

        /* Only show modal if form is valid */
        if (!e.target.checkValidity()) {
            e.target.reportValidity();
            return;
        }

        show();

        /* Reset form */
        e.target.reset();
    }

    /* ---- Initialize ---- */
    function init() {
        try {
            const form = document.getElementById('order-form');
            if (form) {
                form.addEventListener('submit', handleFormSubmit);
            }
        } catch (err) {
            console.warn('[ModalModule] Failed to initialize:', err);
        }
    }

    return { init, show, hide };
})();
