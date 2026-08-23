<div align="center">

# 🗳️ eVote

### Secure Remote Voting System

A full-stack academic prototype demonstrating a digital election workflow —
citizen authentication, electoral verification, secret-ballot voting,
election management, results visualization, multilingual access, and an
AI election assistant.

<br>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-00C853?style=for-the-badge)
![States](https://img.shields.io/badge/Demo%20States-6-FF9933?style=for-the-badge)
![AI](https://img.shields.io/badge/AI%20%2F%20RAG-Enabled-8E44AD?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Academic%20Prototype-2962FF?style=for-the-badge)

<br>

[🎥 Watch Demo](https://youtu.be/z5MCXY6QFm8) · [Installation](#-installation) · [Features](#-key-features) · [Author](#-author)

</div>

---

## 🚀 Project Status

**Academic Prototype**

This is an academic/demonstration project. All elections, states, constituencies,
candidates, and voting results are **simulated data** created for the purpose of
this project. eVote is **not** connected to any official electoral authority,
government system, or the Election Commission of India, and it is **not** a
production election system.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Citizen Voting Workflow](#-citizen-voting-workflow)
- [Admin Workflow](#-admin-workflow)
- [AI Election Assistant](#-ai-election-assistant)
- [Security](#-security)
- [Multi-State Demonstration](#-multi-state-demonstration)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Demo Video](#-demo-video)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [API Overview](#-api-overview)
- [Verification](#-verification)
- [Project Documentation](#-project-documentation)
- [Limitations](#-limitations)
- [Future Scope](#-future-scope)
- [Author](#-author)
- [License](#-license)

---

## 🗳️ Overview

**eVote** is a full-stack **React + Node.js + Express + MongoDB** application
built to demonstrate what a digital remote-voting experience could look like —
from citizen sign-up and identity verification through to ballot casting,
receipt generation, and results reporting.

It was built as a final-year Computer Science engineering project to explore:

- How authentication, OTP verification, and role-based access control can be
  layered together in a security-conscious web application
- How a state-aware, multi-election voting workflow can be modeled and enforced
  on the backend
- How an AI assistant can be constrained to a narrow, policy-governed domain
  (election information) using a controlled knowledge base
- How a modern MERN-stack application can be structured with a clean
  routes → controllers → services → repositories → models layering

The project is a **prototype for academic evaluation and portfolio
presentation**, not a certified or government-affiliated voting system.

---

## ✨ Key Features

| Area | Capability |
|---|---|
| 🔐 Authentication | JWT-based sessions, bcrypt password hashing, HttpOnly cookies |
| 📱 OTP Verification | Six-digit OTP login flow with configurable SMS provider |
| 🪪 Electoral Verification | Citizen KYC-style verification before ballot access |
| 🗳️ Voting | Election-specific ballot casting with duplicate-vote prevention |
| 🧾 Receipts | Client-side PDF voting receipt generation (jsPDF) |
| 📜 Voting History | Per-citizen record of past voting participation |
| 📊 Results & Analytics | Election, candidate, and constituency-level results with charts |
| 🏛️ Multi-Election | Independently managed elections across six demo states |
| 🤖 AI Election Assistant | Domain-restricted assistant with a controlled knowledge base |
| 🧠 RAG Knowledge Base | Curated election Q&A knowledge used to ground assistant responses |
| 🛡️ Admin Console | Election, candidate, citizen, announcement, FAQ, and contact management |
| 📈 Live Voting Monitor | Admin-facing live voting/analytics dashboard |
| 📋 Audit Logs | Administrative action logging for accountability |
| 🌐 Multilingual UI | English, Telugu, Hindi, Tamil, Kannada, Marathi |
| 📱 Responsive UI | Tailwind CSS layouts for desktop, tablet, and mobile |
| 🚦 Rate Limiting | Global, auth, OTP, and AI-specific request throttling |

---

## 🧭 Citizen Voting Workflow

```text
Citizen
  │
  ▼
Login (password or OTP)
  │
  ▼
Electoral / KYC Verification
  │
  ▼
Browse Active Elections (by state)
  │
  ▼
Review Candidates
  │
  ▼
Cast Vote
  │
  ▼
Vote Confirmation
  │
  ▼
PDF Receipt
  │
  ▼
Voting History / Results
```

1. **Login** — Citizens authenticate with a password or a six-digit OTP.
2. **Verification** — First-time citizens complete an electoral verification
   step before they can access voting features.
3. **Elections** — Citizens browse active elections, scoped to their
   registered state and constituency.
4. **Candidates & Ballot** — Candidate and party details are shown before the
   ballot is cast.
5. **Vote & Confirmation** — The vote is submitted once; the backend enforces
   one-vote-per-election-per-citizen.
6. **Receipt** — A downloadable PDF receipt confirms participation without
   revealing the candidate selected.
7. **History & Results** — Citizens can review their voting history, and
   published results/turnout analytics are available.

---

## 🛠️ Admin Workflow

```text
Admin Login
  → Dashboard (KPIs, charts, recent activity)
  → Election Management
  → Candidate Management
  → Citizen Management
  → Live Voting Monitor
  → Results & Analytics
  → Announcements
  → FAQs
  → Contact Submissions
  → Audit Logs
  → User Management
```

Administrators authenticate through the same JWT-based auth system with a
role check (`authorize('admin')`) applied to every admin route, and can
manage the full election lifecycle — creating and updating elections and
candidates, monitoring participation, reviewing results, publishing
announcements, and reviewing an audit trail of administrative actions.

---

## 🤖 AI Election Assistant

eVote includes an in-app AI Election Assistant, accessible to authenticated
citizens, built around a **controlled knowledge base** rather than
open-ended general-purpose chat.

The assistant is explicitly scoped by its system instructions to:

- Answer election-related questions using a curated **RAG-style knowledge
  base** (candidate lists, constituency information, election procedures)
- Stay within the citizen's own authorized jurisdiction/context when
  answering personalized questions
- **Preserve political neutrality** — it will not recommend, favor, or rank
  any candidate or party, even if directly asked
- **Preserve ballot secrecy** — it will not reveal how a citizen voted; it
  can confirm participation only
- **Decline out-of-domain requests** and avoid disclosing internal technical
  details (databases, tokens, infrastructure)
- **Resist prompt-injection style requests** (e.g. attempts to extract
  credentials or bypass verification) through pattern-based filtering before
  a request reaches the model

The assistant is not a general-purpose chatbot and does not provide
political recommendations — it is designed to provide controlled,
informational assistance within the application's supported election domain.

---

## 🔐 Security

Security mechanisms actually implemented in the codebase:

- **JWT authentication** with HttpOnly cookie and bearer token support
- **bcrypt** password hashing
- **Helmet** for HTTP security headers
- **CORS** configuration restricting allowed origins
- **express-rate-limit** — global, auth, OTP, and AI-chat-specific limiters
- **express-validator** — request validation on every mutating endpoint
- **xss-clean** middleware for input sanitization
- **Role-based authorization** (`citizen` vs `admin`) enforced per route
- **Duplicate-vote prevention** enforced at the service/repository layer
- **Secret-ballot handling** — voting receipts confirm participation without
  exposing candidate selection through the AI assistant
- **Prompt-injection filtering** on AI assistant input
- **.env**-based secret management, with `.env` excluded from version control

This project has **not** undergone independent third-party security auditing.
It should be treated as an educational demonstration of these mechanisms,
not as a hardened, production-grade security posture.

---

## 🗺️ Multi-State Demonstration

eVote ships with **six** fictional/demonstration state election datasets
used to illustrate state-aware election authorization:

| State | Capital | Demo Commission Name |
|---|---|---|
| Telangana | Hyderabad | Telangana State Election Commission |
| Andhra Pradesh | Amaravati | Andhra Pradesh State Election Commission |
| Delhi | New Delhi | State Election Commission of NCT of Delhi |
| Tamil Nadu | Chennai | Tamil Nadu State Election Commission |
| Maharashtra | Mumbai | Maharashtra State Election Commission |
| Assam | Dispur | Assam State Election Commission |

Each state includes a small set of demo constituencies with illustrative
registered-voter counts. **All state, constituency, candidate, and voter
data are simulated for demonstration purposes** and do not represent real
electoral rolls, real candidates, or real government data.

---

## 🧰 Technology Stack

**Frontend**
- React 19, Vite 8
- React Router 7
- Tailwind CSS
- Axios
- react-hook-form
- react-i18next / i18next (multilingual UI)
- Recharts (charts/analytics)
- jsPDF (voting receipts)
- Framer Motion (UI animation)
- react-hot-toast

**Backend**
- Node.js, Express 5
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- express-rate-limit
- Helmet, CORS, xss-clean, cookie-parser
- Multer, Nodemailer
- Morgan (request logging)

**AI**
- Custom AI assistant service with a curated RAG-style knowledge base and
  a pluggable AI provider layer

**Development Tools**
- ESLint, Prettier, oxlint

---

## 🏗️ System Architecture

```text
┌──────────────────────┐
│   React Frontend     │
│  Pages / Components   │
│  Contexts / Services  │
└──────────┬────────────┘
           │ REST API (Axios)
           ▼
┌───────────────────────────────────┐
│      Express API Server           │
│  Helmet → CORS → Rate Limit       │
├────────────────────────────────────┤
│  Routes → Controllers → Validators │
│              │                     │
│              ▼                     │
│           Services                 │
│      (business logic, AI, RAG)     │
│              │                     │
│              ▼                     │
│         Repositories               │
│      (data access layer)           │
│              │                     │
│              ▼                     │
│            Models                  │
│       (Mongoose schemas)           │
└──────────────┬─────────────────────┘
               │
               ▼
      ┌─────────────────┐
      │     MongoDB      │
      └─────────────────┘
```

The backend follows a layered architecture: routes define endpoints,
controllers handle request/response, validators check input, services hold
business logic (including the AI/RAG assistant and its knowledge base),
repositories abstract database access, and Mongoose models define schemas.
See [`docs/architecture.md`](docs/architecture.md) for the full breakdown.

---

## 📁 Project Structure

```text
eVote-Telangana/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── public/      # Home, About, Elections info, Results, FAQ, Contact
│       │   ├── auth/        # Login, Register, Forgot Password
│       │   ├── citizen/     # Dashboard, Verification, Elections, Vote, History
│       │   └── admin/       # Dashboard, Elections, Candidates, Citizens, Live Voting,
│       │                    # Results, Announcements, Audit Logs, Users, FAQs, Contacts
│       ├── components/      # UI, auth, layout, shared, and AI assistant components
│       ├── layouts/         # Public, Auth, Citizen, Admin layouts
│       ├── routes/          # AppRoutes.jsx (route definitions)
│       ├── contexts/        # App-level React context
│       ├── i18n/            # Multilingual translations (en, te, hi, ta, kn, mr)
│       ├── services/        # Axios API service layer
│       └── hooks/, utils/, constants/, assets/, styles/
│
├── server/                  # Node.js + Express backend
│   └── src/
│       ├── routes/          # auth, citizens, elections, candidates, votes, results,
│       │                    # dashboard, contact, faqs, announcements, assistant, ai, audit-logs
│       ├── controllers/     # Request/response handling
│       ├── validators/      # express-validator schemas
│       ├── services/        # Business logic incl. auth, voting, AI assistant, RAG
│       ├── repositories/    # Data access layer
│       ├── models/          # Mongoose schemas
│       ├── middlewares/     # Auth, rate limiting, error handling
│       ├── constants/       # Demo accounts, RAG knowledge base, state/election data
│       └── config/          # Env, DB, CORS, logging config
│
├── docs/
│   └── architecture.md      # System architecture documentation
├── database/
│   └── README.md
├── LICENSE
└── README.md
```

---

## 🎥 Demo Video

▶️ **Watch the eVote application walkthrough**

[![eVote Demo](https://img.youtube.com/vi/z5MCXY6QFm8/maxresdefault.jpg)](https://youtu.be/z5MCXY6QFm8)

**Demo flow:** Login → OTP/Verification → Elections → Ballot → Vote → Receipt → History → Results → AI Assistant

---

## ⚙️ Installation

### Prerequisites

- Node.js 18+
- npm
- A running MongoDB instance (local or hosted)

### Clone the repository

```bash
git clone https://github.com/badavathmadanlal/eVote-Telangana.git
cd eVote-Telangana
```

### Backend setup

```bash
cd server
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # starts the API with --watch
# or
npm start                # standard start
```

### Frontend setup

```bash
cd client
npm install
cp .env.example .env   # then fill in your own values
npm run dev              # starts the Vite dev server
```

Other available scripts:

| Location | Script | Description |
|---|---|---|
| `server` | `npm run lint` / `npm run lint:fix` | ESLint checks |
| `server` | `npm run format` | Prettier formatting |
| `client` | `npm run build` | Production build |
| `client` | `npm run preview` | Preview the production build |
| `client` | `npm run lint` | oxlint checks |

---

## 🔧 Environment Configuration

Never commit real secrets. Use the provided `.env.example` files as a
starting point and keep your actual `.env` files out of version control.

**`server/.env`**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/remote_voting_system
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# SMS_PROVIDER options: 'fast2sms' | 'twilio' | 'msg91' | 'mock'
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_fast2sms_api_key_here
FAST2SMS_OTP_ID=your_fast2sms_otp_id_here

TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

MSG91_AUTH_KEY=your_msg91_auth_key_here
MSG91_SENDER_ID=EVOTET
MSG91_TEMPLATE_ID=your_dlt_template_id_here
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Remote Voting System
```

---

## 🔌 API Overview

The API is mounted under `/api/v1`. High-level endpoint groups (see
`server/src/routes/` for full route definitions):

| Group | Base Path | Purpose |
|---|---|---|
| Auth | `/api/v1/auth` | Register, login, OTP login, password reset, current user |
| Citizens | `/api/v1/citizens` | Electoral verification, citizen profile, admin citizen list |
| Elections | `/api/v1/elections` | Browse and manage elections |
| Candidates | `/api/v1/candidates` | Candidate listing and admin management |
| Votes | `/api/v1/votes` | Cast a vote, voting history, vote status, election results |
| Results | `/api/v1/results` | Admin-only analytics and result breakdowns |
| Dashboard | `/api/v1/dashboard` | Admin KPIs, charts, recent activity |
| Announcements | `/api/v1/announcements` | Public announcements + admin CRUD |
| FAQs | `/api/v1/faqs` | Public FAQ listing + admin CRUD |
| Contact | `/api/v1/contact` | Public contact submissions + admin management |
| Audit Logs | `/api/v1/audit-logs` | Admin-only audit trail |
| Assistant | `/api/v1/assistant` | Public-facing chat endpoint |
| AI | `/api/v1/ai` | Authenticated citizen AI chat (rate-limited) |

A health check is available at `GET /api/health`.

---

## ✅ Verification

The following areas have been exercised as part of this project's own
development and manual demo testing (not an independent security audit):

- Frontend production build (`vite build`)
- Backend server startup and health check
- Authentication (password login, OTP login, registration, password reset)
- Electoral/KYC verification flow
- Vote casting and duplicate-vote prevention
- PDF receipt generation
- Election results and admin analytics
- AI assistant responses, neutrality, and ballot-secrecy behavior
- Multilingual UI switching
- Responsive layout across desktop/tablet/mobile viewports

---

## 📄 Project Documentation

- [System Architecture](docs/architecture.md)
- [Demo Video](https://youtu.be/z5MCXY6QFm8)
- [Database Notes](database/README.md)

A formal final-year project report is not included in this repository.

---

## ⚠️ Limitations

- All election, candidate, and voter data is **simulated/demo data** created
  for this project — it does not represent real electoral rolls or results.
- The system is **not connected** to any official electoral infrastructure,
  Aadhaar authentication, or the Election Commission of India.
- This is **not a replacement** for a government election system.
- Real-world deployment would require independent security audits, legal
  and regulatory compliance review, hardened infrastructure, and official
  integration with electoral authorities — none of which are in scope here.
- SMS OTP delivery depends on a configured third-party provider; without
  valid credentials, the project falls back to demo/mock behavior.

---

## 🔭 Future Scope

*(Planned ideas — not currently implemented)*

- Production-grade cloud deployment
- Independent third-party security audit
- Stronger identity verification integrations
- Scalable, horizontally-distributed infrastructure
- Monitoring and observability tooling
- Accessibility (WCAG) improvements
- Official electoral infrastructure integration
- Native mobile application
- Advanced, tamper-evident audit mechanisms

**Live deployment:** Coming soon
**Android application:** Planned / future scope

---

## 👤 Author

**Badavath Madanlal**

B.Tech, Computer Science & Engineering
National Institute of Technology, Silchar


[![GitHub](https://img.shields.io/badge/GitHub-badavathmadanlal-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/badavathmadanlal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/badavathmadanlal/)

---

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

<div align="center">

Made for academic demonstration by **Badavath Madanlal**

</div>
