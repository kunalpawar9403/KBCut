# KBCut - Photo & PDF Size Reducer

> **Tagline:** Get under the limit.  
> Free, mobile-first, 100% private in-browser file size reducer built for Indian students and job seekers applying on exam and government portals (SSC, UPSC, Banking, MPSC, Passport, Aadhaar, NEET, GATE).

![KBCut Logo](/public/logo.png)

---

## 🌟 Key Features

1. **Client-Side Compression (100% Private)**
   - No backend, no accounts, no analytics, no external uploads.
   - All compression happens directly on the device using modern Canvas APIs and `pdf-lib`.
2. **Mobile-First Design (390px Optimized)**
   - Bottom tab bar on mobile (Home, Tools, History, Settings).
   - High-contrast, rounded cards, touch-friendly min 56px buttons.
   - Light and Dark mode toggle.
3. **One-Tap Exam Presets (`src/data/presets.ts`)**
   - **SSC Photo** (under 50 KB, 200x230 px)
   - **Standard Signature** (140x60 px, under 30 KB)
   - **Passport Photo** (35x45 mm, under 100 KB)
   - **Aadhaar / ID** (under 200 KB)
   - **UPSC Civil Services** (under 300 KB)
   - **IBPS / Banking** (under 50 KB, 200x230 px)
   - **GATE / JEE / NEET** (under 200 KB)
   - **MPSC / State PSC** (under 50 KB)
   - Quick size chips (20, 50, 100, 200 KB + custom input)
4. **All-in-One Exam Document Tools**
   - **Merge PDFs & Images**: Drag/reorder and combine into 1 PDF.
   - **Split & Rotate PDF**: Extract page ranges (e.g. `1-3, 5`) or rotate 90°/180°.
   - **E-Sign PDF**: Draw signature with ink smoothing, save for reuse to IndexedDB, stamp and position on PDF page.
   - **Aadhaar 2-in-1**: Combine front and back IDs on a single A4 page.
   - **Photo + Signature Sheet**: Combine passport photo and signature vertically for exam portals.
   - **Crop & Rotate**: Fixed aspect ratios (3.5:4.5, 140:60, 1:1) and 90° rotation.
5. **Multi-Language (i18n)**
   - English, Marathi (मराठी), and Hindi (हिंदी).
6. **PWA & Offline Ready**
   - Offline Service Worker (`/public/sw.js`), Web Manifest (`/public/manifest.webmanifest`), and install prompt.
7. **SEO Landing Pages Pre-Configured**
   - `/compress-image-to-50kb`
   - `/compress-image-to-100kb`
   - `/signature-resize-140x60`
   - `/compress-pdf-to-200kb`

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or newer recommended, tested on Node v23)
- npm (v9 or newer)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The app will open at: `http://localhost:5173/`

### 3. Run Unit & Integration Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 🌐 How to Deploy

### Option A: Deploy on Vercel
1. Install Vercel CLI (or connect via GitHub):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Single Page App routing is automatically handled by the included [`vercel.json`](file:///Users/kunal/KBCUT/vercel.json).

### Option B: Deploy on Netlify
1. Connect repository in Netlify or use Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```
2. Build Settings:
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`
3. Single Page App routing is handled by the included [`public/_redirects`](file:///Users/kunal/KBCUT/public/_redirects).

---

## 📱 Wrapping with Capacitor for Android

To package KBCut as a native Android app:

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "KBCut" "com.kbcut.app" --web-dir dist

# 3. Build Web Bundle
npm run build

# 4. Add Android Platform & Sync
npx cap add android
npx cap sync

# 5. Open in Android Studio
npx cap open android
```
Platform actions (Download, Share, File save) in [`src/services/platform.ts`](file:///Users/kunal/KBCUT/src/services/platform.ts) are pre-abstracted for `@capacitor/share` and `@capacitor/filesystem`.
