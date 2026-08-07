document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById('toast');

  // Web Share API Implementation for Hub Page
  window.shareSite = function() {
    const shareData = {
      title: 'SlimeSpace — Gaming Utilities & Web Tools Hub',
      text: 'Explore custom web utilities and gaming resources developed by Vile Tempest Official!',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError') {
          copyShareFallback();
        }
      });
    } else {
      copyShareFallback();
    }
  };

  function copyShareFallback() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Hub link copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy link", true);
    });
  }

  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.backgroundColor = isError ? 'var(--accent-red)' : 'var(--accent-cyan)';
    toastEl.style.color = isError ? '#ffffff' : '#070c18';
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }
});
