/* ============================================
   BIRDS — Cute Ghibli-style companion sparrows
   
   Features:
   - Multi-part SVG (body, head, wing, tail, beak, legs, eye, blush)
   - 5 unique color palettes
   - 3 poses: perching, flying, startled
   - Click to interact (bird jumps + chirps)
   - Hover-startle (fly away if mouse gets close)
   - Perch on menu card edges, navbar, chapter badges
   - Wing flapping animation during flight
   - Head tilt and blink while perched
   ============================================ */

const BirdsModule = (function () {
    'use strict';

    let companionBirds = [];
    let perchSpots = [];
    let scrollTimeout = null;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseTracking = false;
    let proximityRAF = null;

    /* ==============================
       CREATE BIRD SVG (multi-part)
       ============================== */
    function createBirdSVG(paletteIndex, size) {
        const ns = "http://www.w3.org/2000/svg";
        const palette = BIRD_PALETTES[paletteIndex % BIRD_PALETTES.length];

        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 40 40");
        svg.classList.add('persistent-bird', 'perched');
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.cursor = 'pointer';
        svg.style.pointerEvents = 'auto'; /* clickable! */
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'A small bird perched nearby. Click to interact!');

        /* -- Create groups for each pose -- */
        const perchGroup = createPerchPose(ns, palette);
        perchGroup.classList.add('bird-pose', 'pose-perch');
        perchGroup.style.display = 'block';

        const flyGroup = createFlyPose(ns, palette);
        flyGroup.classList.add('bird-pose', 'pose-fly');
        flyGroup.style.display = 'none';

        const startledGroup = createStartledPose(ns, palette);
        startledGroup.classList.add('bird-pose', 'pose-startled');
        startledGroup.style.display = 'none';

        svg.appendChild(perchGroup);
        svg.appendChild(flyGroup);
        svg.appendChild(startledGroup);

        return svg;
    }

    /* ---- Perching Pose ---- */
    function createPerchPose(ns, palette) {
        const g = document.createElementNS(ns, "g");

        /* Tail */
        const tail = document.createElementNS(ns, "path");
        tail.setAttribute("d", SVG_PATHS.PERCH_TAIL);
        tail.setAttribute("fill", palette.wing);
        g.appendChild(tail);

        /* Body */
        const body = document.createElementNS(ns, "path");
        body.setAttribute("d", SVG_PATHS.PERCH_BODY);
        body.setAttribute("fill", palette.body);
        g.appendChild(body);

        /* Belly highlight (lighter area on bottom) */
        const belly = document.createElementNS(ns, "ellipse");
        belly.setAttribute("cx", "21");
        belly.setAttribute("cy", "26");
        belly.setAttribute("rx", "7");
        belly.setAttribute("ry", "4");
        belly.setAttribute("fill", palette.belly);
        belly.setAttribute("opacity", "0.6");
        g.appendChild(belly);

        /* Wing */
        const wing = document.createElementNS(ns, "path");
        wing.setAttribute("d", SVG_PATHS.PERCH_WING);
        wing.setAttribute("fill", palette.wing);
        wing.classList.add('bird-wing');
        g.appendChild(wing);

        /* Head */
        const head = document.createElementNS(ns, "path");
        head.setAttribute("d", SVG_PATHS.PERCH_HEAD);
        head.setAttribute("fill", palette.head);
        g.appendChild(head);

        /* Beak */
        const beak = document.createElementNS(ns, "path");
        beak.setAttribute("d", SVG_PATHS.PERCH_BEAK);
        beak.setAttribute("fill", palette.beak);
        g.appendChild(beak);

        /* Eye white */
        const eyeWhite = document.createElementNS(ns, "circle");
        eyeWhite.setAttribute("cx", SVG_PATHS.EYE_CX);
        eyeWhite.setAttribute("cy", SVG_PATHS.EYE_CY);
        eyeWhite.setAttribute("r", SVG_PATHS.EYE_R);
        eyeWhite.setAttribute("fill", "white");
        g.appendChild(eyeWhite);

        /* Pupil */
        const pupil = document.createElementNS(ns, "circle");
        pupil.setAttribute("cx", SVG_PATHS.PUPIL_CX);
        pupil.setAttribute("cy", SVG_PATHS.PUPIL_CY);
        pupil.setAttribute("r", SVG_PATHS.PUPIL_R);
        pupil.setAttribute("fill", "#1a1a1a");
        pupil.classList.add('bird-pupil');
        g.appendChild(pupil);

        /* Eye shine */
        const shine = document.createElementNS(ns, "circle");
        shine.setAttribute("cx", String(Number(SVG_PATHS.PUPIL_CX) + 0.4));
        shine.setAttribute("cy", String(Number(SVG_PATHS.PUPIL_CY) - 0.4));
        shine.setAttribute("r", "0.4");
        shine.setAttribute("fill", "white");
        g.appendChild(shine);

        /* Blush cheek */
        const blush = document.createElementNS(ns, "ellipse");
        blush.setAttribute("cx", SVG_PATHS.BLUSH_CX);
        blush.setAttribute("cy", SVG_PATHS.BLUSH_CY);
        blush.setAttribute("rx", SVG_PATHS.BLUSH_RX);
        blush.setAttribute("ry", SVG_PATHS.BLUSH_RY);
        blush.setAttribute("fill", palette.blush);
        blush.setAttribute("opacity", "0.4");
        g.appendChild(blush);

        /* Legs */
        const legL = document.createElementNS(ns, "path");
        legL.setAttribute("d", SVG_PATHS.PERCH_LEG_L);
        legL.setAttribute("fill", palette.legs);
        g.appendChild(legL);

        const legR = document.createElementNS(ns, "path");
        legR.setAttribute("d", SVG_PATHS.PERCH_LEG_R);
        legR.setAttribute("fill", palette.legs);
        g.appendChild(legR);

        /* Feet */
        const footL = document.createElementNS(ns, "path");
        footL.setAttribute("d", SVG_PATHS.PERCH_LEG_FOOT_L);
        footL.setAttribute("fill", palette.legs);
        g.appendChild(footL);

        const footR = document.createElementNS(ns, "path");
        footR.setAttribute("d", SVG_PATHS.PERCH_LEG_FOOT_R);
        footR.setAttribute("fill", palette.legs);
        g.appendChild(footR);

        return g;
    }

    /* ---- Flying Pose ---- */
    function createFlyPose(ns, palette) {
        const g = document.createElementNS(ns, "g");

        /* Tail */
        const tail = document.createElementNS(ns, "path");
        tail.setAttribute("d", SVG_PATHS.FLY_TAIL);
        tail.setAttribute("fill", palette.wing);
        g.appendChild(tail);

        /* Body */
        const body = document.createElementNS(ns, "path");
        body.setAttribute("d", SVG_PATHS.FLY_BODY);
        body.setAttribute("fill", palette.body);
        g.appendChild(body);

        /* Wing (animated between up/down) */
        const wing = document.createElementNS(ns, "path");
        wing.setAttribute("d", SVG_PATHS.FLY_WING_UP);
        wing.setAttribute("fill", palette.wing);
        wing.classList.add('fly-wing');
        g.appendChild(wing);

        /* Head */
        const head = document.createElementNS(ns, "path");
        head.setAttribute("d", SVG_PATHS.FLY_HEAD);
        head.setAttribute("fill", palette.head);
        g.appendChild(head);

        /* Beak */
        const beak = document.createElementNS(ns, "path");
        beak.setAttribute("d", SVG_PATHS.FLY_BEAK);
        beak.setAttribute("fill", palette.beak);
        g.appendChild(beak);

        /* Eye */
        const eye = document.createElementNS(ns, "circle");
        eye.setAttribute("cx", SVG_PATHS.EYE_CX);
        eye.setAttribute("cy", "11");
        eye.setAttribute("r", "1.5");
        eye.setAttribute("fill", "white");
        g.appendChild(eye);

        const pupil = document.createElementNS(ns, "circle");
        pupil.setAttribute("cx", String(Number(SVG_PATHS.PUPIL_CX)));
        pupil.setAttribute("cy", "11");
        pupil.setAttribute("r", "0.8");
        pupil.setAttribute("fill", "#1a1a1a");
        g.appendChild(pupil);

        return g;
    }

    /* ---- Startled Pose ---- */
    function createStartledPose(ns, palette) {
        const g = document.createElementNS(ns, "g");

        /* Body (puffed up) */
        const body = document.createElementNS(ns, "path");
        body.setAttribute("d", SVG_PATHS.STARTLED_BODY);
        body.setAttribute("fill", palette.body);
        g.appendChild(body);

        /* Wing (raised) */
        const wing = document.createElementNS(ns, "path");
        wing.setAttribute("d", SVG_PATHS.STARTLED_WING);
        wing.setAttribute("fill", palette.wing);
        g.appendChild(wing);

        /* Head (bigger, alarmed) */
        const head = document.createElementNS(ns, "path");
        head.setAttribute("d", SVG_PATHS.STARTLED_HEAD);
        head.setAttribute("fill", palette.head);
        g.appendChild(head);

        /* Big alarmed eyes */
        const eyeWhite = document.createElementNS(ns, "circle");
        eyeWhite.setAttribute("cx", "26");
        eyeWhite.setAttribute("cy", "8");
        eyeWhite.setAttribute("r", "3");
        eyeWhite.setAttribute("fill", "white");
        g.appendChild(eyeWhite);

        const pupil = document.createElementNS(ns, "circle");
        pupil.setAttribute("cx", "27");
        pupil.setAttribute("cy", "8");
        pupil.setAttribute("r", "1.5");
        pupil.setAttribute("fill", "#1a1a1a");
        g.appendChild(pupil);

        /* Exclamation lines above head */
        const line1 = document.createElementNS(ns, "line");
        line1.setAttribute("x1", "24"); line1.setAttribute("y1", "0");
        line1.setAttribute("x2", "22"); line1.setAttribute("y2", "3");
        line1.setAttribute("stroke", palette.head);
        line1.setAttribute("stroke-width", "1");
        line1.setAttribute("stroke-linecap", "round");
        g.appendChild(line1);

        const line2 = document.createElementNS(ns, "line");
        line2.setAttribute("x1", "28"); line2.setAttribute("y1", "0");
        line2.setAttribute("x2", "29"); line2.setAttribute("y2", "3");
        line2.setAttribute("stroke", palette.head);
        line2.setAttribute("stroke-width", "1");
        line2.setAttribute("stroke-linecap", "round");
        g.appendChild(line2);

        /* Beak (open, chirping) */
        const beakTop = document.createElementNS(ns, "path");
        beakTop.setAttribute("d", "M31 8l4-3-3 2z");
        beakTop.setAttribute("fill", palette.beak);
        g.appendChild(beakTop);

        const beakBot = document.createElementNS(ns, "path");
        beakBot.setAttribute("d", "M31 10l3 1-3-0z");
        beakBot.setAttribute("fill", palette.beak);
        g.appendChild(beakBot);

        /* Blush (embarrassed) */
        const blush = document.createElementNS(ns, "ellipse");
        blush.setAttribute("cx", "29");
        blush.setAttribute("cy", "13");
        blush.setAttribute("rx", "3");
        blush.setAttribute("ry", "1.5");
        blush.setAttribute("fill", palette.blush);
        blush.setAttribute("opacity", "0.5");
        g.appendChild(blush);

        return g;
    }

    /* ==============================
       POSE SWITCHING
       ============================== */
    function setPose(bird, pose) {
        const poses = bird.querySelectorAll('.bird-pose');
        poses.forEach(p => p.style.display = 'none');

        const target = bird.querySelector(`.pose-${pose}`);
        if (target) target.style.display = 'block';

        bird.classList.remove('perched', 'flying', 'startled');
        bird.classList.add(pose === 'perch' ? 'perched' : pose === 'fly' ? 'flying' : 'startled');
    }

    /* ==============================
       WING FLAP ANIMATION (flying)
       ============================== */
    function startWingFlap(bird) {
        const flyWing = bird.querySelector('.pose-fly .fly-wing');
        if (!flyWing) return null;

        let flapUp = true;
        const interval = setInterval(() => {
            flyWing.setAttribute("d", flapUp ? SVG_PATHS.FLY_WING_DOWN : SVG_PATHS.FLY_WING_UP);
            flapUp = !flapUp;
        }, 150);

        return interval;
    }

    /* ==============================
       FLY BIRD TO POSITION
       ============================== */
    function flyTo(bird, x, y, onComplete) {
        const prevX = parseFloat(bird.dataset.x || window.innerWidth / 2);
        const scaleX = x < prevX ? -1 : 1;

        /* Switch to flying pose */
        setPose(bird, 'fly');
        const flapInterval = startWingFlap(bird);

        if (typeof gsap !== 'undefined') {
            gsap.to(bird, {
                x: x,
                y: y,
                scaleX: scaleX,
                duration: 1.0 + Math.random() * 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    clearInterval(flapInterval);
                    setPose(bird, 'perch');
                    bird.dataset.x = x;
                    bird.dataset.y = y;
                    if (onComplete) onComplete();
                }
            });
        } else {
            bird.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bird.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX})`;
            bird.dataset.x = x;
            bird.dataset.y = y;
            setTimeout(() => {
                clearInterval(flapInterval);
                setPose(bird, 'perch');
                if (onComplete) onComplete();
            }, 1200);
        }
    }

    /* ==============================
       CLICK INTERACTION
       ============================== */
    function handleBirdClick(bird) {
        if (bird.dataset.clicking === 'true') return;
        bird.dataset.clicking = 'true';

        const currentX = parseFloat(bird.dataset.x || 0);
        const currentY = parseFloat(bird.dataset.y || 0);

        /* Show startled pose briefly */
        setPose(bird, 'startled');

        if (typeof gsap !== 'undefined') {
            /* Jump up and back down */
            gsap.timeline()
                .to(bird, {
                    y: currentY - CONFIG.BIRD_CLICK_JUMP_HEIGHT,
                    duration: 0.2,
                    ease: "power2.out"
                })
                .to(bird, {
                    y: currentY,
                    duration: 0.3,
                    ease: "bounce.out",
                    onComplete: () => {
                        setPose(bird, 'perch');
                        setTimeout(() => {
                            bird.dataset.clicking = 'false';
                        }, CONFIG.BIRD_CLICK_COOLDOWN);
                    }
                })
                /* Small head tilt during the jump */
                .to(bird, {
                    rotation: 10,
                    duration: 0.15,
                    ease: "power1.out"
                }, 0)
                .to(bird, {
                    rotation: 0,
                    duration: 0.2,
                    ease: "power1.inOut"
                }, 0.2);
        } else {
            setTimeout(() => {
                setPose(bird, 'perch');
                bird.dataset.clicking = 'false';
            }, 600);
        }
    }

    /* ==============================
       STARTLED FLIGHT (hover near)
       ============================== */
    function startleBird(bird) {
        if (bird.dataset.startled === 'true') return;
        bird.dataset.startled = 'true';

        /* Brief startled pose */
        setPose(bird, 'startled');

        setTimeout(() => {
            const exitX = Math.random() > 0.5
                ? window.innerWidth + 100
                : -100;
            const exitY = -(Math.random() * 200 + 100);

            flyTo(bird, exitX, exitY, () => {
                setTimeout(() => {
                    bird.dataset.startled = 'false';
                    repositionSingleBird(bird);
                }, CONFIG.BIRD_SETTLE_DELAY);
            });
        }, 300); /* Show startled face for 300ms before flying away */
    }

    /* ==============================
       PERCH MANAGEMENT
       ============================== */
    function getVisiblePerches() {
        return Array.from(perchSpots).filter(p => {
            const rect = p.getBoundingClientRect();
            return rect.top >= -50 && rect.bottom <= window.innerHeight + 50;
        });
    }

    function repositionSingleBird(bird) {
        const visible = getVisiblePerches();
        if (visible.length === 0) return;

        const perch = visible[Math.floor(Math.random() * visible.length)];
        const rect = perch.getBoundingClientRect();
        const targetX = rect.left + (Math.random() * 30 - 15);
        const targetY = rect.top - (Math.random() * 15 + 5);

        flyTo(bird, targetX, targetY);
    }

    function repositionAllBirds() {
        const visible = getVisiblePerches();
        if (visible.length === 0) return;

        companionBirds.forEach((bird, index) => {
            if (bird.dataset.startled === 'true') return;
            if (bird.dataset.clicking === 'true') return;

            const perch = visible[index % visible.length];
            const rect = perch.getBoundingClientRect();
            const targetX = rect.left + (Math.random() * 30 - 15);
            const targetY = rect.top - (Math.random() * 15 + 5);

            /* Stagger the flights so they don't all move at once */
            setTimeout(() => {
                flyTo(bird, targetX, targetY);
            }, index * 200);
        });
    }

    /* ==============================
       BLINK ANIMATION (periodic)
       ============================== */
    function startBlinking() {
        setInterval(() => {
            companionBirds.forEach(bird => {
                if (!bird.classList.contains('perched')) return;
                if (Math.random() > 0.4) return; /* only some birds blink */

                const pupils = bird.querySelectorAll('.bird-pupil');
                const eyes = bird.querySelectorAll('.pose-perch circle[fill="white"]');

                /* Squint eyes shut */
                eyes.forEach(eye => {
                    const origR = eye.getAttribute('r');
                    eye.setAttribute('r', '0.3');
                    setTimeout(() => eye.setAttribute('r', origR), 200);
                });
                pupils.forEach(p => {
                    p.style.opacity = '0';
                    setTimeout(() => p.style.opacity = '1', 200);
                });
            });
        }, 3000);
    }

    /* ==============================
       MOUSE PROXIMITY CHECK
       ============================== */
    function checkMouseProximity() {
        if (!isMouseTracking) return;

        companionBirds.forEach(bird => {
            if (bird.dataset.startled === 'true') return;
            if (bird.dataset.clicking === 'true') return;
            if (!bird.classList.contains('perched')) return;

            const bx = parseFloat(bird.dataset.x || 0);
            const by = parseFloat(bird.dataset.y || 0);
            const dist = Math.hypot(mouseX - bx, mouseY - by);

            if (dist < CONFIG.BIRD_STARTLE_RADIUS) {
                startleBird(bird);
            }
        });

        proximityRAF = requestAnimationFrame(checkMouseProximity);
    }

    /* ==============================
       SCROLL HANDLER
       ============================== */
    function onScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(repositionAllBirds, CONFIG.BIRD_REPOSITION_DEBOUNCE);
    }

    /* ==============================
       INITIALIZE
       ============================== */
    function init() {
        document.addEventListener('cafe:entered', () => {
            try {
                perchSpots = document.querySelectorAll('.perch');

                const isMobile = window.innerWidth < CONFIG.MOBILE_WIDTH;
                const count = isMobile ? CONFIG.BIRD_COUNT_MOBILE : CONFIG.BIRD_COUNT_DESKTOP;

                for (let i = 0; i < count; i++) {
                    const size = Math.random() * 10 + 28; // 28–38px
                    const bird = createBirdSVG(i, size);
                    document.body.appendChild(bird);

                    /* Start off-screen */
                    const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
                    if (typeof gsap !== 'undefined') {
                        gsap.set(bird, { x: startX, y: -80 });
                    } else {
                        bird.style.transform = `translate(${startX}px, -80px)`;
                    }
                    bird.dataset.x = startX;
                    bird.dataset.y = -80;
                    bird.dataset.startled = 'false';
                    bird.dataset.clicking = 'false';

                    /* Click handler */
                    bird.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleBirdClick(bird);
                    });

                    companionBirds.push(bird);
                }

                /* Initial flight to perches (staggered) */
                setTimeout(() => repositionAllBirds(), 600);

                /* Start periodic blinking */
                startBlinking();

                /* Scroll listener */
                window.addEventListener('scroll', onScroll, { passive: true });

                /* Mouse tracking for startle (desktop only) */
                if (!('ontouchstart' in window)) {
                    isMouseTracking = true;
                    document.addEventListener('mousemove', (e) => {
                        mouseX = e.clientX;
                        mouseY = e.clientY;
                    }, { passive: true });
                    proximityRAF = requestAnimationFrame(checkMouseProximity);
                }

            } catch (err) {
                console.warn('[BirdsModule] Failed to initialize:', err);
            }
        });
    }

    return { init };
})();
