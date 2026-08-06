# 🧪 SlimeSpace — CODM Invisible Space & Name Generator

SlimeSpace is a lightweight, mobile-optimized web application designed to generate invisible Unicode spaces (such as Hangul Filler `U+3164`) specifically tailored for Call of Duty: Mobile (CODM) name bypasses and custom In-Game Names (IGNs).

![SlimeSpace Banner](logo.png)

---

## ✨ Features

* **Multiple Unicode Space Methods:** Switch between Hangul Filler (`U+3164`), Braille Blank (`U+2800`), En Quad Space (`U+2000`), and Non-Breaking Space (`U+00A0`).
* **Live IGN Character Counter:** Track your character limit in real time ($0 / 14$ characters max for CODM).
* **One-Click Quick Tools:** Insert spaces instantly or copy invisible spaces directly to your clipboard.
* **CODM Rename Guidance:** Built-in notice reminding users to rename via **Inventory $\rightarrow$ Rename Card $\rightarrow$ Use** to prevent name reset glitches.
* **PTB Direct Link Hub:** Quick navigation to official Call of Duty: Mobile Public Test Server builds (iOS & Android).
* **Fully Responsive & SEO Optimized:** Designed with high-contrast accessibility and mobile-first touch scaling.

---

## 🛠️ Built With

* **HTML5** — Semantic, accessible markup with OpenGraph & Schema.org JSON-LD support.
* **CSS3** — Custom modern styling with responsive media queries.
* **JavaScript (ES6)** — Fast, lightweight DOM manipulation and clipboard handling.

---

## 🚀 Live Demo

Access the live tool here:  
👉 **[SlimeSpace Generator](https://mob-extra.github.io/codm-space-generator/)**

---

## ⚙️ Deployment & Workflows

This project utilizes **GitHub Actions** to automatically build and deploy updates directly to GitHub Pages upon pushing changes to the `main` branch.

### Manual Local Setup / Termux Push

If you are updating this project on Android via Termux:

```bash
# Navigate to the PTB Hub project directory
cd /storage/emulated/0/Download/VileTempest_CODmTestServerDLink

# Verify remote repository connection
git remote -v

# Stage, commit, and push updates
git add .
git commit -m "Update PTB download links and build status"
git push origin main
