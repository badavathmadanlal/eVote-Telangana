# 🗳️ Remote Voting System

An enterprise-grade, full-stack remote voting platform built with modern web technologies. Designed for secure, transparent, and accessible digital elections.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Remote Voting System enables organizations to conduct secure remote elections. It features:

- **Secure Authentication** — JWT-based auth with bcrypt password hashing
- **Election Management** — Create, configure, and manage elections
- **Real-time Voting** — Cast votes securely with double-vote prevention
- **Result Analytics** — View election results with visual analytics
- **Role-based Access** — Admin, Voter, and Election Officer roles
- **Audit Trail** — Complete logging and audit capabilities

---

## Technology Stack

### Frontend
| Technology       | Purpose                    |
|----------------- |--------------------------- |
| React 19         | UI library                 |
| Vite             | Build tool & dev server    |
| Tailwind CSS 3   | Utility-first CSS          |
| React Router DOM | Client-side routing        |
| Axios            | HTTP client                |

### Backend
| Technology       | Purpose                    |
|----------------- |--------------------------- |
| Node.js          | Runtime environment        |
| Express          | Web framework              |
| MongoDB          | NoSQL database             |
| Mongoose         | ODM for MongoDB            |

### Security & Auth
| Technology       | Purpose                    |
|----------------- |--------------------------- |
| JWT              | Token-based authentication |
| bcrypt           | Password hashing           |
| Helmet           | HTTP security headers      |
| CORS             | Cross-origin policy        |
| express-rate-limit | Rate limiting            |
| xss-clean        | XSS protection             |

### Dev Tools
| Technology       | Purpose                    |
|----------------- |--------------------------- |
| ESLint           | Code linting               |
| Prettier         | Code formatting            |
| Morgan           | HTTP request logging       |
| dotenv           | Environment variables      |

---

## Project Structure

```
RemoteVotingSystem/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, icons
│   │   ├── components/         # Reusable UI components
│   │   ├── constants/          # App-wide constants
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layout components
│   │   ├── pages/              # Route page components
│   │   ├── routes/             # Route configuration
│   │   ├── services/           # API service layer
│   │   ├── styles/             # Global styles & Tailwind
│   │   └── utils/              # Utility functions
│   ├── .env                    # Environment variables
│   ├── index.html              # HTML entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── config/             # App configuration
│   │   ├── constants/          # Constants & enums
│   │   ├── controllers/        # Route handlers
│   │   ├── middlewares/        # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   └── validators/         # Request validation
│   ├── logs/                   # Application logs
│   ├── .env                    # Environment variables
│   └── package.json            # Backend dependencies
│
├── database/                   # Database documentation
├── docs/                       # Project documentation
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x — [Download](https://nodejs.org/)
- **MongoDB** >= 6.x — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RemoteVotingSystem
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

**What each command does:**
- `npm install` — Installs all backend dependencies listed in `package.json`
- `cp .env.example .env` — Creates your local environment file from the template
- `npm run dev` — Starts the Express server with `--watch` flag for auto-restart on file changes

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

**What each command does:**
- `npm install` — Installs all frontend dependencies including React, Vite, and Tailwind CSS
- `npm run dev` — Starts the Vite development server with Hot Module Replacement (HMR)

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## Environment Variables

### Backend (`server/.env`)

| Variable              | Description                          | Default                              |
|---------------------- |------------------------------------- |------------------------------------- |
| `NODE_ENV`            | Environment mode                     | `development`                        |
| `PORT`                | Server port                          | `5000`                               |
| `MONGO_URI`           | MongoDB connection string            | `mongodb://localhost:27017/remote_voting_system` |
| `JWT_SECRET`          | JWT signing secret                   | —                                    |
| `JWT_EXPIRE`          | JWT expiration duration              | `7d`                                 |
| `CORS_ORIGIN`         | Allowed CORS origin                  | `http://localhost:5173`              |
| `RATE_LIMIT_WINDOW_MS`| Rate limit window (milliseconds)    | `900000` (15 min)                    |
| `RATE_LIMIT_MAX`      | Max requests per window              | `100`                                |

### Frontend (`client/.env`)

| Variable              | Description                          | Default                              |
|---------------------- |------------------------------------- |------------------------------------- |
| `VITE_API_BASE_URL`   | Backend API base URL                 | `http://localhost:5000/api`          |
| `VITE_APP_NAME`       | Application display name             | `Remote Voting System`               |

---

## Available Scripts

### Backend (`server/`)

| Command           | Description                                    |
|------------------ |----------------------------------------------- |
| `npm run dev`     | Start server with auto-restart (development)   |
| `npm start`       | Start server (production)                      |
| `npm run lint`    | Run ESLint                                     |
| `npm run lint:fix`| Run ESLint with auto-fix                       |
| `npm run format`  | Format code with Prettier                      |

### Frontend (`client/`)

| Command           | Description                                    |
|------------------ |----------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                 |
| `npm run build`   | Build for production                           |
| `npm run preview` | Preview production build                       |
| `npm run lint`    | Run ESLint                                     |

---

## API Documentation

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Server is healthy",
  "data": {
    "uptime": 123.456,
    "environment": "development",
    "timestamp": "2026-01-01T00:00:00.000Z"
  },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### Standard API Response Format

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Field 'email' is required"],
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

## Architecture

This project follows a **layered architecture** pattern:

```
Routes → Controllers → Services → Repositories → Models
```

Each layer has a single responsibility:
- **Routes** define API endpoints
- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Repositories** abstract database operations
- **Models** define data schemas

For detailed architecture documentation, see [docs/architecture.md](docs/architecture.md).

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.
