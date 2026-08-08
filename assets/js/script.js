document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById('toast');
  const searchInput = document.getElementById('utilitySearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const noResultsBox = document.getElementById('noResultsState');
  const searchWrapper = document.getElementById('stickySearchWrapper');

  // ==========================================
  // WEB SHARE API & TOAST NOTIFICATIONS
  // ==========================================
  
  // 1. Full Site Share
  window.shareSite = function() {
    const shareData = {
      title: 'SlimeSpace — Gaming Utilities & Web Tools Hub',
      text: 'Explore custom web utilities and gaming resources developed by Vile Tempest Official!',
      url: window.location.origin + window.location.pathname
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
          copyShareFallback(shareData.url, "Hub link copied to clipboard!");
        }
      });
    } else {
      copyShareFallback(shareData.url, "Hub link copied to clipboard!");
    }
  };

  // 2. Individual Utility Share with URL Search Query
  window.shareUtility = function(title, text, searchQuery) {
    const baseUrl = window.location.origin + window.location.pathname;
    const utilityShareUrl = `${baseUrl}?search=${encodeURIComponent(searchQuery)}`;
    
    const shareData = {
      title: `${title} — SlimeSpace`,
      text: `${text}\nCheck out this tool on SlimeSpace:`,
      url: utilityShareUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
          copyShareFallback(utilityShareUrl, "Utility link copied to clipboard!");
        }
      });
    } else {
      copyShareFallback(utilityShareUrl, "Utility link copied to clipboard!");
    }
  };

  function copyShareFallback(urlToCopy, successMsg) {
    navigator.clipboard.writeText(urlToCopy).then(() => {
      showToast(successMsg);
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

  // ==========================================
  // DYNAMIC STICKY SCROLL CONTROLLER
  // ==========================================
  if (searchWrapper) {
    let initialOffsetTop = searchWrapper.offsetTop;

    window.addEventListener('resize', () => {
      if (!searchWrapper.classList.contains('is-fixed')) {
        initialOffsetTop = searchWrapper.offsetTop;
      }
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY >= initialOffsetTop - 12) {
        searchWrapper.classList.add('is-fixed');
      } else {
        searchWrapper.classList.remove('is-fixed');
      }
    }, { passive: true });
  }

  // Helper function to smooth scroll search bar to top with offset
  function scrollToSearchBar() {
    if (!searchWrapper) return;
    
    setTimeout(() => {
      const offsetTop = searchWrapper.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }, 150);
  }

  // ==========================================
  // DYNAMIC SEARCH & URL FILTERING SYSTEM
  // ==========================================
  if (searchInput) {

    function filterUtilities(query, updateUrl = true) {
      const cleanQuery = query.trim().toLowerCase();
      
      if (clearBtn) {
        clearBtn.style.display = cleanQuery.length > 0 ? 'flex' : 'none';
      }

      const cards = document.querySelectorAll('.project-card');
      let visibleCount = 0;

      cards.forEach((card) => {
        const textContent = card.innerText.toLowerCase();
        
        if (textContent.includes(cleanQuery)) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResultsBox) {
        noResultsBox.style.display = (visibleCount === 0 && cleanQuery.length > 0) ? 'block' : 'none';
      }

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (cleanQuery) {
          url.searchParams.set('search', cleanQuery);
        } else {
          url.searchParams.delete('search');
          url.searchParams.delete('q');
        }
        window.history.replaceState({}, '', url.toString());
      }
    }

    // Scroll page to top room on tap/focus of search bar
    searchInput.addEventListener('focus', () => {
      scrollToSearchBar();
    });

    // Input Event Listener
    searchInput.addEventListener('input', (e) => {
      filterUtilities(e.target.value);
    });

    // Clear Button Event Listener
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterUtilities('');
        searchInput.focus();
      });
    }

    // Read Search Query from URL on Initial Page Load
    function loadSearchFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const queryFromUrl = urlParams.get('search') || urlParams.get('q');
      
      if (queryFromUrl) {
        searchInput.value = queryFromUrl;
        filterUtilities(queryFromUrl, false);
        
        // Automatically scroll search bar to top room if URL search query exists
        scrollToSearchBar();
      }
    }

    loadSearchFromURL();
  }
});
