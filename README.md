# Helixo Countdown Timer & Analytics

A professional-grade Shopify application built with the MERN stack and Shopify CLI 3.0. This app allows merchants to create high-conversion countdown timers (Fixed & Evergreen) with built-in analytics.

## 🚀 Key Architectural Decisions

### 1. Storefront Performance (Preact)
To meet the strict <30KB bundle size requirement, we utilized **Preact** for the storefront widget. 
- **Result**: The final widget bundle is ~12KB gzipped.
- **Benefit**: Zero impact on the merchant's Lighthouse speed scores and SEO.

### 2. Multi-Tenant Data Isolation
The MongoDB schema implements a `shopDomain` index. All API controllers enforce a strict filter on this field to ensure data privacy between different Shopify stores.

### 3. Cumulative Layout Shift (CLS) Prevention
We pre-allocate space for the timer using a CSS `min-height` on the anchor element within the Liquid block. This ensures a smooth user experience as the timer hydrates.

### 4. Evergreen Strategy
Evergreen timers use `localStorage` to persist a unique start timestamp per visitor, creating a personalized urgency experience that resets based on the merchant's configuration.

## 🛠 Tech Stack
- **Frontend**: React (Admin) / Preact (Storefront)
- **Backend**: Node.js / Express
- **Database**: MongoDB (Mongoose)
- **UI System**: Shopify Polaris 12.0+
- **Extension**: Theme App Extension (Liquid + JS)

## 📡 API Documentation

### Timers
- `GET /api/timers` - Fetch all timers for the current shop.
- `POST /api/timers` - Create a new timer configuration.
- `GET /api/active-timer` - Public endpoint for storefront to fetch the relevant timer for a product.

### Analytics
- `POST /api/timers/:timerId/impression` - Atomic increment of the impression count.

## 💻 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aswinrajr/Helixo-Task.git
   ```
2. **Install Dependencies**:
   ```bash
   cd web
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the root based on `.env.example`.
4. **Run Development Server**:
   ```bash
   # Start Backend & Frontend
   npm run dev
   npx vite
   ```

## 🧪 Testing
Run business logic unit tests using:
```bash
npm test
```
