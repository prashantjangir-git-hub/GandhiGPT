const form = document.getElementById('promptForm');
const input = document.getElementById('promptInput');
const chatBody = document.getElementById('chatBody');
const clearButton = document.getElementById('clearButton');
const charCount = document.getElementById('charCount');

function updateCount() {
  charCount.textContent = `${input.value.length} / 500`;
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
}
input.addEventListener('input', updateCount);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll('.suggestion').forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.dataset.prompt || '';
    updateCount();
    input.focus();
  });
});

function addUserMessage(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-message';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  wrapper.appendChild(paragraph);
  chatBody.appendChild(wrapper);
}

function addNotice() {
  const wrapper = document.createElement('div');
  wrapper.className = 'generated-message';
  const mark = document.createElement('div');
  mark.className = 'assistant-mark';
  mark.textContent = 'G';
  const content = document.createElement('div');
  content.className = 'message-content';
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = 'MODEL CONNECTION';
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Your prompt has been entered, but live generation is not connected yet. This GitHub Pages site is the frontend only. In the next stage, we will connect it to a Python backend that loads your trained GandhiGPT checkpoint.';
  content.append(label, paragraph);
  wrapper.append(mark, content);
  chatBody.appendChild(wrapper);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  addUserMessage(prompt);
  addNotice();
  input.value = '';
  updateCount();
  chatBody.scrollTop = chatBody.scrollHeight;
});

clearButton.addEventListener('click', () => {
  chatBody.innerHTML = `<div class="welcome-message">
    <div class="assistant-mark">G</div>
    <div class="message-content">
      <div class="message-label">A NOTE FROM THE MODEL</div>
      <p>Welcome. Give me a phrase to begin with. I’ll use patterns learned from the training text to attempt a continuation.</p>
      <div class="suggestion-row">
        <button class="suggestion" type="button" data-prompt="Truth and non-violence">Truth and non-violence</button>
        <button class="suggestion" type="button" data-prompt="The meaning of freedom">The meaning of freedom</button>
      </div>
    </div>
  </div>`;
  chatBody.querySelectorAll('.suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.prompt || '';
      updateCount();
      input.focus();
    });
  });
});
