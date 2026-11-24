
const API_URL = 'https://gandhigpt-api.onrender.com';

const form = document.getElementById('promptForm');
const input = document.getElementById('promptInput');
const chatBody = document.getElementById('chatBody');
const clearButton = document.getElementById('clearButton');
const charCount = document.getElementById('charCount');

let isGenerating = false;

// Update character counter and textarea height.
function updateCount() {
  charCount.textContent = `${input.value.length} / 500`;

  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
}

input.addEventListener('input', updateCount);

// Enter sends prompt; Shift + Enter creates a new line
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

// Handle suggested prompts
function useSuggestion(button) {
  input.value = button.dataset.prompt || '';
  updateCount();
  input.focus();
}

function attachSuggestionHandlers(container = document) {
  container.querySelectorAll('.suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      useSuggestion(button);
    });
  });
}

attachSuggestionHandlers();

// Scroll chat to the latest message
function scrollChatToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Add user's message
function addUserMessage(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-message';

  const paragraph = document.createElement('p');
  paragraph.textContent = text;

  wrapper.appendChild(paragraph);
  chatBody.appendChild(wrapper);

  scrollChatToBottom();
}

// Add GandhiGPT's response
function addAssistantMessage(labelText, messageText) {
  const wrapper = document.createElement('div');
  wrapper.className = 'generated-message';

  const mark = document.createElement('div');
  mark.className = 'assistant-mark';
  mark.textContent = 'G';

  const content = document.createElement('div');
  content.className = 'message-content';

  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = labelText;

  const paragraph = document.createElement('p');
  paragraph.textContent = messageText;

  content.append(label, paragraph);
  wrapper.append(mark, content);

  chatBody.appendChild(wrapper);

  scrollChatToBottom();

  return {
    wrapper,
    paragraph,
    label
  };
}

// Send prompt to the actual GandhiGPT model
async function generateText(prompt) {
  const message = addAssistantMessage(
    'GANDHIGPT IS THINKING',
    'Generating a continuation from the trained model...'
  );

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        prompt: prompt,
        tokens: 250
      })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        'The server returned an unreadable response.'
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error || `Server error: ${response.status}`
      );
    }

    if (
      typeof data.text !== 'string' ||
      !data.text.trim()
    ) {
      throw new Error(
        'The model returned an empty response. Try another prompt.'
      );
    }

    // Display actual model output
    message.label.textContent =
      'GANDHIGPT · GENERATED TEXT';

    message.paragraph.textContent = data.text;

  } catch (error) {
    message.label.textContent = 'CONNECTION ERROR';

    message.paragraph.textContent =
      `${error.message} If the server has been idle, wait a little and try again.`;

    message.wrapper.classList.add('error-message');
  }

  scrollChatToBottom();
}

// Submit prompt
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = input.value.trim();

  if (!prompt || isGenerating) {
    return;
  }

  isGenerating = true;

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.disabled = true;
  }

  input.disabled = true;

  // Show user's prompt
  addUserMessage(prompt);

  input.value = '';
  updateCount();

  // Generate model response
  await generateText(prompt);

  // Re-enable input
  isGenerating = false;

  input.disabled = false;

  if (submitButton) {
    submitButton.disabled = false;
  }

  input.focus();
});

// Clear conversation
clearButton.addEventListener('click', () => {
  if (isGenerating) {
    return;
  }

  chatBody.innerHTML = `
    <div class="welcome-message">

      <div class="assistant-mark">G</div>

      <div class="message-content">

        <div class="message-label">
          A NOTE FROM THE MODEL
        </div>

        <p>
          Welcome. Give me a phrase to begin with.
          I’ll use patterns learned from the training text
          to attempt a continuation.
        </p>

        <div class="suggestion-row">

          <button
            class="suggestion"
            type="button"
            data-prompt="Truth and non-violence">
            Truth and non-violence
          </button>

          <button
            class="suggestion"
            type="button"
            data-prompt="The meaning of freedom">
            The meaning of freedom
          </button>

        </div>

      </div>

    </div>
  `;

  attachSuggestionHandlers(chatBody);
});


/* =========================================
   GANDHIGPT DARK / LIGHT MODE
========================================= */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

// Read saved theme preference
function getSavedTheme() {
  try {
    return localStorage.getItem('gandhigpt-theme');
  } catch {
    return null;
  }
}

