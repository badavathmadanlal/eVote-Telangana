<div align="center">

# 🗳️ eVoter

### Secure • State-Aware • Multi-Election Digital Voting

A modern full-stack remote voting platform designed as an academic
demonstration of secure authentication, citizen verification,
state-aware election authorization, secret-ballot workflows,
AI assistance, analytics, and responsive digital election access.

<br>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

<br>

![Security](https://img.shields.io/badge/Security-Audited-00C853?style=for-the-badge)
![Multi State](https://img.shields.io/badge/States-6-FF9933?style=for-the-badge)
![Responsive](https://img.shields.io/badge/UI-Responsive-2962FF?style=for-the-badge)
![AI](https://img.shields.io/badge/AI%20%2F%20RAG-Enabled-8E44AD?style=for-the-badge)

<br><br>

> **eVoter is an academic remote voting platform demonstrating how a
> modern digital election experience can be designed around
> authentication, verification, privacy, authorization and usability.**

</div>

---

# 📖 Table of Contents

- [About eVoter](#-about-evoter)
- [Project Highlights](#-project-highlights)
- [Core Features](#-core-features)
- [Voting Workflow](#-voting-workflow)
- [Multi-Election Authorization](#-multi-election-authorization)
- [Supported States](#-supported-states)
- [AI Election Assistant](#-ai-election-assistant)
- [Security Architecture](#-security-architecture)
- [Application Screenshots](#-application-screenshots)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Installation](#-local-installation)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [API Overview](#-api-overview)
- [Testing & Verification](#-testing--verification)
- [Demo Video](#-demo-video)
- [Project Documentation](#-project-documentation)
- [Academic Disclaimer](#-academic-disclaimer)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🗳️ About eVoter

**eVoter** is a full-stack remote voting system created to demonstrate
a complete digital election workflow from citizen authentication to
ballot submission, voting receipt generation and results visualization.

The platform combines:

- Secure citizen authentication
- OTP-based verification
- Electoral roll / KYC verification
- State-aware election authorization
- Multiple independent active elections
- Candidate and party information
- Secret-ballot-oriented voting workflow
- Duplicate-vote prevention
- Voting history
- PDF voting receipts
- Election results and analytics
- AI election assistance
- Retrieval-Augmented Generation (RAG)
- Multi-language support
- Responsive citizen and administrator interfaces

The project is designed primarily for **academic demonstration,
software engineering evaluation and portfolio presentation**.

---

# ✨ Project Highlights

| Capability | Implementation |
|---|---|
| 🔐 Authentication | JWT-based authentication with bcrypt password hashing |
| 📱 OTP | Six-digit OTP verification flow |
| 🪪 KYC | Citizen electoral verification workflow |
| 🗳️ Voting | Election-specific ballot submission |
| 🔒 Vote Integrity | Duplicate voting prevention |
| 🌎 State Isolation | Strict state-level election authorization |
| 🏛️ Multi-Election | Independent voting across active election tiers |
| 🧾 Receipt | PDF voting receipt generation |
| 📜 History | Election-specific participation history |
| 📊 Results | Interactive election results and turnout analytics |
| 🤖 AI | Election assistant with live election information |
| 🧠 RAG | Controlled election knowledge base |
| 🌐 Languages | English, Telugu, Hindi, Tamil, Marathi and Assamese |
| 📱 Responsive | Desktop, tablet and mobile layouts |
| 🛡️ Security | Rate limiting, validation, Helmet and authorization controls |

---

# 🚀 Core Features

## 🔐 Secure Authentication

- Citizen authentication
- Administrator authentication
- JWT session management
- HttpOnly cookie support
- Bearer token verification
- bcrypt password hashing
- Password reset workflow
- Role-based authorization

---

## 📱 OTP Verification

The platform supports a six-digit OTP verification workflow.

The project also contains configurable SMS-provider support for
demonstration and deployment environments.

Supported provider configuration includes:

- Fast2SMS
- Twilio
- MSG91
- Mock/demo mode

Production credentials are intentionally excluded from the repository.

---

## 🪪 Citizen Verification

Citizens can complete an electoral verification workflow using
registered identity information.

The verification layer validates the citizen against the configured
electoral data before allowing access to the voting workflow.

---

# 🗳️ Voting Workflow

The complete citizen voting journey is designed as:

```text
┌─────────────────────┐
│       HOME          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│       LOGIN         │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   OTP VERIFICATION  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    KYC / VERIFY     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ ACTIVE ELECTIONS    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ ELECTION DETAILS    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ CANDIDATE / BALLOT  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   CONFIRM VOTE      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    VOTE SUCCESS     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   PDF RECEIPT       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  VOTING HISTORY     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   ELECTION RESULTS  │
└─────────────────────┘
```
## 🎥 Live Demo

▶️ **Watch the complete eVoter application walkthrough**

[![eVoter Demo](https://img.youtube.com/vi/z5MCXY6QFm8/maxresdefault.jpg)](https://youtu.be/z5MCXY6QFm8)

**Demo flow:** Login → Verification → Election → Ballot → Vote → Receipt → History → Results
