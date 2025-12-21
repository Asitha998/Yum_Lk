# Improvements Guide (Not Too Advanced)

A practical set of small-to-medium upgrades you can apply without rewriting the project. Each idea includes where to change things and an incremental way to ship it.

## 1) Branding & Theme
- What: Make it look yours (colors, fonts, logo, copy).
- How:
  - Update global styles in `frontend/src/index.css` and component styles in `frontend/src/components/**/**/*.css` (e.g., `Navbar.css`, `Header.css`).
  - Replace hero images and logos in `frontend/public` and references in components.
  - Adjust text in `Header.jsx`, `Footer.jsx`, and `Navbar.jsx`.
- Tip: Keep a simple color palette and consistent spacing for a clean feel.

## 2) Categories, Search, and Filters
- What: Let users find food faster.
- How (frontend-only minimal version):
  - Add a search input in `frontend/src/components/Navbar/Navbar.jsx` or a new small component.
  - In `frontend/src/components/FoodDisplay/FoodDisplay.jsx`, keep a `searchTerm` state and filter `food_list` before rendering.
  - Use the existing categories UI in `ExploreMenu` and pass the selected category to `FoodDisplay` to filter.
- Optional (backend): Support `GET /api/food/list?category=...` to filter server-side.

## 3) Item Ratings (Lightweight)
- What: Show simple average rating on food cards.
- How (schema tweak + display):
  - Add optional fields in `backend/models/foodModel.js`: `rating: { type: Number, default: 4.5 }`, `ratingsCount: { type: Number, default: 10 }`.
  - Extend admin `Add` page to include rating fields (optional). If you skip admin UI, seed default values in the controller when creating items.
  - Render stars in `frontend/src/components/FoodItem/FoodItem.jsx`.

## 4) Favorites / Wishlist
- What: Let signed-in users favorite items.
- How:
  - Schema: add `favorites: { type: [String], default: [] }` to `backend/models/userModel.js`.
  - API: create `POST /api/user/favorites/add`, `POST /api/user/favorites/remove`, `POST /api/user/favorites/get` in a small `favorites` controller using `authMiddleware`.
  - Frontend: in `StoreContext.jsx`, add methods to call these endpoints and persist favorites in state; add a heart icon to `FoodItem.jsx`.

## 5) Simple Coupons (MVP)
- What: Apply a small discount by code.
- How (server light version):
  - Add a static list in `backend/controllers/orderController.js` like `{ SAVE10: 10, SAVE20: 20 }` (percent).
  - New endpoint `POST /api/order/coupon/apply` that validates code and returns discount percent.
  - Frontend: Add a field in `Cart.jsx` for code; call the endpoint and adjust the total; display the discount line.

## 6) Address Book
- What: Save multiple addresses and select during checkout.
- How:
  - Schema: in `backend/models/userModel.js`, add `addresses: { type: [Object], default: [] }`.
  - API: add `POST /api/user/address/add`, `/remove`, `/list` routes (auth required).
  - Frontend: in `PlaceOrder.jsx`, add an address selector with Add/Remove; default to the most recent.

## 7) Order Status UX
- What: Show clearer statuses and progress.
- How:
  - Keep backend status strings (already supports updates). Define a mapping in the frontend for steps: `Ordered → Processing → Out for Delivery → Delivered`.
  - Update `frontend/src/pages/MyOrders/MyOrders.jsx` to render a progress bar or badges based on `order.status`.
  - In admin `Orders.jsx`, use a dropdown with the same set for consistency.

## 8) Pagination or Lazy Loading (Menu)
- What: Improve performance with many items.
- How (frontend-only first):
  - In `FoodDisplay.jsx`, implement client-side pagination: `page`, `pageSize` state and slice the list.
  - Add buttons for Next/Prev or an infinite scroll sentinel.
- Optional (backend): Support `GET /api/food/list?page=1&limit=12` and paginate in MongoDB with `skip` and `limit`.

## 9) Validation & Error Toasts
- What: Friendlier feedback when things fail.
- How:
  - Use `react-toastify` (already in admin) in frontend: `npm i react-toastify` in `frontend/` and wrap app with `ToastContainer` in `App.jsx`.
  - In `StoreContext.jsx`, show success/error toasts for cart and auth actions.
  - Add basic form validation for login/register and checkout fields.

## 10) Image Upload Limits (Admin)
- What: Prevent huge uploads.
- How:
  - In `backend/routes/foodRoute.js`, configure multer with `limits: { fileSize: 2 * 1024 * 1024 }`.
  - Validate file type by checking `mimetype` (e.g., `image/jpeg`, `image/png`, `image/webp`).
  - Display a helpful message in admin `Add.jsx` if too large or wrong type.

## 11) Security & Config Clean-up
- What: Remove secrets from code and hard-coded URLs.
- How:
  - Move Mongo URI in `backend/config/db.js` to `process.env.MONGODB_URI`.
  - Ensure `.env` contains `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, and optionally `FRONTEND_URL`.
  - In `frontend/src/context/StoreContext.jsx`, read API base from an env var (Vite uses `import.meta.env.VITE_API_URL`) and fall back to `http://localhost:4000`.

## 12) Polishing Touches
- Accessibility: Ensure alt text on all images; focus styles on buttons/links.
- Loading states: Add skeleton loaders for menu and orders.
- Empty states: Show friendly text when cart or orders are empty.
- Copy tone: Write your brand story in `Footer` and `Header` to stand out.

---

## Minimal Step-by-Step Plan (Suggested Order)
1. Rebrand UI (colors, logo, copy).
2. Add search + category filtering.
3. Add ratings (display only) or favorites.
4. Implement coupons (server + client) and show discount in cart.
5. Improve order status visuals in My Orders + Admin.
6. Add image upload limits and better toasts.
7. Move configs to env vars and set `VITE_API_URL`.

## Env & Run Tips (Windows PowerShell)
Run these from the project root in separate terminals:

```powershell
# Backend
cd .\backend; npm install; npm run server

# Frontend (customer app)
cd .\frontend; npm install; npm run dev

# Admin
cd .\admin; npm install; npm run dev
```

Set environment files:
- `backend/.env`: `MONGODB_URI=...`, `JWT_SECRET=...`, `STRIPE_SECRET_KEY=...`, `FRONTEND_URL=http://localhost:5174`
- `frontend/.env`: `VITE_API_URL=http://localhost:4000`

Ship one improvement at a time, verify, then commit. This keeps changes safe and makes it easier to create your unique version without a rewrite.
