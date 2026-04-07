# 🌍 TripAdmin — Full-Stack Trip Management System

A complete admin dashboard built with **Node.js · Express.js · MongoDB · EJS**

---

## 📁 Folder Structure

```
trip-admin/
│
├── index.js                  ← Entry point (matches your reference)
├── package.json
├── .env                      ← Create from .env.example
├── .env.example
├── .gitignore
│
├── config/
│   └── db.js                 ← MongoDB connection
│
├── middlewares/
│   ├── auth.js               ← JWT protect + redirectIfLoggedIn
│   └── upload.js             ← Multer image upload
│
├── model/
│   ├── AdminModel.js         ← Admin schema (bcrypt)
│   └── TripModel.js          ← Trip schema
│
├── routes/
│   ├── authRoutes.js         ← /auth/login, /register, /logout
│   ├── adminRoutes.js        ← /admin/* (protected, all CRUD)
│   └── clientRoutes.js       ← / (public home)
│
├── views/
│   ├── partials/
│   │   ├── admin-start.ejs   ← Sidebar + topbar open
│   │   └── admin-end.ejs     ← Scripts + close tags
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── trips.ejs         ← List, search, filter, pagination
│   │   ├── addTrip.ejs
│   │   ├── editTrip.ejs
│   │   └── viewTrip.ejs
│   ├── client/
│   │   └── home.ejs          ← Public trips showcase
│   └── 404.ejs
│
└── public/
    ├── css/style.css
    ├── js/main.js
    └── uploads/              ← Uploaded trip images (gitignored)
```

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Steps

```bash
# 1 — Install dependencies
npm install

# 2 — Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/trip_admin
JWT_SECRET=replace_with_a_long_random_string_min_32_chars
SESSION_SECRET=another_random_secret_string
JWT_EXPIRES_IN=7d
```

```bash
# 3 — Start development server (auto-restart)
npm run dev

# OR start production server
npm start
```

```
Open → http://localhost:3000
Login → http://localhost:3000/auth/login
Admin → http://localhost:3000/admin/dashboard
```

> First time? Go to `/auth/register` to create your admin account.

---

## 🌐 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — TripAdmin"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trip-admin.git
git push -u origin main
```

---

## ☁️ Deploy Live (Free Options)

### Option A — Render.com (Recommended)
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all env vars from `.env` in the **Environment** tab
6. Use **MongoDB Atlas** URI for `MONGO_URI`

### Option B — Railway.app
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
Set env vars via the Railway dashboard.

### Option C — Cyclic.sh / Koyeb
Same pattern — connect repo, set env vars, deploy.

---

## 🔑 Environment Variables

| Variable         | Description                              |
|-----------------|------------------------------------------|
| `PORT`           | Server port (default 3000)              |
| `NODE_ENV`       | `development` or `production`           |
| `MONGO_URI`      | MongoDB connection string               |
| `JWT_SECRET`     | Secret key for JWT signing (min 32 chars)|
| `SESSION_SECRET` | Secret for express-session              |
| `JWT_EXPIRES_IN` | JWT expiry e.g. `7d`, `24h`            |

---

## 🛡️ Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT stored in **HTTP-only cookies** (inaccessible via JS)
- All `/admin/*` routes protected by `auth.js` middleware
- File uploads validated by MIME type + size (5 MB max)
- Input validated server-side before DB writes
- Sensitive config stored in `.env` — never committed

---

## 📦 Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Runtime     | Node.js 18+                  |
| Framework   | Express.js 4                 |
| Database    | MongoDB + Mongoose           |
| Templates   | EJS                          |
| Auth        | JWT + bcryptjs               |
| File Upload | Multer                       |
| UI          | Bootstrap 5 + Bootstrap Icons|
| Fonts       | Plus Jakarta Sans            |

---

## 📄 License

MIT
