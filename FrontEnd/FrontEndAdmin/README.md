# UniLifeT Admin

React admin app built with Vite. Tables, dashboard counts, and profile details are loaded from the UniLifeT backend API; no demo records are embedded in the interface.

## Run locally

1. Start the backend at `http://localhost:8080`.
2. From this folder, run `npm install`.
3. Run `npm run dev` and open `http://127.0.0.1:5502`.

Sign in with an account whose backend role is `ADMIN`. Set `VITE_API_URL` in `.env` if the backend uses another URL. Admin API calls are proxied by Vite during development.

The backend currently has no admin API for rental requests. The admin app therefore shows rental contracts from `GET /user-room` instead.
