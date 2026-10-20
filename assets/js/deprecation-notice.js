/**
 * SlimeSpace Deprecation & Redirect Notice
 * Prompts users visiting legacy pages to transition to the main website.
 *
 * @param {string} targetUrl - The new destination URL for redirection.
 */
function checkDeprecationNotice(targetUrl) {
  setTimeout(() => {
    // Inject responsive UI styles matching SlimeSpace theme
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #deprecation-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 12, 24, 0.88);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: depFadeIn 0.25s ease-out;
      }
      @keyframes depFadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
      #deprecation-modal-card {
        background: #0e172a;
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 18px;
        padding: 24px;
        max-width: 440px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.05);
        text-align: left;
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        box-sizing: border-box;
      }
      .dep-modal-badge {
        display: inline-block;
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 20px;
        margin-bottom: 12px;
        border: 1px solid rgba(239, 68, 68, 0.25);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      #deprecation-modal-card h3 {
        color: #f8fafc;
        font-size: 1.15rem;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.02em;
      }
      #deprecation-modal-card p {
        color: #94a3b8;
        font-size: 0.85rem;
        line-height: 1.55;
        margin-bottom: 22px;
      }
      .dep-modal-actions {
        display: flex;
        gap: 10px;
        flex-direction: column;
      }
      @media (min-width: 480px) {
        .dep-modal-actions {
          flex-direction: row-reverse;
        }
      }
      .dep-btn-primary {
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
        color: #070c18;
        border: none;
        padding: 12px 18px;
        border-radius: 10px;
        font-weight: 800;
        font-size: 0.85rem;
        cursor: pointer;
        text-align: center;
        transition: transform 0.2s, opacity 0.2s;
        flex: 1;
        box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
      }
      .dep-btn-primary:hover {
        opacity: 0.95;
        transform: translateY(-1px);
      }
      .dep-btn-secondary {
        background: rgba(255, 255, 255, 0.02);
        color: #94a3b8;
        border: 1px solid #1e293b;
        padding: 12px 18px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
        flex: 1;
      }
      .dep-btn-secondary:hover {
        color: #f8fafc;
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.05);
      }
    `;
    document.head.appendChild(styleEl);

    // Construct modal DOM node with simplified wording
    const modalContainer = document.createElement('div');
    modalContainer.id = 'deprecation-modal-overlay';
    modalContainer.innerHTML = `
      <div id="deprecation-modal-card" role="dialog" aria-labelledby="depNoticeTitle" aria-describedby="depNoticeDesc">
        <span class="dep-modal-badge">⚠️ Notice</span>
        <h3 id="depNoticeTitle">We've Moved to a New Site!</h3>
        <p id="depNoticeDesc">This page is no longer updated. Visit our official new site to get the latest working redeem codes and tools.</p>
        <div class="dep-modal-actions">
          <button type="button" id="depVisitBtn" class="dep-btn-primary">Go to New Site</button>
          <button type="button" id="depStayBtn" class="dep-btn-secondary">Stay on Old Page</button>
        </div>
      </div>
    `;

    // Append modal when DOM body is available
    if (document.body) {
      document.body.appendChild(modalContainer);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(modalContainer);
      });
    }

    // Event Listeners
    document.getElementById('depVisitBtn').addEventListener('click', () => {
      window.location.href = targetUrl;
    });

    document.getElementById('depStayBtn').addEventListener('click', () => {
      modalContainer.remove();
    });
  }, 5000);
}
