# 🧪 SlimeSpace — Gaming Utilities & Web Tools Hub (Vile Tempest Official | MOB EXTRA)

SlimeSpace is a lightweight, mobile-first web hub featuring custom gaming utilities, Unicode name generators, and Call of Duty: Mobile resources. Developed by **Vile Tempest Official @ MOB EXTRA**.

![SlimeSpace Logo](assets/images/favicon.png)

---

## 📁 Repository Structure

```text
SlimeSpace/
├── assets/
│   ├── css/
│   │   └── style.css          # Main hub styling
│   ├── images/
│   │   └── favicon.png        # Brand assets & thumbnails
│   └── js/
│       └── script.js          # Interactive scripts
├── pages/
│   └── tools/
│       └── codm-ign-generator/ # CODM Space Generator Tool 
│           ├── assets/
│           │   ├── css/
│           │   │   ├── style.css
│           │   │   └── legal.css
│           │   ├── images/
│           │   │   └── favicon.png
│           │   └── js/
│           │       └── script.js
│           ├── index.html
│           └── legal.html
├── index.html                 # Root landing hub
├── legal.html
└── README.md
```

---

## ✨ Hub Features & Utilities

### 1. CODM Invisible Space & Name Generator
* **Multiple Unicode Space Methods:** Switch between Non-Breaking Space (`U+00A0` — Default / CODM Tested), Hangul Filler (`U+3164`), Braille Blank (`U+2800`), and En Quad Space (`U+2000`).
* **Live IGN Character Counter:** Track your character limit in real time (up to 14 characters max for CODM).
* **One-Click Quick Tools:** Insert spaces instantly or copy invisible spaces directly to your clipboard.
* **CODM Rename Guidance:** Built-in notice reminding users to rename via **Inventory → Rename Card → Use** to prevent name reset glitches.

### 2. CODM Public Test Server Hub
* Quick navigation and direct links to official Call of Duty: Mobile Public Test Builds (Android APKs & iOS TestFlight slots).

### 3. Mobile-Optimized Interface
* Engineered with a dark-mode theme, smooth card layouts, high-contrast accessibility, and responsive mobile-first touch scaling.

---

## 🛠️ Built With

* **HTML5** — Semantic, accessible markup with OpenGraph & Schema.org JSON-LD support.
* **CSS3** — Custom modern dark palette with CSS variables and responsive grid layouts.
* **JavaScript (ES6)** — Fast, client-side DOM manipulation and Clipboard API integration.

---

## 🚀 Live Demo

Access the live hub here:  
👉 **[SlimeSpace Hub](https://mob-extra.github.io/SlimeSpace/)**

---

## ⚙️ Local Development & Termux Deployment

If you are maintaining and updating this project on Android via **Termux**:

```bash
# Navigate to the SlimeSpace project directory
cd /storage/emulated/0/Download/SlimeSpace

# Check status and remote repository connection
git status
git remote -v

# Stage, commit, and push updates to GitHub Pages
git add .
git commit -m "Update SlimeSpace hub structure and assets"
git push origin main
```

---

## 📜 Author & License

Created and maintained by **Vile Tempest Official** (@ MOB EXTRA).  
For news, updates, and video tutorials, visit the official **[YouTube Channel](https://www.youtube.com/channel/UCbDtYZS08VvB6luAcyn08bQ)**.
