# UniLifeT Owner Frontend

React + Vite interface for motel owners. All displayed business data is loaded from the UniLifeT backend.

## Run

1. Start the Spring Boot backend at `http://localhost:8080`.
2. In this folder, run `npm install` and then `npm run dev`.
3. Open `http://127.0.0.1:5503` and sign in with an account whose role is `OWNER`.

Vite proxies `/api/*` to the backend. Set `VITE_API_URL` if the backend uses a different base URL.

## Owner screens

- Dashboard and counts from owner-scoped backend endpoints
- Motel, room, and post create, update, and delete
- Rental request decisions and viewing appointment status updates
- Owner room contracts and tenant details
- Room amenity assignments and motel/room image URL management
- Statistics and read-only current account profile
