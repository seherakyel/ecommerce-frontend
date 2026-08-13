# ShopNova — E-Commerce Frontend

The frontend of **ShopNova**, a full-stack e-commerce application. Built with **React** and **Vite**, it provides product browsing, a multi-level category mega menu, search, cart, orders, favorites, and user account management.

**Live Demo:** [ecommerce-frontend-rho-one.vercel.app](https://ecommerce-frontend-rho-one.vercel.app)
**Backend Repository:** [ecommerce-backend](https://github.com/seherakyel/ecommerce-backend)

---

## Features

- **Product Browsing & Detail Pages** — Grid of products with a rich detail page (image, price, stock, breadcrumb, accordions).
- **Multi-Level Category Mega Menu** — A three-level category navigation with hover-based dropdowns.
- **Search** — Debounced product search from the header.
- **Authentication** — Register and login with JWT stored in localStorage; protected routes redirect unauthenticated users.
- **Shopping Cart** — Add items, adjust quantity, and place orders.
- **Favorites** — Toggle favorite products.
- **Order History** — View past orders.
- **Account Management** — Profile and address management (full CRUD for addresses).
- **Product Sharing** — Share products via WhatsApp, X, Facebook, or copy link.

---

## Tech Stack

| Layer      | Technology   |
| ---------- | ------------ |
| Framework  | React        |
| Build Tool | Vite         |
| Routing    | React Router |
| Styling    | CSS          |
| Deployment | Vercel       |

---

## Getting Started

**Requirements:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/seherakyel/ecommerce-frontend.git
cd ecommerce-frontend

# Install dependencies
npm install

# Set the API URL (see below), then start the dev server:
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root:

| Variable       | Description                 | Example                 |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |

For production (Vercel), set `VITE_API_URL` to the deployed backend URL.

---

## Build

```bash
npm run build
```

The production-ready files are generated in the `dist/` directory.

---

## Project Structure

```
src/
├── main.jsx              # App entry point (BrowserRouter)
├── App.jsx               # Layout, header, mega menu, routes
├── config.js            # Reads VITE_API_URL
├── ProductsPage.jsx      # Product grid
├── ProductDetailPage.jsx # Product detail
├── CartPage.jsx          # Shopping cart
├── LoginPage.jsx         # Login
├── RegisterPage.jsx      # Registration
├── OrdersPage.jsx        # Order history
├── FavoritesPage.jsx     # Favorites
├── AddressesPage.jsx     # Address management
├── ProfilePage.jsx       # User profile
└── ProtectedRoute.jsx    # Auth guard for protected routes
```
