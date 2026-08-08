document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById('toast');
  const tableBody = document.getElementById('codesTableBody');
  const searchInput = document.getElementById('codeInputSearch');
  const versionFilterSelect = document.getElementById('versionFilter');
  const rowsSelect = document.getElementById('rowsPerPage');
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const lastUpdatedEl = document.getElementById('last-updated-date');

  let parsedCodes = [];
  let filteredCodes = [];
  let currentPage = 1;
  let rowsPerPage = 5;

  // ==========================================
  // PARSER: CONVERT TEXT STRING TO ARRAY
  // ==========================================
  function parseRedeemCodesData(dataString) {
    if (typeof redeemCodesData === 'undefined') return [];
    
    const entries = dataString.trim().split(/\n\s*\n/);
    const result = [];

    entries.forEach(entry => {
      const codeMatch = entry.match(/r-code:\s*([^\n]+)/i);
      const versionMatch = entry.match(/version:\s*([^\n]+)/i);
      const dateMatch = entry.match(/data-added:\s*([^\n]+)/i);

      if (codeMatch) {
        const code = codeMatch[1].trim();
        const version = versionMatch ? versionMatch[1].trim() : "Unknown";
        const dateStr = dateMatch ? dateMatch[1].trim() : "Not available";
        const timestamp = new Date(dateStr).getTime() || 0;

        result.push({
          code: code,
          version: version,
          date: dateStr,
          timestamp: timestamp
        });
      }
    });

    // Sort Newest to Oldest by parsed date timestamp
    return result.sort((a, b) => b.timestamp - a.timestamp);
  }

  // ==========================================
  // HEADER UPDATE: SYNC LAST UPDATED DATE
  // ==========================================
  function updateLastUpdatedHeader(codes) {
    if (!lastUpdatedEl) return;

    let latestDate = "Not available";

    for (const item of codes) {
      if (item.date && item.date.toLowerCase() !== "not available") {
        latestDate = item.date;
        break;
      }
    }

    lastUpdatedEl.textContent = latestDate;
  }

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  function applyFilters() {
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedVersion = versionFilterSelect ? versionFilterSelect.value : 'All';

    filteredCodes = parsedCodes.filter(item => {
      const matchesSearch = item.code.toLowerCase().includes(searchQuery) || 
                            item.date.toLowerCase().includes(searchQuery) ||
                            item.version.toLowerCase().includes(searchQuery);

      const matchesVersion = (selectedVersion === 'All') || 
                             (item.version.toLowerCase() === selectedVersion.toLowerCase());

      return matchesSearch && matchesVersion;
    });

    currentPage = 1;
    renderTable();
  }

  // Helper function for version badges
  function getVersionBadgeClass(versionStr) {
    const v = versionStr.toLowerCase();
    if (v === 'global') return 'global';
    if (v === 'garena') return 'garena';
    if (v === 'both') return 'both';
    return 'unknown';
  }

  // Initialize Data
  parsedCodes = parseRedeemCodesData(redeemCodesData);
  updateLastUpdatedHeader(parsedCodes);
  applyFilters();

  // ==========================================
  // RENDER TABLE & PAGINATION
  // ==========================================
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (filteredCodes.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="no-results" style="text-align:center; padding:16px;">No codes found for this filter.</td></tr>`;
      pageInfo.textContent = 'Showing 0-0 of 0';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const totalItems = filteredCodes.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
    const paginatedItems = filteredCodes.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
      const tr = document.createElement('tr');
      const badgeClass = getVersionBadgeClass(item.version);

      tr.innerHTML = `
        <td class="code-cell"><code>${item.code}</code></td>
        <td class="version-cell"><span class="v-badge ${badgeClass}">${item.version}</span></td>
        <td class="date-cell">${item.date}</td>
        <td class="action-cell">
          <button type="button" class="copy-btn" onclick="copyCode('${item.code}')">
            Copy
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    pageInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalItems}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // ==========================================
  // EVENT LISTENERS FOR CONTROLS
  // ==========================================
  if (rowsSelect) {
    rowsSelect.addEventListener('change', (e) => {
      rowsPerPage = parseInt(e.target.value, 10);
      currentPage = 1;
      renderTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (versionFilterSelect) {
    versionFilterSelect.addEventListener('change', applyFilters);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredCodes.length / rowsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  // ==========================================
  // GLOBAL HELPER FUNCTIONS
  // ==========================================
  window.copyCode = function(codeText) {
    navigator.clipboard.writeText(codeText).then(() => {
      showToast(`Code ${codeText} copied!`);
    }).catch(() => {
      showToast("Failed to copy code", true);
    });
  };

  window.shareSite = function() {
    const shareData = {
      title: 'CODM Redeem Codes — SlimeSpace',
      text: 'Check out working Call of Duty: Mobile redeem codes updated on SlimeSpace!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Page link copied to clipboard!");
    }
  };

  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.backgroundColor = isError ? '#e74c3c' : 'var(--accent-cyan)';
    toastEl.style.color = isError ? '#ffffff' : '#070c18';
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
});