// Apply selected theme
function applyTheme(theme) {
  document.body.dataset.theme = theme;

  const isDark = theme === 'dark';

  themeIcon.textContent = isDark ? '☀' : '☾';
  themeText.textContent = isDark ? 'Light mode' : 'Dark mode';

  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );

  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      'content',
      isDark ? '#20251f' : '#eee9dc'
    );

  try {
    localStorage.setItem('gandhigpt-theme', theme);
  } catch {
    // Theme still works for this visit if storage is unavailable.
  }
}

// Start with saved theme, otherwise light mode
const savedTheme = getSavedTheme();
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

// Toggle theme when clicked
themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme;

  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});



/* =========================================
   GANDHIGPT — SCROLL REVEAL ANIMATIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = [
    ".hero",
    ".workspace-section",
    ".about-section",
    ".details-section",
    ".architecture-grid",
    ".training-grid",
    ".limitations-section",
    ".footer"
  ];

  revealElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add("reveal");
    });
  });

  const elements = document.querySelectorAll(".reveal");

  // Show everything immediately if reduced motion is preferred
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(element => observer.observe(element));
});



/* =========================================
   GANDHIGPT — PARALLAX ENGINE
========================================= */

(() => {
  const hero = document.querySelector(".hero");
  const heroArt = document.querySelector(".hero-art");
  const artCard = document.querySelector(".art-card");
  const seal = document.querySelector(".floating-seal");
  const ambientOne = document.querySelector(".ambient-one");
  const ambientTwo = document.querySelector(".ambient-two");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reduceMotion.matches || !heroArt || !artCard) return;

  // Keep the effect disabled on touch devices.
  const canUsePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let scrollY = window.scrollY;
  let animationFrame = null;

  function handlePointerMove(event) {
    const bounds = heroArt.getBoundingClientRect();

    mouseX = (
      (event.clientX - bounds.left) / bounds.width - 0.5
    ) * 2;

    mouseY = (
      (event.clientY - bounds.top) / bounds.height - 0.5
    ) * 2;

    mouseX = Math.max(-1, Math.min(1, mouseX));
    mouseY = Math.max(-1, Math.min(1, mouseY));

    requestAnimationFrame(updateParallax);
  }

  function handlePointerLeave() {
    mouseX = 0;
    mouseY = 0;
    requestAnimationFrame(updateParallax);
  }

  function handleScroll() {
    scrollY = window.scrollY;
    requestAnimationFrame(updateParallax);
  }

  function updateParallax() {
    // Gentle mouse movement
    const targetX = mouseX * 9;
    const targetY = mouseY * 7;

    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    heroArt.style.setProperty("--parallax-x", `${currentX * 0.35}px`);
    heroArt.style.setProperty("--parallax-y", `${currentY * 0.35}px`);

    artCard.style.setProperty("--card-x", `${currentX * 0.25}px`);
    artCard.style.setProperty("--card-y", `${currentY * 0.25}px`);

    artCard.style.setProperty(
      "--card-rotate-y",
      `${currentX * 0.45}deg`
    );

    artCard.style.setProperty(
      "--card-rotate-x",
      `${-currentY * 0.35}deg`
    );

    if (seal) {
      seal.style.setProperty("--seal-x", `${currentX * -0.5}px`);
      seal.style.setProperty("--seal-y", `${currentY * -0.5}px`);
    }

    // Background moves at a different speed while scrolling
    const backgroundOffset = Math.min(scrollY, 700);

    if (ambientOne) {
      ambientOne.style.setProperty(
        "--ambient-one-x",
        `${backgroundOffset * 0.035}px`
      );
      ambientOne.style.setProperty(
        "--ambient-one-y",
        `${backgroundOffset * -0.09}px`
      );
    }

    if (ambientTwo) {
      ambientTwo.style.setProperty(
        "--ambient-two-x",
        `${backgroundOffset * -0.025}px`
      );
      ambientTwo.style.setProperty(
        "--ambient-two-y",
        `${backgroundOffset * -0.045}px`
      );
    }
  }

  if (canUsePointer) {
    heroArt.addEventListener("pointermove", handlePointerMove);
    heroArt.addEventListener("pointerleave", handlePointerLeave);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  updateParallax();
})();
