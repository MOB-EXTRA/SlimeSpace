const SPACES = {
  hangul: '\u3164',
  nbsp: '\u00A0',
  braille: '\u2800',
  enquad: '\u2000'
};

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById('ignInput');
  const spaceSelect = document.getElementById('spaceType');
  const toastEl = document.getElementById('toast');
  const counterEl = document.getElementById('charCounter');

  if (!inputEl) return;

  function updateCharCounter() {
    const currentLength = inputEl.value.length;
    counterEl.textContent = `${currentLength} / 14 chars`;
    counterEl.style.color = currentLength >= 14 ? 'var(--danger-color)' : 'var(--text-dim)';
  }

  inputEl.addEventListener('input', updateCharCounter);

  window.insertSpace = function() {
    const selectedType = spaceSelect.value;
    const spaceChar = SPACES[selectedType] || SPACES.hangul;
    
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const text = inputEl.value;

    inputEl.value = text.substring(0, start) + spaceChar + text.substring(end);
    updateCharCounter();
    inputEl.focus();
    inputEl.setSelectionRange(start + spaceChar.length, start + spaceChar.length);
  };

  window.copyIGN = function() {
    if (!inputEl.value) {
      showToast("Please enter an IGN first!", true);
      return;
    }
    navigator.clipboard.writeText(inputEl.value).then(() => {
      showToast("Full IGN copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy", true);
    });
  };

  window.copySpaceOnly = function() {
    const selectedType = spaceSelect.value;
    const spaceChar = SPACES[selectedType] || SPACES.hangul;

    navigator.clipboard.writeText(spaceChar).then(() => {
      showToast("Space character copied!");
    }).catch(() => {
      showToast("Failed to copy", true);
    });
  };

  window.clearInput = function() {
    inputEl.value = '';
    updateCharCounter();
    inputEl.focus();
  };

  function showToast(message, isError = false) {
    toastEl.textContent = message;
    toastEl.style.backgroundColor = isError ? 'var(--danger-color)' : '#f8fafc';
    toastEl.style.color = isError ? '#ffffff' : '#070c18';
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }
});
