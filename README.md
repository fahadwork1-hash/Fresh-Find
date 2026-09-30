# 🥬 FreshFind — Karachi Farmers Markets & Fresh Produce Intelligence Platform

[![Live Production](https://img.shields.io/badge/Live%20Production-Vercel%20App-emerald?style=for-the-badge&logo=vercel)](https://fresh-find-bice.vercel.app/)
[![Development Link](https://img.shields.io/badge/Development%20Server-Aptech%20Metro%20Star%20Gate-blue?style=for-the-badge)](https://aptechmetrostargate.com:155/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.6-646C9F?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Aptech Techwiz 7 National Competition Project**  
> An intelligent, community-centric civic web application connecting Karachi citizens with 12 local farmers markets (*Bachat Bazaars & Mandis*), real-time wholesale price verification, multi-note shopping planning, bilingual Pakistani recipe generation, and seamless local order fulfillment.

---

## 🌐 Project Deployment & Access Links

| Environment | Platform / Host | Access URL | Description |
| :--- | :--- | :--- | :--- |
| **Center Development Link** | Aptech Metro Star Gate Server | [https://aptechmetrostargate.com:155/](https://aptechmetrostargate.com:155/) | Official Center Development Server |
| **Live Production Link** | Vercel Edge Network | [https://fresh-find-bice.vercel.app/](https://fresh-find-bice.vercel.app/) | Live High-Performance Cloud Deployment |
| **Source Code Repository** | GitHub | [https://github.com/fahadwork1-hash/Fresh-Find](https://github.com/fahadwork1-hash/Fresh-Find) | Open-source project repository |

---

## 📌 Executive Summary

Karachi is Pakistan's largest metropolis with over 16 million residents, consuming thousands of metric tons of fresh perishables daily. However, the supply chain between rural Sindh/Balochistan farms and urban consumers suffers from non-standardized price variations, inconsistent grade quality, and fragmented market operation timings.

**FreshFind** solves these challenges by providing:
1. **Real-time Price Transparency**: Comparing local market rates against official wholesale rates to prevent overcharging.
2. **Comprehensive Market Intelligence**: Operational schedules, live open/closed status, exact Karachi localities, and stall counts across 12 prominent markets.
3. **Frictionless Consumer Experience**: Community bookmarks with multiple timestamped personal shopping notes, bilingual recipe assistance, and zero-barrier simulated doorstep delivery or market pickup.

---

## 🚀 Key Features

### 1. 📍 12 Karachi Farmers Markets & Mandis
* Real-time directory covering all key zones of Karachi:
  - **New Sabzi Mandi** (Super Highway / M-9) — *Wholesale Perishable Hub*
  - **Empress Market** (Saddar Town) — *Heritage Colonial Era Bazaar*
  - **Water Pump Bachat Bazaar** (Federal B Area, Gulberg)
  - **Liaquatabad Super Market** (Liaquatabad Town)
  - **Jodia Bazaar** (Old Town / Kharadar) — *Wholesale Commodity Exchange*
  - **Hyderi Market** (Block H, North Nazimabad)
  - **Clifton Sunday Bachat Bazaar** (Marine Drive, Clifton Block 4)
  - **Defence Phase 2 Farmers Market** (Commercial Avenue, DHA)
  - **Malir Mandi** (Malir City) — *Peri-urban Direct Grower Hub*
  - **Korangi No. 4 Industrial Town Market**
  - **Orangi Town Sunday Market** (Sector 5)
  - **Gulshan Sunday Bachat Bazaar** (Near Disco Bakery, Gulshan-e-Iqbal)
* Live operating hours status (e.g., Early Morning Wholesale vs. Evening Retail).

### 2. 🥦 Comprehensive Produce Catalog & Grade Analysis
* **Categories**: Fresh Vegetables (*Sabziyan*), Seasonal Fruits (*Phal*), Fresh Herbs (*Jari Bootiyan*), Leafy Greens (*Saag*), and Root Vegetables.
* **Grading System**: Verified visual quality indicators (Grade A+, Grade A, Standard Grade B).
* **Price Variance Tracking**: Highlights differences between government regulated rates and retail stall prices with percentage badges.

### 3. 📝 Multi-Note Bookmark & Planning System
* Bookmark preferred markets and staple produce items.
* **Timestamped Multi-Notes**: Add multiple personalized notes per item (e.g., *"Buy 2kg for Biryani on Friday"*, *"Checked rate: Rs. 120/kg"*).
* **Inline Management**: Edit or delete specific notes in real time.
* **Export Capability**: Download your customized shopping itinerary and notes as a formatted `.txt` file.
* Works seamlessly for both guest residents and authenticated accounts.

### 4. 🛒 Frictionless Doorstep Delivery & Market Pickup
* Add seasonal produce directly to the persistent cart.
* **Zero Barrier Checkout**: No forced login barriers—residents can place delivery or pickup orders immediately.
* **Digital Order Receipt**: Generates a simulated verified order receipt with printable/downloadable proof of order.

### 5. 👨‍🍳 Chef Sabzi — Bilingual AI Culinary Assistant
* Interactive recipe recommendations based on seasonal vegetables in season across Karachi.
* Bilingual support (English & Urdu Roman/Script) with step-by-step preparation guides, cooking times, and health benefits.

### 6. 🕒 Dynamic Market Operations Clock
* Interactive operating hour simulation demonstrating how real-time schedules shift throughout trading days.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Functional Components, Hooks) | Reactive component-based user interface |
| **Build & Tooling** | Vite 5 | Instant HMR and optimized production bundling |
| **Styling & Design** | Tailwind CSS 3, PostCSS, Autoprefixer | Responsive mobile-first design system |
| **Icons & Visuals** | Lucide React | Modern, accessible SVG iconography |
| **Routing** | React Router DOM v6 | Single Page Application (SPA) navigation |
| **State Management** | React Context API (`AppContext.jsx`) | Global state synchronization & localStorage caching |
| **Hosting & CI/CD** | Vercel Edge & Aptech Stargate Server | High-availability multi-environment deployments |

---

## 📂 Project Structure

```text
Fresh-Find/
├── index.html                   # HTML5 Entry Point with Google Fonts & Meta tags
├── package.json                 # Dependency manifests and run scripts
├── vite.config.js               # Vite build tool configuration
├── tailwind.config.js           # Custom Tailwind design tokens & themes
├── postcss.config.js            # PostCSS plugin configurations
├── vercel.json                  # SPA routing configuration for Vercel
├── public/                      # Static assets & brand icons
│   ├── favicon.svg
│   └── placeholder-produce.jpg
└── src/
    ├── main.jsx                 # React root DOM initialization
    ├── App.jsx                  # Main routing shell & layout providers
    ├── index.css                # Tailwind utility imports & custom scrollbars
    ├── context/
    │   └── AppContext.jsx       # Central State (Cart, Bookmarks, Filters, Orders, Clock)
    ├── data/
    │   ├── markets.json         # 12 Geocoded Karachi Markets Dataset
    │   ├── produce.json         # Produce catalog, pricing, grades & nutrition data
    │   └── recipes.json         # Pakistani culinary recipe repository
    ├── utils/
    │   └── bookmarkUtils.js     # Storage helpers, multi-note normalization & parsing
    └── components/
        ├── Header.jsx           # Global sticky navbar, live stats, search bar
        ├── Footer.jsx           # Footnotes, project disclosures & quick links
        ├── MarketCard.jsx       # Interactive market summary card
        ├── ProduceCard.jsx      # Produce card with quality grades, price tags & cart CTA
        ├── MarketDetailModal.jsx# Full market operational breakdown & stall lists
        ├── CartDrawer.jsx       # Slide-out cart & frictionless delivery checkout
        ├── BookmarkPanel.jsx    # Saved items, multi-note manager & export engine
        ├── ChefSabziModal.jsx   # AI recipe recommender modal
        ├── OrderReceiptModal.jsx# Simulated digital invoice with download option
        ├── AuthModal.jsx        # Login & registration dialog
        └── FilterBar.jsx        # Category, grade, price & market filter toolbar
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
- `npm` or `yarn`

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fahadwork1-hash/Fresh-Find.git
   cd Fresh-Find
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in terminal).

4. **Create a production build:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 🧪 Functional Verification & Quality Assurance

| Test Scope | Target Component | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Market Directory** | `MarketCard.jsx` | All 12 Karachi markets load with accurate timing & location | **PASS** |
| **Produce Pricing** | `ProduceCard.jsx` | Rate comparison against wholesale baseline renders accurately | **PASS** |
| **Guest Checkout** | `CartDrawer.jsx` | Residents can confirm delivery without sign-in block | **PASS** |
| **Multi-Notes Engine** | `BookmarkPanel.jsx` | Notes save, edit, delete, and export cleanly as `.txt` | **PASS** |
| **Responsive Layout** | Mobile / Tablet / Desktop | 0 overflow issues, smooth drawer transitions | **PASS** |
| **Build Integrity** | Vite Production Build | Zero compilation or bundle errors | **PASS** |

---

## 👥 Credits & Acknowledgments
- **Project**: FreshFind Platform
- **Competition**: Aptech Techwiz 7
- **Development Center**: Aptech Metro Star Gate
- **Target Audience**: Karachi Citizens, Home Cooks, Local Farmers & Market Vendors
- **Mission**: Championing agricultural price transparency and civic digital convenience in Pakistan.

---

<p align="center">
  <strong>FreshFind — Freshness You Can Trust, Prices You Can Verify.</strong>
</p>
