/* ============================================
   UI — Custom cursor, 3D tilt on cards,
        ambient audio toggle
   ============================================ */

const UIModule = (function () {
    'use strict';

    /* =====================
       CUSTOM CURSOR
       ===================== */
    let cursorEl = null;
    let cursorRAF = null;
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    function initCursor() {
        /* Skip on touch devices */
        if ('ontouchstart' in window) return;

        cursorEl = document.querySelector('.custom-cursor');
        if (!cursorEl) return;

        document.documentElement.classList.add('has-custom-cursor');
        cursorEl.style.opacity = '1';

        /* Track mouse position */
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        }, { passive: true });

        /* Hover detection for interactive elements */
        const interactiveSelector = 'a, button, .menu-card, .gallery-item, input, select, textarea, .audio-toggle';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                cursorEl.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                cursorEl.classList.remove('hovering');
            }
        });

        /* Smooth follow with lerp */
        function animateCursor() {
            currentX += (cursorX - currentX) * 0.15;
            currentY += (cursorY - currentY) * 0.15;
            cursorEl.style.left = `${currentX}px`;
            cursorEl.style.top = `${currentY}px`;
            cursorRAF = requestAnimationFrame(animateCursor);
        }
        cursorRAF = requestAnimationFrame(animateCursor);
    }

    /* =====================
       3D TILT ON MENU CARDS
       ===================== */
    function initTilt() {
        /* Skip on touch devices */
        if ('ontouchstart' in window) return;

        const cards = document.querySelectorAll('.menu-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5; // ±5 degrees
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    /* =====================
       AMBIENT AUDIO TOGGLE
       ===================== */
    let audioContext = null;
    let isPlaying = false;

    function initAudio() {
        const toggleBtn = document.getElementById('audio-toggle');
        if (!toggleBtn) return;

        /* We use a simple approach: create an oscillator-based
           ambient sound or load a very small audio file.
           For this implementation, we'll use the Web Audio API
           to generate soft pink noise + tone, avoiding external files. */

        toggleBtn.addEventListener('click', () => {
            try {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    createAmbientSound();
                }

                if (isPlaying) {
                    audioContext.suspend();
                    isPlaying = false;
                    toggleBtn.classList.remove('playing');
                    toggleBtn.setAttribute('aria-label', 'Play ambient sounds');
                } else {
                    audioContext.resume();
                    isPlaying = true;
                    toggleBtn.classList.add('playing');
                    toggleBtn.setAttribute('aria-label', 'Mute ambient sounds');
                }
            } catch (err) {
                console.warn('[UIModule] Audio failed:', err);
            }
        });
    }

    function createAmbientSound() {
        if (!audioContext) return;

        /* Create gentle pink noise */
        const bufferSize = 2 * audioContext.sampleRate;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.015;
            b6 = white * 0.115926;
        }

        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        /* Low-pass filter for warmth */
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        /* Very low volume */
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.08;

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noiseSource.start(0);

        /* Add a subtle low drone for warmth */
        const drone = audioContext.createOscillator();
        drone.type = 'sine';
        drone.frequency.value = 120;

        const droneGain = audioContext.createGain();
        droneGain.gain.value = 0.02;

        drone.connect(droneGain);
        droneGain.connect(audioContext.destination);
        drone.start(0);
    }

    /* =====================
       INITIALIZE
       ===================== */
    function init() {
        document.addEventListener('cafe:entered', () => {
            try {
                initCursor();
                initTilt();
                initAudio();
            } catch (err) {
                console.warn('[UIModule] Failed to initialize:', err);
            }
        });
    }

    return { init };
})();
