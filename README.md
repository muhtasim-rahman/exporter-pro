# 📸 Project Exporter Pro  

![Project Exporter Pro Preview](./preview.png)

### Advanced Web Element Export Engine
> A zero-dependency, plug-and-play JavaScript exporting engine that converts live DOM elements into high-resolution images with analytics, preview system, ZIP packaging, pause/resume control, and a fully injected premium UI.

---

# 📑 Table of Contents

- [📸 Project Exporter Pro](#-project-exporter-pro)
- [📑 Table of Contents](#-table-of-contents)
- [🚀 Overview](#-overview)
- [✨ Feature Breakdown](#-feature-breakdown)
- [🔄 Functional Workflow](#-functional-workflow)
- [🛠 Installation](#-installation)
    - [Option 1 — Local](#option-1--local)
    - [Option 2 — CDN (Recommended)](#option-2--cdn-recommended)
- [⚙ Configuration Options](#-configuration-options)
- [⚡ Performance Notes](#-performance-notes)
- [📦 File Structure](#-file-structure)
- [👨‍💻 Author](#-author)
- [⭐ Support](#-support)


---

# 🚀 Overview

**Project Exporter Pro** is a self-contained JavaScript export system designed to be injected into any HTML project without modifying the existing structure.

It automatically:

- Injects its own UI
- Injects **premium dark theme**
- Loads required external libraries
- Detects target DOM elements
- Converts them to canvas
- Generates image blobs
- Creates **downloadable files**
- Provides **preview & ZIP** packaging

> No HTML markup is required.
No CSS file is required.
Only one JS file.

---

# ✨ Feature Breakdown

### ⚡ Single File Plug & Play
- Drop one JS file into any project.


### 🎨 Premium Dark Interface
- Balanced layout
- Modern grid
- Smooth transitions
- Dark scrollbar styling
- Professional modal

### 📊 Live Progress System
- Animated progress bar
- Percentage badge
- Real-time count
- Dynamic ZIP size calculation

### ⏯ Pause / Resume / Stop
- Control export process live without reloading page.

### 👁 Modal Preview
- Preview any generated image before download.

### 📦 ZIP Packaging
- Download all exported images as a single `.zip`.

### ✂ Middle Ellipsis Filename Logic
- Long filenames auto-truncate: 
- ` VeryLongProjectNameFile....png `
- Adaptive for mobile and desktop.

### 📱 Fully Responsive Layout
- Everything adjusts accordinf to the device width.

### 🛑 Main Sections

- Header
- Input Grid
- Action Row
- Progress Bar
- Preview Panel (Collapsible)
- Table
- ZIP Section
- Footer
- Modal Viewer (Preview)
---

# 🔄 Functional Workflow

```
User Input
    ↓
DOM Query (Selector)
    ↓
Canvas Rendering
    ↓
Blob Conversion
    ↓
Preview Table Population
    ↓
Single Download or ZIP Export
```

---

# 🛠 Installation

### Option 1 — Local
1. Download the `export.js`
2. Place `export.js` to your project folder
3. Import this before closing `</body>` tag:

```html
<script src="./export.js"></script>
```

---

### Option 2 — CDN (Recommended)

1. Just place this before closing `</body>` tag:

```html
<script src="https://muhtasim-rahman.github.io/exporter-pro/export.js"></script>
```

Now it works on any website instantly.

---

# ⚙ Configuration Options

| Field | Description | Default |
|--------|-------------|----------|
| Target Class | CSS selector of elements to export | `.page` |
| Base Name | Output filename prefix | `Project` |
| Scale | Rendering multiplier ( 1x-16x ) | `2` |
| Format | Image format (png, jpg, webP)| `PNG` |

---

# ⚡ Performance Notes

- Large scale values increase memory usage.
- Recommended scale: 2–4
- For heavy pages: export in batches.
- Object URLs are revoked on reset.
- Requires **internet** connection (for CDN libraries).
- **You may need to host your project online (eg. GitHub) if it includes any image.**

---

# 📦 File Structure

```
project-root/
│
├── index.html 
├── export.js
└── Other Files
```

---

# 👨‍💻 Author

**Muhtasim Rahman**  
> Programmer | Web Developer | Graphic Designer | Student

- Portfolio : https://mdturzo.odoo.com
- GitHub : https://github.com/muhtasim-rahman
- LinkedIn : https://www.linkedin.com/in/mdturzo999
- YouTube : https://www.youtube.com/@mdturzo999
- E-mail : programmer.turzo@gmail.com

---

# ⭐ Support

If this project helps you:

- Star the repository
- Fork it
- Contribute improvements

---

Made with 💖 by [Muhtasim Rahman](https://mdturzo.odoo.com)

