/* ============================================
   CONFIG — Constants, SVG paths, settings
   ============================================ */

const CONFIG = Object.freeze({
    /* ---- Mobile Breakpoint ---- */
    MOBILE_WIDTH: 768,

    /* ---- Dust Motes (Landing) ---- */
    DUST_COUNT: 30,

    /* ---- Bird Burst (Transition) ---- */
    BURST_BIRD_COUNT: 12,
    BURST_DIRECTIONS: ['fly-right', 'fly-left', 'fly-up'],

    /* ---- Companion Birds ---- */
    BIRD_COUNT_DESKTOP: 5,
    BIRD_COUNT_MOBILE: 3,
    BIRD_STARTLE_RADIUS: 100,  // px — how close mouse must be to startle
    BIRD_SETTLE_DELAY: 3000,   // ms — how long before bird returns to a perch
    BIRD_REPOSITION_DEBOUNCE: 500, // ms — debounce for scroll repositioning
    BIRD_CLICK_JUMP_HEIGHT: 25,    // px — how high bird jumps on click
    BIRD_CLICK_COOLDOWN: 800,      // ms — prevent click spam

    /* ---- Falling Leaves ---- */
    LEAF_COUNT_DESKTOP: 15,
    LEAF_COUNT_MOBILE: 8,
    WIND_GUST_INTERVAL: 15000, // ms

    /* ---- Modal ---- */
    MODAL_AUTO_DISMISS: 5000,  // ms

    /* ---- Transition Timeline ---- */
    FLIP_DURATION: 1500,       // ms — matches CSS transition
    CONTENT_FADE_DELAY: 300,   // ms
    CLEANUP_DELAY: 1500,       // ms — when to hide landing wrapper
    ENV_INIT_DELAY: 2000,      // ms — when to spawn leaves + birds
});

/* ---- SVG Paths: Ghibli-Style Sparrow ---- */
/*
   The bird is drawn in a 40x40 viewBox.
   It's a cute, round-bodied sparrow with:
   - Round body, chubby belly
   - Small head with big round eye
   - Short triangular beak
   - Curved wing (resting and flapping states)
   - Tail feathers
   - Two tiny legs
*/
const SVG_PATHS = Object.freeze({

    /* ---- PERCHING (sitting) pose ---- */
    PERCH_BODY:     "M20 14c-6 0-11 3-13 7-1 2-1 5 1 7 2 3 5 5 9 5h6c4 0 7-2 9-5 2-2 2-5 1-7-2-4-7-7-13-7z",
    PERCH_HEAD:     "M28 11c0-4-3-7-7-7s-7 3-7 7 3 6 7 6 7-2 7-6z",
    PERCH_WING:     "M10 18c-1 1 0 4 2 6 2 2 5 3 7 2 1-1 1-3-1-5-2-3-6-5-8-3z",
    PERCH_TAIL:     "M8 26c-3 2-5 5-4 6s3 0 5-2c2-1 3-3 2-4-1-2-2-1-3 0z",
    PERCH_BEAK:     "M30 10l4-2-3 3z",
    PERCH_LEG_L:    "M18 32l-1 5 2 0 0-5z",
    PERCH_LEG_R:    "M24 32l-1 5 2 0 0-5z",
    PERCH_LEG_FOOT_L: "M16 37l3 0 0-1-3 0z",
    PERCH_LEG_FOOT_R: "M23 37l3 0 0-1-3 0z",

    /* Eye: big and expressive */
    EYE_CX: 25,
    EYE_CY: 9,
    EYE_R:  2,
    PUPIL_CX: 26,
    PUPIL_CY: 9,
    PUPIL_R:  1,

    /* Cheek blush (cute touch) */
    BLUSH_CX: 28,
    BLUSH_CY: 14,
    BLUSH_RX: 2.5,
    BLUSH_RY: 1.5,

    /* ---- FLYING pose ---- */
    FLY_BODY:       "M20 16c-5 0-9 2-11 5-1 2-1 4 1 6 2 2 5 4 8 4h4c3 0 6-2 8-4 1-2 1-4 0-6-2-3-5-5-10-5z",
    FLY_HEAD:       "M28 13c0-3-3-6-6-6s-6 3-6 6 3 5 6 5 6-2 6-5z",
    FLY_WING_UP:    "M8 12c-3-4-5-8-4-10s4-1 7 2c2 2 3 5 2 7-1 2-3 3-5 1z",
    FLY_WING_DOWN:  "M8 20c-3 3-5 7-4 9s4 1 7-1c2-2 3-5 2-7-1-2-3-3-5-1z",
    FLY_TAIL:       "M7 23c-2 1-4 4-3 5s3 0 4-2c1-1 2-2 1-3 0-1-1-1-2 0z",
    FLY_BEAK:       "M30 12l4-2-3 3z",

    /* ---- STARTLED (puffed up, alarmed) ---- */
    STARTLED_BODY:  "M20 13c-7 0-12 3-14 8-1 3-1 6 1 8 3 3 6 5 10 5h7c5 0 8-2 10-5 2-3 2-6 1-8-2-5-8-8-15-8z",
    STARTLED_HEAD:  "M29 10c0-5-4-8-8-8s-8 4-8 8 4 7 8 7 8-2 8-7z",
    STARTLED_WING:  "M9 18c-2 1-1 5 2 7 3 2 6 3 8 2 1-1 1-3-1-6-3-3-7-5-9-3z",

    /* ---- Leaf varieties (for falling leaves) ---- */
    LEAVES: [
        "M6 1C3 4 1 8 1 12s2 7 5 9c1-3 3-6 3-10S8 3 6 1z",
        "M5 0C3 3 2 7 2 11s1 6 3 8c1-2 2-5 2-8S6 3 5 0z",
        "M6 2C4 3 2 5 2 8s2 5 4 6c2-1 4-3 4-6S8 3 6 2z",
    ],
});

