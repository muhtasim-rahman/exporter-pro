/* 
=========================================
  ADVANCED DIV EXPORTER PRO (Single JS)
=========================================
*/

(function () {

  /* -------------------------------
     1. Load Required Libraries
  --------------------------------*/
  function loadScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  async function loadLibraries() {
    if (!window.html2canvas) {
      await loadScript("https://html2canvas.hertzen.com/dist/html2canvas.min.js");
    }
    if (!window.JSZip) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
    }
  }

  /* -------------------------------
     2. Insert Export Panel
  --------------------------------*/
  function insertPanel() {

    const panel = document.createElement("section");
    panel.id = "exporter-pro";

    panel.innerHTML = `
      <div class="ep-container">
        <h2>Project Exporter Pro</h2>

        <div class="ep-grid">

          <div class="ep-field">
            <label>Target Class</label>
            <input type="text" id="ep-class" placeholder="page" value="page">
          </div>

          <div class="ep-field">
            <label>File Base Name</label>
            <input type="text" id="ep-name" placeholder="Project name" value="Project">
          </div>

          <div class="ep-field">
            <label>Scale (1-20)</label>
            <input type="number" id="ep-scale" min="1" max="20" value="4">
          </div>

          <div class="ep-field">
            <label>Format</label>
            <select id="ep-format">
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WEBP</option>
              <option value="zip">ZIP (All)</option>
            </select>
          </div>

        </div>

        <button id="ep-export-btn">
          <span class="ep-btn-text">Export</span>
          <span class="ep-loader"></span>
        </button>

        <div class="ep-progress-wrapper">
          <div class="ep-progress-bar"></div>
        </div>

        <div class="ep-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>File Name</th>
              </tr>
            </thead>
            <tbody id="ep-table-body"></tbody>
          </table>
        </div>

      </div>
    `;

    const firstDiv = document.body.querySelector("div");
    if (firstDiv) {
      firstDiv.insertAdjacentElement("afterend", panel);
    } else {
      document.body.prepend(panel);
    }
  }

  /* -------------------------------
     3. Add Premium Dark CSS
  --------------------------------*/
  function addStyles() {

    const style = document.createElement("style");

    style.innerHTML = `
      #exporter-pro {
        background: #0f0f0f;
        padding: 40px 20px;
        font-family: 'Segoe UI', sans-serif;
        color: #eee;
      }

      .ep-container {
        max-width: 1100px;
        margin: auto;
        background: linear-gradient(145deg,#111,#1a1a1a);
        border-radius: 14px;
        padding: 30px;
        box-shadow: 0 0 40px rgba(0,0,0,.6);
      }

      h2 {
        text-align:center;
        margin-bottom:30px;
        font-weight:600;
        letter-spacing:1px;
      }

      .ep-grid {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:20px;
      }

      .ep-field label {
        font-size:14px;
        opacity:.7;
      }

      .ep-field input,
      .ep-field select {
        width:100%;
        margin-top:6px;
        padding:10px;
        background:#1f1f1f;
        border:1px solid #333;
        border-radius:6px;
        color:#fff;
      }

      #ep-export-btn {
        margin-top:25px;
        width:100%;
        padding:14px;
        background:#fff;
        color:#000;
        border:none;
        font-weight:600;
        border-radius:8px;
        cursor:pointer;
        position:relative;
        overflow:hidden;
      }

      .ep-loader {
        display:none;
        width:18px;
        height:18px;
        border:3px solid #000;
        border-top:3px solid transparent;
        border-radius:50%;
        position:absolute;
        right:20px;
        top:50%;
        transform:translateY(-50%);
        animation:spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform:translateY(-50%) rotate(360deg); }
      }

      .ep-progress-wrapper {
        height:8px;
        background:#222;
        margin-top:20px;
        border-radius:6px;
        overflow:hidden;
      }

      .ep-progress-bar {
        height:100%;
        width:0%;
        background:#fff;
        transition:width .3s;
      }

      table {
        width:100%;
        margin-top:25px;
        border-collapse:collapse;
      }

      th, td {
        border-bottom:1px solid #333;
        padding:10px;
        text-align:left;
        font-size:14px;
      }

      @media(max-width:600px){
        .ep-container{
          padding:20px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* -------------------------------
     4. Export Logic
  --------------------------------*/
  function initExportLogic() {

    const btn = document.getElementById("ep-export-btn");
    const loader = btn.querySelector(".ep-loader");
    const progressBar = document.querySelector(".ep-progress-bar");
    const tableBody = document.getElementById("ep-table-body");

    btn.addEventListener("click", async () => {

      const className = document.getElementById("ep-class").value.trim();
      const baseName = document.getElementById("ep-name").value.trim() || "Project";
      const scale = Math.min(20, Math.max(1, parseInt(document.getElementById("ep-scale").value) || 4));
      const format = document.getElementById("ep-format").value;

      const elements = document.querySelectorAll("." + className);

      if (!elements.length) {
        alert("No div found with this class!");
        return;
      }

      loader.style.display = "inline-block";
      progressBar.style.width = "0%";
      tableBody.innerHTML = "";

      const zip = new JSZip();
      let count = 0;

      for (let i = 0; i < elements.length; i++) {

        const el = elements[i];

        const canvas = await html2canvas(el, {
          scale: scale,
          useCORS: true,
          backgroundColor: null
        });

        const fileName = `${baseName}-${i + 1}.${format === "zip" ? "png" : format}`;

        if (format === "zip") {
          const data = canvas.toDataURL("image/png").split(',')[1];
          zip.file(fileName, data, { base64: true });
        } else {
          const link = document.createElement("a");
          link.download = fileName;
          link.href = canvas.toDataURL(`image/${format === "jpg" ? "jpeg" : format}`);
          link.click();
        }

        tableBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>.${className}</td>
            <td>${fileName}</td>
          </tr>
        `;

        count++;
        progressBar.style.width = ((count / elements.length) * 100) + "%";
      }

      if (format === "zip") {
        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = baseName + ".zip";
        link.click();
      }

      loader.style.display = "none";
    });
  }

  /* -------------------------------
     5. Initialize Everything
  --------------------------------*/
  window.addEventListener("DOMContentLoaded", async () => {
    await loadLibraries();
    insertPanel();
    addStyles();
    initExportLogic();
  });

})();
