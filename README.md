# MERN Authentication System

A production-style full stack authentication app: JWT session management, OTP-based email verification, bcrypt password hashing, and input validation — built with MongoDB, Express, React, and Node (MERN).

## Features
- Register with name, email, password (bcrypt-hashed)
- 6-digit OTP emailed for verification (OTP itself is hashed in the DB, expires in 10 min)
- Resend OTP
- Login (blocked until email is verified) issuing a JWT
- Protected `/dashboard` route + `/api/auth/me` endpoint guarded by JWT middleware
- Rate limiting on auth routes

## Project structure
```
mern-auth/
  backend/   Express API, MongoDB models, JWT + OTP logic
  frontend/  React app (Register, Verify OTP, Login, Dashboard)
```

## Prerequisites
- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas cluster
- An email account for sending OTPs (Gmail App Password is easiest, see below)

## 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — your local MongoDB URI or Atlas connection string
- `JWT_SECRET` — any long random string
- `EMAIL_USER` / `EMAIL_PASS` — to use Gmail: turn on 2-Step Verification on the Google account, then create an **App Password** at https://myaccount.google.com/apppasswords and use that 16-character value as `EMAIL_PASS` (your normal Gmail password will NOT work)

Start the API:
```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```
The API runs on `http://localhost:5000`.

## 2. Frontend setup
In a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
The app opens at `http://localhost:3000`.

## 3. Try it out
1. Go to `/register`, create an account.
2. Check the inbox of the email you registered with for a 6-digit OTP.
3. Enter it on the verify screen — you'll be logged in automatically and redirected to `/dashboard`.
4. Logout and log back in any time from `/login`.

## API endpoints
| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/auth/register`       | Create account, sends OTP email      |
| POST   | `/api/auth/verify-otp`     | Verify OTP, returns JWT              |
| POST   | `/api/auth/resend-otp`     | Resend a new OTP                     |
| POST   | `/api/auth/login`          | Login (must be verified), returns JWT|
| GET    | `/api/auth/me`             | Get current user (requires JWT)      |

## Notes / next steps
- For production, move the JWT out of `localStorage` into an httpOnly cookie to reduce XSS risk.
- Add password-reset (forgot password) flow using the same OTP pattern.
- Deploy backend (e.g. Render/Railway) + MongoDB Atlas + frontend (e.g. Vercel/Netlify); update `CLIENT_URL` and `REACT_APP_API_URL` accordingly.
