/* FOLLOW THE CURSOR */
const CIRCLE_CONFIG = {
  colors: [
    "#004d1a", "#006622", "#008029", "#009933", "#00b33c",
    "#00cc44", "#00e64d", "#00ff55", "#1aff66", "#33ff77",
    "#4dff88", "#66ff99"
  ],
  smoothingFactor: 0.25, // Slightly reduced for smoother motion with more circles
  size: 20, // Smaller circles for better visual with increased count
  count: 70 // Doubled the circle count
};

const state = {
  coords: { x: 0, y: 0 },
  circles: null,
  animationFrame: null,
  isTouching: false
};

function createCircles() {
  const wrapper = document.querySelector('.wrapper');
  // Remove existing circles
  document.querySelectorAll('.circle').forEach(circle => circle.remove());
  
  // Create new circles
  for (let i = 0; i < CIRCLE_CONFIG.count; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    wrapper.appendChild(circle);
  }
}

function initializeCircles() {
  createCircles();
  state.circles = Array.from(document.querySelectorAll(".circle"));
  
  state.circles.forEach((circle, index) => {
    circle.x = 0;
    circle.y = 0;
    // Create gradient effect with opacity
    const opacity = 1 - (index / CIRCLE_CONFIG.count) * 0.6;
    circle.style.backgroundColor = CIRCLE_CONFIG.colors[index % CIRCLE_CONFIG.colors.length];
    circle.style.opacity = opacity;
  });
}

// Handle both mouse and touch events
function updateCoordinates(x, y) {
  state.coords.x = x;
  state.coords.y = y;
}

function handleMouseMove(e) {
  updateCoordinates(e.clientX, e.clientY);
}

function handleTouchMove(e) {
  e.preventDefault(); // Prevent scrolling while touching
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updateCoordinates(touch.clientX, touch.clientY);
    
    // Check for letters under the touch point
    const letters = document.querySelectorAll('.logo-letter');
    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      if (touch.clientX >= rect.left && 
          touch.clientX <= rect.right && 
          touch.clientY >= rect.top && 
          touch.clientY <= rect.bottom) {
        // Add glowing class instead of directly setting styles
        letter.classList.add('glowing');
      } else {
        // Remove glowing class
        letter.classList.remove('glowing');
      }
    });
  }
}

function handleTouchStart(e) {
  state.isTouching = true;
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updateCoordinates(touch.clientX, touch.clientY);
  }
}

function handleTouchEnd() {
  state.isTouching = false;
  // Remove glowing class from all letters when touch ends
  const letters = document.querySelectorAll('.logo-letter');
  letters.forEach(letter => {
    letter.classList.remove('glowing');
  });
}

function isNearLogo(x, y) {
  // We'll remove this function's content
  return true; // Always return true to keep logo visible
}

function animateCircles() {
  let x = state.coords.x;
  let y = state.coords.y;
  const { circles } = state;
  const { smoothingFactor, size } = CIRCLE_CONFIG;
  
  // Remove this visibility check since we want the logo always visible
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.opacity = '1'; // Always visible
  }

  circles.forEach((circle, index) => {
    // Calculate the scale factor
    const scale = (circles.length - index) / circles.length;
    
    // Center the circle on the cursor by adjusting for circle size
    const centerOffset = size / 2;
    
    // Apply the transform with centered position
    circle.style.transform = `translate(${x - centerOffset}px, ${y - centerOffset}px) scale(${scale})`;
    
    // Store current position for next circle's calculation
    circle.x = x;
    circle.y = y;

    // Calculate position for next circle
    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * smoothingFactor;
    y += (nextCircle.y - y) * smoothingFactor;
  });

  state.animationFrame = requestAnimationFrame(animateCircles);
}

function cleanup() {
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }
}

function wrapLogoLetters() {
  const logo = document.querySelector('.logo');
  const text = logo.textContent;
  logo.textContent = '';
  
  // Wrap each letter in a span with data-letter attribute
  text.split('').forEach(letter => {
    const span = document.createElement('span');
    span.className = 'logo-letter';
    span.textContent = letter;
    span.setAttribute('data-letter', letter); // Add data-letter attribute
    logo.appendChild(span);
  });
}

function init() {
  wrapLogoLetters();
  initializeCircles();
  
  // Add mouse event listeners
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  
  // Add touch event listeners
  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
  
  // Start animation
  animateCircles();
  
  // Cleanup on page unload
  window.addEventListener('unload', cleanup);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);



