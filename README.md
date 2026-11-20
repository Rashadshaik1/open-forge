
# OpenForge — Campus Community & Event Portal

[![Live Deployment](https://img.shields.io/badge/Live-Vercel-black?style=flat-square&logo=vercel)](https://open-forge-client.vercel.app/)
[![Stack](https://img.shields.io/badge/Stack-MERN-E53E24?style=flat-square)](https://github.com/Rashadshaik1)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#license)

**OpenForge** is a full-stack campus community and event operations platform built for the Department of Information Technology at Gayatri Vidya Parishad College of Engineering (GVPCE). It centralizes student event registrations, contactless QR attendance verification, automated credentialing, and multi-tenure committee directories into a unified portal.

---

## Key Features

### Event Operations & Registration
* **Centralized Event Discovery:** Students can browse upcoming workshops, hackathons, and technical events with real-time registration tracking.
* **Contactless QR Ticketing:** Generates unique QR passes upon registration for rapid, on-ground check-in verification by event volunteers.
* **Live Attendance Roster:** Real-time participant dashboards allowing coordinators to monitor check-in metrics and export event rosters.

### Automated Credentialing
* **On-Demand Certificate Generation:** Automatically issues verifiable digital certificates to verified attendees once an event concludes, eliminating manual distribution backlogs.

### Multi-Tenure Governance & Directory
* **Dynamic Academic Year Switching:** Preserves institutional history by separating the Founding Alumni Council (`2025–2026`) from the Active Working Committee (`2026–2027`) and future boards.
* **Tiered Role Architecture:** Distinct directory views and permissions across **Faculty Mentors**, **Core Board Members**, **Student Volunteers**, and **Students**.
* **Role-Based Access Control (RBAC):** Protected administrative endpoints secured via stateless JWT authentication.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, REST APIs |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Deployment** | Vercel (Client), Render (API Server), MongoDB Atlas |

---

## Project Structure

```text
open-forge/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios instance & endpoint services
│   │   ├── components/     # Reusable UI & navigation components
│   │   ├── data/           # Static historical alumni fallback data
│   │   └── pages/          # Route views (Events, TeamPage, Admin, Auth)
│   └── package.json
└── server/                 # Node.js + Express backend
    ├── src/
    │   ├── controllers/    # Route handlers (Auth, Events, Registrations, Team)
    │   ├── middlewares/    # JWT verification & role authorization guards
    │   ├── models/         # Mongoose schemas (User, Event, Registration)
    │   └── routes/         # Express API route definitions
    └── package.json

```

---

## Local Setup & Installation

### Prerequisites

* Node.js (v18+)
* MongoDB (Local instance or MongoDB Atlas URI)

### 1. Clone the Repository

```bash
git clone [https://github.com/Rashadshaik1/open-forge.git](https://github.com/Rashadshaik1/open-forge.git)
cd open-forge

```

### 2. Backend Configuration

```bash
cd server
npm install

```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Configuration

```bash
cd ../client
npm install

```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api

```

Start the Vite development server:

```bash
npm run dev

```

---

## Live Portal

Access the production application at **[open-forge-client.vercel.app](https://open-forge-client.vercel.app/)**.

---

## License

This project is licensed under the MIT License.

```

```