/* ---- Bird Color Palettes (each bird gets one) ---- */
const BIRD_PALETTES = Object.freeze([
    { body: '#8B7355', head: '#6B5740', wing: '#A0896C', belly: '#D4C4A8', beak: '#E8A830', legs: '#D4A373', blush: '#E8B0A0' },
    { body: '#7A8B6F', head: '#5C6B50', wing: '#8FA080', belly: '#C8D4B8', beak: '#D4A030', legs: '#A08060', blush: '#D0A898' },
    { body: '#6B7B8B', head: '#4C5C6B', wing: '#8090A0', belly: '#B8C4D0', beak: '#E0A040', legs: '#908070', blush: '#D4AAAA' },
    { body: '#9B7B65', head: '#7B5B45', wing: '#B09580', belly: '#E0D0C0', beak: '#E8B040', legs: '#C09878', blush: '#E8B8A8' },
    { body: '#7B7565', head: '#5B5545', wing: '#958F80', belly: '#D8D0C0', beak: '#D4A840', legs: '#A89878', blush: '#D8B0A0' },
]);

/* ---- Gallery Data ---- */
const GALLERY_IMAGES = Object.freeze([
    { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800", alt: "Cozy cafe interior with hanging plants", caption: "Our Greenhouse Room" },
    { src: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800", alt: "Latte art being poured", caption: "Crafted with Care" },
    { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800", alt: "Coffee beans being roasted", caption: "Small-Batch Roasting" },
    { src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800", alt: "Sunlit reading nook with books", caption: "The Reading Nook" },
    { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800", alt: "Coffee cup on wooden table by window", caption: "Morning Light" },
    { src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800", alt: "Fresh pastries on display", caption: "Daily Bakes" },
]);

/* ---- Testimonials Data ---- */
const TESTIMONIALS = Object.freeze([
    { quote: "Walking into The Whispering Vine feels like stepping into a living storybook. The matcha latte is heavenly.", name: "Priya Sharma", role: "Regular since 2024", avatar: "https://images.unsplash.com/photo-1581404094774-cddbb4fdb446?auto=format&fit=crop&q=80&w=100" },
    { quote: "I've written my entire novel in the corner booth. The ambiance, the coffee, the gentle birdsong — it's a creative sanctuary.", name: "Rahul Verma", role: "Author & Dreamer", avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=100" },
    { quote: "The lavender honey scone changed my life. I'm not being dramatic. Every Saturday morning, without fail.", name: "Anjali Patel", role: "Weekend Devotee", avatar: "https://images.unsplash.com/photo-1592009309602-1dde752490ae?auto=format&fit=crop&q=80&w=100" },
]);

/* ---- Leaf Colors ---- */
const LEAF_COLORS = Object.freeze([
    '#6B8E7B', '#A3BCA9', '#7FA08B', '#D4A373', '#C9A94E',
]);
