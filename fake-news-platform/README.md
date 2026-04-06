# TruthScan — Fake News Detection Platform
> AI-powered MERN stack. Detects Fake / Real / Suspicious news with confidence scores.
> Frontend (React + Vite) and Backend (Express + MongoDB) are **fully connected** via Vite proxy.

---

## ⚡ One-Command Start

```bash
# Install all dependencies (run once)
npm run install:all

# Start BOTH servers simultaneously
npm run dev
```

- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173 ← open this

---

## 🔌 How They're Connected

```
Browser (port 5173)
  → axios.post("/api/auth/login")
  → Vite proxy (vite.config.js) intercepts /api/*
  → Forwards to Express (port 5000)
  → Returns JSON + sets JWT cookie
  → Cookie sent automatically on future requests (withCredentials: true)
```

**Files that wire it together:**
- `client/vite.config.js` — proxy rule: `/api` → `http://localhost:5000`
- `client/src/lib/axios.js` — `baseURL: "/api"`, `withCredentials: true`
- `server/index.js` — CORS allows `http://localhost:5173` with credentials

---

## 🛠 Setup

### 1. Install dependencies
```bash
cd fake-news-platform
npm run install:all
```

### 2. Configure server/.env
Already created with defaults. Edit if needed:
```env
MONGO_URI=mongodb://localhost:27017/fakenewsdb
JWT_SECRET=truthscan_jwt_secret_change_me
OPENAI_API_KEY=your_key_here    # optional - mock AI works without it
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB
```bash
mongod    # local install
# OR use MongoDB Atlas connection string in .env
```

### 4. Run
```bash
npm run dev
```
Open **http://localhost:5173** 🎉

---

## 📁 Structure

```
fake-news-platform/
├── package.json          ← root: npm run dev starts BOTH servers
├── server/
│   ├── .env              ← pre-configured environment
│   ├── index.js          ← Express app (CORS, routes)
│   ├── config/db.js
│   ├── models/           ← User.model.js, News.model.js
│   ├── controllers/      ← auth.controller.js, news.controller.js
│   ├── middleware/       ← auth.middleware.js (JWT guard)
│   ├── routes/           ← auth.routes.js, news.routes.js
│   └── services/ai.service.js ← OpenAI + mock fallback
└── client/
    ├── vite.config.js    ← /api proxy → localhost:5000
    ├── src/lib/axios.js  ← withCredentials + baseURL="/api"
    ├── src/context/AuthContext.jsx
    ├── src/pages/        ← Landing, Login, Signup, Analyze, Dashboard
    └── src/components/   ← Navbar, ResultBadge, ConfidenceMeter, NewsCard, StatsBar
```

---

## 🔌 API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login + JWT cookie |
| POST | `/api/auth/logout` | ❌ | Clear cookie |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/news/analyze` | ✅ | AI analysis |
| GET | `/api/news/history` | ✅ | Past analyses |
| PATCH | `/api/news/feedback/:id` | ✅ | Submit feedback |

---

## 🚨 Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB error | Run `mongod` or use Atlas URL |
| Port 5000 in use | Change `PORT` in `.env` + update `vite.config.js` target |
| CORS error | Always open the `:5173` URL (never `:5000` directly) |
| Login not sticking | Clear cookies and try again |
