# 🌍 Collaborative Worldbuilding Platform

A full-stack MERN application for writers, game masters, and storytellers to build and manage fictional universes together.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based auth with httpOnly cookies
- 🌍 **World Management** — Create and manage multiple fictional worlds
- 📖 **Lore Wiki** — Write articles for characters, locations, factions, events and items with auto-linking between them
- 🗺️ **Interactive Map** — Drop pins on a world map and link them to lore articles
- 👥 **Characters** — Dedicated character profiles with bios
- 📜 **Timeline** — Chronological history of world events sorted by in-world date
- 🤝 **Collaboration** — Invite members to co-build your world with role-based access (owner, lore-keeper, contributor, reader)

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Leaflet.js / React-Leaflet

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Cookie-parser

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repo
\`\`\`bash
git clone https://github.com/harshita-macherla/collaborative-worldbuilding.git
cd collaborative-worldbuilding
\`\`\`

2. Setup the server
\`\`\`bash
cd server
npm install
\`\`\`

3. Create `server/.env`
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/worldbuilding
JWT_SECRET=your_secret_key_here
NODE_ENV=development
\`\`\`

4. Setup the client
\`\`\`bash
cd ../client
npm install
\`\`\`

5. Run both servers

Terminal 1 (backend):
\`\`\`bash
cd server
npm run dev
\`\`\`

Terminal 2 (frontend):
\`\`\`bash
cd client
npm run dev
\`\`\`

6. Open [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

\`\`\`
collaborative-worldbuilding/
├── client/                  # React frontend
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # Reusable components
│       ├── context/         # Auth context
│       └── pages/           # All page components
└── server/                  # Express backend
    ├── config/              # Database connection
    ├── controllers/         # Route logic
    ├── middleware/          # Auth protection
    ├── models/              # Mongoose schemas
    └── routes/              # API routes
\`\`\`

## 🔒 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/worlds` | Get all worlds |
| POST | `/api/worlds` | Create a world |
| GET | `/api/worlds/:id` | Get a world |
| DELETE | `/api/worlds/:id` | Delete a world |
| POST | `/api/worlds/:id/invite` | Invite a member |
| DELETE | `/api/worlds/:id/members/:memberId` | Remove a member |
| POST | `/api/worlds/:id/pins` | Add a map pin |
| DELETE | `/api/worlds/:id/pins/:pinId` | Delete a map pin |
| GET | `/api/articles/world/:worldId` | Get all articles |
| POST | `/api/articles/world/:worldId` | Create an article |
| GET | `/api/articles/:id` | Get single article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |

## 👩‍💻 Author

Built by Harshita Macherla
