document.addEventListener("DOMContentLoaded", () => {
  // Remote PTB hub repo base URL
  const REPO_BASE = "https://mob-extra.github.io/CODM.TestServer.DL.Link/";
  
  const VERIFY_DATA_URL = `${REPO_BASE}data/notarobot.js`;
  const LINKS_DATA_URL = `${REPO_BASE}data/links.js`;

  let isUnlocked = false;
  let verifyData = null;
  let loadedServerData = null; // Holds info for sharing

  // DOM Elements
  const bodyEl = document.getElementById("pageBody");
  const ytAppBtn = document.getElementById("ytAppBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const verifyInput = document.getElementById("verificationInput");
  const errorMsg = document.getElementById("verifyErrorMsg");
  const serverInfoContainer = document.getElementById("serverInfoContainer");
  const linksGridContainer = document.getElementById("linksGridContainer");
  const gatewayBox = document.getElementById("verificationGateway");

  // Prevent Context Menu & Keyboard Copy Shortcuts before verification
  document.addEventListener("contextmenu", (e) => {
    if (!isUnlocked) {
      e.preventDefault();
      showToast("Access verification required.", true);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!isUnlocked) {
      if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'u' || e.key === 's')) {
        e.preventDefault();
      }
      if (e.key === 'F12') e.preventDefault();
    }
  });

  document.addEventListener("copy", (e) => {
    if (!isUnlocked) e.preventDefault();
  });

  document.addEventListener("selectstart", (e) => {
    if (!isUnlocked) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.closest('#verificationGateway'))) {
        return;
      }
      e.preventDefault();
    }
  });

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
  }

  async function initHubData() {
    try {
      await Promise.all([
        loadScript(VERIFY_DATA_URL),
        loadScript(LINKS_DATA_URL)
      ]);

      if (typeof notARobot !== "undefined") {
        verifyData = notARobot;
        if (ytAppBtn) ytAppBtn.href = verifyData.codeSource;
      }

      if (typeof testServerData !== "undefined") {
        loadedServerData = testServerData;
        renderServerData(testServerData);
      }

    } catch (err) {
      console.error(err);
      if (serverInfoContainer) {
        serverInfoContainer.innerHTML = `
          <p style="color: var(--codm-red); text-align: center;">Unable to load server data. Please try again later.</p>
        `;
      }
    }
  }

  // Dynamic Verification Logic
  if (verifyBtn) verifyBtn.addEventListener("click", handleVerification);
  if (verifyInput) {
    verifyInput.addEventListener("keypress", (e) => {
      if (e.key === 'Enter') handleVerification();
    });
  }

  function handleVerification() {
    const inputVal = verifyInput.value.trim();

    if (!verifyData) {
      showError("System initializing. Please wait.");
      return;
    }

    if (String(inputVal) === String(verifyData.code).trim()) {
      unlockHub();
    } else {
      showError("Incorrect code. Please check video guide.");
      verifyInput.value = "";
    }
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = "block";
    }
  }

  function unlockHub() {
    isUnlocked = true;
    if (bodyEl) {
      bodyEl.classList.remove("anti-select-body");
      bodyEl.removeAttribute("unselectable");
      bodyEl.removeAttribute("onselectstart");
    }
    if (linksGridContainer) linksGridContainer.classList.remove("locked");
    if (gatewayBox) gatewayBox.style.display = "none";
    
    // Smoothly scroll down to the Season 6 info container
    if (serverInfoContainer) {
      serverInfoContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    showToast("Verification successful!");
  }

  // Render Server Info & Download Cards
  function renderServerData(data) {
    const isOnline = data.status === 1;
    
    const serverStatusBadge = isOnline
      ? `<span class="status-badge online"><i class="fa-solid fa-circle-check"></i> Server Live</span>`
      : `<span class="status-badge closed"><i class="fa-solid fa-circle-xmark"></i> Server Closed</span>`;

    const releaseDateText = data.releaseDate || data.lastUpdated || 'Recently Released';

    if (serverInfoContainer) {
      serverInfoContainer.innerHTML = `
        <div class="server-status-header">
          <h3>${data.season || 'CODM Test Server'}</h3>
          ${serverStatusBadge}
        </div>
        <div class="meta-row">
          <p><strong><i class="fa-regular fa-calendar-check"></i> Release Date:</strong> ${releaseDateText}</p>
          <p><strong><i class="fa-solid fa-list-check"></i> Patch Summary:</strong> ${data.updateDescription || 'No description available.'}</p>
        </div>
      `;
    }

    if (linksGridContainer) {
      if (data.links && data.links.length > 0) {
        linksGridContainer.innerHTML = data.links.map(item => {
          let rawIcon = item.icon || "favicon.png";
          let iconUrl = rawIcon.startsWith("http") ? rawIcon : `${REPO_BASE}assets/images/${rawIcon}`;

          let rawBg = item.bg || item.image || rawIcon;
          let bgUrl = rawBg.startsWith("http") ? rawBg : `${REPO_BASE}assets/images/${rawBg}`;

          const deviceHasIcon = /<i\b[^>]*>/i.test(item.device);
          let deviceTitleHTML = item.device;

          if (!deviceHasIcon) {
            const isIOS = item.device.toLowerCase().includes('ios');
            const deviceIconClass = isIOS ? 'fa-brands fa-apple' : 'fa-brands fa-android';
            deviceTitleHTML = `<i class="${deviceIconClass}"></i> ${item.device}`;
          }

          const linkOnline = item.status !== undefined ? item.status === 1 : isOnline;
          const cardBadge = linkOnline
            ? `<span class="status-badge online card-status-badge"><i class="fa-solid fa-circle-check"></i> Active</span>`
            : `<span class="status-badge closed card-status-badge"><i class="fa-solid fa-circle-xmark"></i> Closed</span>`;

          return `
            <div class="link-card" style="background-image: linear-gradient(180deg, rgba(11,13,15,0.72) 0%, rgba(11,13,15,0.95) 100%), url('${bgUrl}'); background-size: cover; background-position: center;">
              
              ${cardBadge}

              <div class="card-header-row">
                <div class="app-icon-wrapper">
                  <img src="${iconUrl}" alt="App Icon" class="card-app-icon-img" onerror="this.src='assets/images/favicon.png';" />
                </div>
                <div class="device-title">
                  ${deviceTitleHTML}
                </div>
              </div>

              <div class="url-preview-box">
                <i class="fa-solid fa-link"></i>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="url-text">${item.url}</a>
              </div>

              <div class="action-row">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-tactical btn-download">
                  <i class="fa-solid fa-download"></i>
                  <span>Download</span>
                </a>
                <button type="button" class="btn-tactical btn-copy" onclick="copyPTBLink('${item.url}')">
                  <i class="fa-regular fa-copy"></i>
                  <span>Copy</span>
                </button>
              </div>

            </div>
          `;
        }).join('');
      } else {
        linksGridContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted);">No active links available.</p>`;
      }
    }
  }

  // Native Share Feature with Info Carrier
  window.shareHub = function() {
    const pageUrl = window.location.href;
    const season = loadedServerData?.season || 'CODM Public Test Server';
    const releaseDate = loadedServerData?.releaseDate || loadedServerData?.lastUpdated || 'Latest';
    const description = loadedServerData?.updateDescription || 'Official Call of Duty: Mobile PTB links for Android & iOS.';

    const shareTitle = `${season} — CODM Test Server Hub`;
    const shareText = `🎮 ${season}\n📅 Release Date: ${releaseDate}\n📱 Platforms: Android (APK 32/64-Bit) & iOS (TestFlight)\n📝 Update Info: ${description}\n\nGet download links here:`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: pageUrl
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyShareFallback(shareText, pageUrl);
        }
      });
    } else {
      copyShareFallback(shareText, pageUrl);
    }
  };

  function copyShareFallback(text, url) {
    const fullMessage = `${text}\n${url}`;
    navigator.clipboard.writeText(fullMessage).then(() => {
      showToast("Share info copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy share details.", true);
    });
  }

  window.copyPTBLink = function(url) {
    if (!isUnlocked) return;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy link.", true);
    });
  };

  const toastEl = document.getElementById("toast");
  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.backgroundColor = isError ? "#e62222" : "#f5b800";
    toastEl.style.color = isError ? "#ffffff" : "#000000";
    toastEl.style.display = "block";
    toastEl.style.opacity = "1";

    setTimeout(() => {
      toastEl.style.opacity = "0";
      setTimeout(() => { toastEl.style.display = "none"; }, 300);
    }, 2400);
  }

  initHubData();
});
