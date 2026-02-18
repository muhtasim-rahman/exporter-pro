/* ======================================================
   PROJECT EXPORTER Pro 
   Version: 3.1

   Features:
   - Auto Resource Loader
   - Dynamic UI Injection
   - Dark Premium UI
   - Responsive Grid (1-2-4)
   - Real-Time Progress + Animated Badge
   - Pause / Resume / Stop Control
   - Middle Ellipsis Truncation
   - Multi Format (PNG / JPG / WebP)
   - Scale Control (0x–16x)
   - Individual + ZIP Download
   - Live ZIP Size Indicator
   - Image Preview Modal
   - Collapsible Preview Section
   - Toast Notifications
   - Dark Scrollbars
   - Balanced Table Layout
   - Memory Cleanup (URL Revoke)
   - Mobile Optimized
   - Professional Footer Link
   - safe to include
   as a script in any project
   
====================================================== */


(function() {
  'use strict';

  try {
    // ---------- Create a host element and attach Shadow DOM ----------
    const hostId = 'ep-exporter-host-' + Math.random().toString(36).substring(2, 10);
    const host = document.createElement('div');
    host.id = hostId;
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'closed' });

    // ---------- Shared variables ----------
    let generatedData = [];
    let isPaused = false;
    let isStopped = false;
    let totalSize = 0;

    /* ------------------------------------------------
       1. Load External Resources (main document)
    ------------------------------------------------ */
    function loadResource(type, src) {
      return new Promise((resolve, reject) => {
        try {
          const el = document.createElement(type === 'script' ? 'script' : 'link');
          if (type === 'script') {
            el.src = src;
            el.onload = resolve;
            el.onerror = reject;
          } else {
            el.rel = 'stylesheet';
            el.href = src;
            resolve();
          }
          document.head.appendChild(el);
        } catch (e) {
          reject(e);
        }
      });
    }

    async function initResources() {
      try {
        // Load Font Awesome in main document (cached, also loaded in shadow later)
        await loadResource('link', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        if (!window.html2canvas) {
          await loadResource('script', 'https://html2canvas.hertzen.com/dist/html2canvas.min.js');
        }
        if (!window.JSZip) {
          await loadResource('script', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        }
      } catch (e) {
        console.warn('[Project Exporter] Some resources failed to load. Features may be limited.', e);
      }
    }

    /* ------------------------------------------------
       2. Inject Styles & Font Awesome into Shadow DOM
    ------------------------------------------------ */
    function injectStyles() {
      // Load Font Awesome inside shadow so icons appear
      const faLink = document.createElement('link');
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      shadow.appendChild(faLink);

      const css = `
        :host {
          all: initial;
          display: block;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: #080808;
          color: #d1d1d1;
          padding: 60px 20px;
          box-sizing: border-box;
          border-top: 1px solid #1a1a1a;
          width: 100%;
        }
        * {
          box-sizing: border-box;
        }
        .ep-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Toast Notification */
        .ep-toast {
          position: fixed;
          top: 30px;
          right: 30px;
          padding: 15px 25px;
          background: #121212;
          color: #fff;
          border-radius: 8px;
          border: 1px solid #333;
          border-left: 5px solid #3b82f6;
          box-shadow: 0 10px 30px rgba(0,0,0,0.7);
          z-index: 10000;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          visibility: hidden;
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .ep-toast.show {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        /* Header */
        .ep-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .ep-header h2 {
          font-size: 28px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .ep-header h2 span {
          color: #3b82f6;
        }

        /* Responsive Grid */
        .ep-grid {
          display: grid;
          gap: 15px;
          margin-bottom: 30px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .ep-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .ep-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .ep-field label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 700;
        }
        .ep-field input,
        .ep-field select {
          width: 100%;
          padding: 12px;
          background: #111;
          border: 1px solid #222;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }

        /* Buttons */
        .ep-action-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .ep-main-btn {
          height: 48px;
          min-width: 160px;
          border-radius: 6px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          transition: 0.2s;
          flex: 1 1 auto;
          max-width: 250px;
        }
        @media (max-width: 600px) {
          .ep-main-btn { width: 100%; max-width: 100%; }
        }
        .ep-btn-gen { background: #fff; color: #000; }
        .ep-btn-pause { background: #f59e0b; color: #fff; display: none; }
        .ep-btn-stop { background: #ef4444; color: #fff; display: none; }
        .ep-btn-clear { background: transparent; color: #666; border: 1px solid #333; }

        /* Progress Bar */
        .ep-progress-box {
          margin: 40px 0;
          display: none;
          position: relative;
          padding-top: 30px;
        }
        .ep-progress-container {
          width: 100%;
          height: 6px;
          background: #1a1a1a;
          border-radius: 10px;
          position: relative;
        }
        .ep-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        .ep-progress-badge {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -100%);
          background: #3b82f6;
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
          transition: left 0.3s ease;
          white-space: nowrap;
          margin-bottom: 10px;
        }

        /* Preview Box */
        .ep-preview-box {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          display: none;
          margin-top: 30px;
        }
        .ep-preview-head {
          padding: 18px;
          background: #141414;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ep-content-area {
          max-height: 1200px;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        .ep-content-area.collapsed {
          max-height: 0;
        }

        /* Table & Scrollbar */
        .ep-table-wrapper {
          overflow-x: auto;
          width: 100%;
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
        }
        .ep-table-wrapper::-webkit-scrollbar {
          height: 6px;
        }
        .ep-table-wrapper::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .ep-table-wrapper::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          color: #aaa;
          font-size: 13px;
          min-width: 650px;
          table-layout: auto;
        }
        th {
          text-align: left;
          padding: 15px;
          background: #141414;
          border-bottom: 1px solid #222;
          color: #666;
          font-size: 11px;
          text-transform: uppercase;
        }
        td {
          padding: 12px 15px;
          border-bottom: 1px solid #151515;
        }

        .ep-name-cell {
          color: #fff;
          font-weight: 500;
          white-space: nowrap;
          display: inline-block;
        }

        .ep-row-btn {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .ep-row-btn:hover {
          border-color: #fff;
          color: #fff;
        }

        /* Modal */
        .ep-modal-ov {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          padding: 20px;
          backdrop-filter: blur(8px);
        }
        .ep-modal {
          background: #111;
          width: 90%;
          max-width: 1000px;
          max-height: 90%;
          border-radius: 12px;
          border: 1px solid #333;
          overflow: hidden;
        }
        .ep-modal-head {
          padding: 15px 20px;
          background: #181818;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #222;
        }
        .ep-modal-body {
          padding: 20px;
          text-align: center;
          background: #0a0a0a;
        }
        .ep-modal-body img {
          max-width: 100%;
          max-height: 70vh;
          border-radius: 4px;
        }

        /* Footer */
        .ep-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #1a1a1a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #444;
          flex-wrap: wrap;
          gap: 15px;
        }
        .ep-footer-link {
          color: #666;
          text-decoration: none;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ep-footer-link:hover {
          color: #3b82f6;
        }

        .ep-spin {
          animation: fa-spin 1s infinite linear;
        }
      `;

      const style = document.createElement('style');
      style.textContent = css;
      shadow.appendChild(style);
    }

    /* ------------------------------------------------
       3. Utility Functions
    ------------------------------------------------ */
    function truncateFileName(str) {
      const isSmallScreen = window.innerWidth < 768;
      const maxLength = isSmallScreen ? 24 : 40;
      if (str.length <= maxLength) return str;
      const dots = ' .... ';
      const lastDotIndex = str.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? str.substring(lastDotIndex) : '';
      const nameWithoutExt = lastDotIndex !== -1 ? str.substring(0, lastDotIndex) : str;
      const charsToShow = maxLength - dots.length - extension.length;
      if (charsToShow <= 0) return str.substring(0, maxLength) + ' .... ';
      const frontChars = Math.ceil(charsToShow / 2);
      const backChars = Math.floor(charsToShow / 2);
      return nameWithoutExt.substring(0, frontChars) + dots + nameWithoutExt.substring(nameWithoutExt.length - backChars) + extension;
    }

    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showToast(msg, type = 'success') {
      let toast = shadow.querySelector('.ep-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'ep-toast';
        shadow.appendChild(toast);
      }
      if (window.epToastTimeout) clearTimeout(window.epToastTimeout);
      toast.className = `ep-toast show ${type}`;
      toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${msg}`;
      window.epToastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    /* ------------------------------------------------
       4. Build the UI inside Shadow Root
    ------------------------------------------------ */
    function buildUI() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="ep-container">
          <div class="ep-header">
            <h2>Project Exporter <span>Pro</span></h2>
            <p>Professional export tool with real-time analytics.</p>
          </div>

          <div class="ep-grid">
            <div class="ep-field"><label>Target Class</label><input type="text" id="ep-target" value="page"></div>
            <div class="ep-field"><label>Base Name</label><input type="text" id="ep-name" value="Project"></div>
            <div class="ep-field"><label>Scale (2x - 16x)</label><input type="number" id="ep-scale" value="2" min="2" max="16"></div>
            <div class="ep-field">
              <label>Format</label>
              <select id="ep-format"><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select>
            </div>
          </div>

          <div class="ep-action-row">
            <button id="ep-gen-btn" class="ep-main-btn ep-btn-gen"><i class="fa-solid fa-play"></i> <span>Generate List</span></button>
            <button id="ep-pause-btn" class="ep-main-btn ep-btn-pause"><i class="fa-solid fa-pause"></i> Pause</button>
            <button id="ep-stop-btn" class="ep-main-btn ep-btn-stop"><i class="fa-solid fa-stop"></i> Stop</button>
            <button id="ep-clear-btn" class="ep-main-btn ep-btn-clear" style="display:none;"><i class="fa-solid fa-rotate"></i> Reset</button>
          </div>

          <div id="ep-progress-box" class="ep-progress-box">
            <div class="ep-progress-container"><div id="ep-pbadge" class="ep-progress-badge">0%</div><div id="ep-pfill" class="ep-progress-fill"></div></div>
          </div>

          <div id="ep-preview-box" class="ep-preview-box">
            <div id="ep-toggle" class="ep-preview-head">
              <h3 style="font-size:13px; color:#fff; margin:0"><i class="fa-solid fa-list-check"></i> Preview & Download List <span id="ep-counter" style="color:#666; margin-left:10px">(0/0)</span></h3>
              <i class="fa-solid fa-chevron-down" id="ep-chevron"></i>
            </div>
            <div id="ep-content" class="ep-content-area">
              <div class="ep-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 4%">No.</th>
                      <th style="width: 30%">File Name</th>
                      <th style="width: 15%">Resolution</th>
                      <th style="width: 15%">Size</th>
                      <th style="width: 36%; text-align:right">Action</th>
                    </tr>
                  </thead>
                  <tbody id="ep-tbody"></tbody>
                </table>
              </div>
              <div style="padding:20px; background:#111; border-top:1px solid #1a1a1a">
                <button id="ep-zip-btn" class="ep-btn-zip" style="width:100%; background:#fff; color:#000; border:none; padding:15px; border-radius:6px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px">
                  <i class="fa-solid fa-box-archive"></i> <span>Download All (ZIP)</span>
                </button>
              </div>
            </div>
          </div>

          <footer class="ep-footer">
            <div>Copyright <i class="fa-regular fa-copyright"></i> Project Exporter Pro</div>
            <a href="https://mdturzo.odoo.com" target="_blank" class="ep-footer-link">Muhtasim Rahman | mdturzo.odoo.com</a>
          </footer>
        </div>

        <div id="ep-modal-ov" class="ep-modal-ov">
          <div class="ep-modal">
            <div class="ep-modal-head"><span id="ep-modal-title" style="font-size:14px; font-weight:600">Preview</span><i class="fa-solid fa-xmark" id="ep-modal-close" style="cursor:pointer"></i></div>
            <div class="ep-modal-body"><img id="ep-modal-img" src=""></div>
          </div>
        </div>
      `;

      // Append everything to shadow root
      shadow.appendChild(wrapper.firstElementChild); // .ep-container
      shadow.appendChild(wrapper.lastElementChild);  // .ep-modal-ov
    }

    /* ------------------------------------------------
       5. Core Logic
    ------------------------------------------------ */
    function initLogic() {
      const btnGen = shadow.getElementById('ep-gen-btn');
      const btnPause = shadow.getElementById('ep-pause-btn');
      const btnStop = shadow.getElementById('ep-stop-btn');
      const btnClear = shadow.getElementById('ep-clear-btn');
      const btnZip = shadow.getElementById('ep-zip-btn');
      const pFill = shadow.getElementById('ep-pfill');
      const pBadge = shadow.getElementById('ep-pbadge');
      const tbody = shadow.getElementById('ep-tbody');
      const counterEl = shadow.getElementById('ep-counter');
      const toggle = shadow.getElementById('ep-toggle');
      const content = shadow.getElementById('ep-content');
      const chevron = shadow.getElementById('ep-chevron');
      const modalOv = shadow.getElementById('ep-modal-ov');
      const modalImg = shadow.getElementById('ep-modal-img');
      const modalTitle = shadow.getElementById('ep-modal-title');
      const modalClose = shadow.getElementById('ep-modal-close');

      // Toggle preview collapse
      toggle.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        chevron.style.transform = content.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
      });

      // Modal close
      modalClose.addEventListener('click', () => {
        modalOv.style.display = 'none';
      });
      modalOv.addEventListener('click', (e) => {
        if (e.target === modalOv) modalOv.style.display = 'none';
      });

      // Reset function
      function reset() {
        generatedData.forEach(item => URL.revokeObjectURL(item.url));
        generatedData = [];
        totalSize = 0;
        tbody.innerHTML = '';
        shadow.getElementById('ep-preview-box').style.display = 'none';
        shadow.getElementById('ep-progress-box').style.display = 'none';
        btnClear.style.display = 'none';
        isStopped = false;
        isPaused = false;
      }

      btnClear.addEventListener('click', reset);

      // Generate button
      btnGen.addEventListener('click', async () => {
        const targetInput = shadow.getElementById('ep-target').value || '.page';
        const baseName = shadow.getElementById('ep-name').value || 'Project';
        const scale = parseInt(shadow.getElementById('ep-scale').value) || 2;
        const format = shadow.getElementById('ep-format').value;

        let selector = targetInput;
        if (!selector.startsWith('.') && !selector.startsWith('#')) {
          selector = '.' + selector;
        }
        const elements = document.querySelectorAll(selector);
        if (!elements.length) {
          showToast('No targets found', 'error');
          return;
        }

        reset();
        btnGen.style.display = 'none';
        btnPause.style.display = 'inline-flex';
        btnStop.style.display = 'inline-flex';
        shadow.getElementById('ep-preview-box').style.display = 'block';
        shadow.getElementById('ep-progress-box').style.display = 'block';

        for (let i = 0; i < elements.length; i++) {
          if (isStopped) break;
          while (isPaused) {
            await new Promise(r => setTimeout(r, 200));
            if (isStopped) break;
          }
          if (isStopped) break;

          try {
            if (!window.html2canvas) {
              showToast('html2canvas not loaded', 'error');
              break;
            }
            const canvas = await html2canvas(elements[i], { scale, useCORS: true, logging: false });
            const resText = `${canvas.width}x${canvas.height}`;
            const fileName = `${baseName}-${i + 1}.${format}`;
            const blob = await new Promise(res => canvas.toBlob(res, `image/${format === 'jpeg' ? 'jpeg' : format}`, 0.9));
            const url = URL.createObjectURL(blob);
            const sizeStr = formatBytes(blob.size);
            totalSize += blob.size;
            generatedData.push({ fileName, blob, url });

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${i + 1}</td>
              <td><div class="ep-name-cell" title="${fileName}">${truncateFileName(fileName)}</div></td>
              <td><span style="color:#555; font-size:11px">${resText}</span></td>
              <td><span style="color:#3b82f6; font-weight:600">${sizeStr}</span></td>
              <td style="text-align:right">
                <div style="display:flex; gap:8px; justify-content:flex-end">
                  <button class="ep-row-btn" data-index="${i}" data-action="preview"><i class="fa-solid fa-eye"></i></button>
                  <button class="ep-row-btn" data-index="${i}" data-action="download"><i class="fa-solid fa-download"></i> <span>Save</span></button>
                </div>
              </td>
            `;

            const previewBtn = tr.querySelector('button[data-action="preview"]');
            const downloadBtn = tr.querySelector('button[data-action="download"]');
            previewBtn.addEventListener('click', (e) => {
              const idx = e.currentTarget.dataset.index;
              const item = generatedData[idx];
              modalImg.src = item.url;
              modalTitle.innerText = item.fileName;
              modalOv.style.display = 'flex';
            });
            downloadBtn.addEventListener('click', (e) => {
              const idx = e.currentTarget.dataset.index;
              const item = generatedData[idx];
              const link = document.createElement('a');
              link.href = item.url;
              link.download = item.fileName;
              link.click();
              showToast(`Saved: ${item.fileName}`);
            });

            tbody.appendChild(tr);

            const pct = Math.round(((i + 1) / elements.length) * 100);
            pFill.style.width = pct + '%';
            pBadge.style.left = pct + '%';
            pBadge.innerText = pct + '%';
            counterEl.innerText = `(${i+1}/${elements.length})`;
            btnZip.querySelector('span').innerText = `Download All (ZIP) — ${formatBytes(totalSize)}`;
          } catch (e) {
            console.warn('[Project Exporter] Error capturing element', e);
            showToast('Error capturing element', 'error');
          }
        }

        btnPause.style.display = 'none';
        btnStop.style.display = 'none';
        btnGen.style.display = 'inline-flex';
        btnClear.style.display = 'inline-flex';
        showToast(isStopped ? 'Process stopped' : 'Export Complete!');
      });

      // Pause / Resume
      btnPause.addEventListener('click', () => {
        isPaused = !isPaused;
        btnPause.innerHTML = isPaused ? '<i class="fa-solid fa-play"></i> Resume' : '<i class="fa-solid fa-pause"></i> Pause';
        btnPause.style.background = isPaused ? '#22c55e' : '#f59e0b';
      });

      // Stop
      btnStop.addEventListener('click', () => {
        isStopped = true;
      });

      // ZIP download
      btnZip.addEventListener('click', async () => {
        if (!generatedData.length) return;
        if (!window.JSZip) {
          showToast('JSZip not loaded', 'error');
          return;
        }
        btnZip.disabled = true;
        const original = btnZip.innerHTML;
        btnZip.innerHTML = '<i class="fa-solid fa-spinner ep-spin"></i> Creating ZIP...';
        try {
          const zip = new JSZip();
          generatedData.forEach(i => zip.file(i.fileName, i.blob));
          const content = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = (shadow.getElementById('ep-name').value || 'Project') + '.zip';
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (e) {
          showToast('ZIP creation failed', 'error');
        }
        btnZip.disabled = false;
        btnZip.innerHTML = original;
      });
    }

    /* ------------------------------------------------
       6. Start
    ------------------------------------------------ */
    (async function start() {
      await initResources();
      injectStyles();
      buildUI();
      initLogic();
    })();

  } catch (err) {
    console.error('[Project Exporter] Fatal error – isolated from main project.', err);
  }
})();
