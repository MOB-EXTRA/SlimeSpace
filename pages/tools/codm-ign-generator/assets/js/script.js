const SPACES = {
  nbsp: '\u00A0',
  hangul: '\u3164',
  braille: '\u2800',
  enquad: '\u2000'
};

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById('ignInput');
  const spaceSelect = document.getElementById('spaceType');
  const toastEl = document.getElementById('toast');
  const counterEl = document.getElementById('charCounter');

  // Early return if core generator elements are missing (e.g. on legal.html)
  if (!inputEl || !spaceSelect || !toastEl || !counterEl) return;

  function updateCharCounter() {
    const currentLength = inputEl.value.length;
    counterEl.textContent = `${currentLength} / 14 chars`;
    counterEl.style.color = currentLength >= 14 ? 'var(--danger-color)' : 'var(--text-dim)';
  }

  inputEl.addEventListener('input', updateCharCounter);

  window.insertSpace = function() {
    if (inputEl.value.length >= 14) {
      showToast("Maximum length reached (14 chars)", true);
      return;
    }

    const selectedType = spaceSelect.value;
    const spaceChar = SPACES[selectedType] || SPACES.nbsp;
    
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const text = inputEl.value;

    inputEl.value = text.substring(0, start) + spaceChar + text.substring(end);

    if (inputEl.value.length > 14) {
      inputEl.value = inputEl.value.substring(0, 14);
    }

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
    const spaceChar = SPACES[selectedType] || SPACES.nbsp;

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

  window.shareSite = function() {
    const shareUrl = 'https://mob-extra.github.io/SlimeSpace/pages/tools/codm-ign-generator/';
    const shareData = {
      title: 'CODM Invisible Space & Name Formatter — SlimeSpace',
      text: 'Generate clean Unicode spaces tailored for Call of Duty: Mobile IGN customization!',
      url: shareUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
          copyShareFallback();
        }
      });
    } else {
      copyShareFallback();
    }
  };

  function copyShareFallback() {
    const shareUrl = 'https://mob-extra.github.io/SlimeSpace/pages/tools/codm-ign-generator/';
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Tool link copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy tool link", true);
    });
  }

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
