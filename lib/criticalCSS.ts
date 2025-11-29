/**
 * Critical CSS extraction utility
 * Inline critical CSS for above-the-fold content
 */

export const criticalCSS = `
/* Critical CSS for above-the-fold content */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

html {
  color-scheme: dark;
  scroll-behavior: manual;
}

body {
  background-color: #030304;
  color: #ffffff;
  overflow-x: hidden;
  position: relative;
}

/* Critical layout styles */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Critical hero styles */
.bg-void {
  background-color: #030304;
}

.text-white {
  color: #ffffff;
}

.relative {
  position: relative;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-0 {
  z-index: 0;
}

.z-10 {
  z-index: 10;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.h-screen {
  height: 100vh;
}

.w-full {
  width: 100%;
}

.min-h-screen {
  min-height: 100vh;
}
`

/**
 * Generate critical CSS for a specific route
 */
export function getCriticalCSS(route: string): string {
  // Base critical CSS
  let css = criticalCSS

  // Add route-specific critical CSS
  switch (route) {
    case '/':
      css += `
        /* Home page specific critical styles */
        .text-6xl { font-size: 3.75rem; line-height: 1; }
        .text-8xl { font-size: 6rem; line-height: 1; }
        .text-9xl { font-size: 8rem; line-height: 1; }
        @media (min-width: 768px) {
          .md\\:text-8xl { font-size: 6rem; }
        }
        @media (min-width: 1024px) {
          .lg\\:text-9xl { font-size: 8rem; }
        }
      `
      break
    default:
      break
  }

  return css
}

