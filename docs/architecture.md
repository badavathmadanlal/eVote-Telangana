# Remote Voting System Architecture

## System Overview

The Remote Voting System is an enterprise-grade digital voting platform that enables secure, transparent, and accessible remote elections.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │  Pages   │ │Components│ │  Hooks   │ │   Context (State) │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────────┬─────────┘  │
│       │             │            │                  │            │
│  ┌────┴─────────────┴────────────┴──────────────────┴─────────┐ │
│  │                    Services / API Layer                      │ │
│  │                  (Axios HTTP Client)                         │ │
│  └─────────────────────────┬───────────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTP / REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack                                         │   │
│  │  Helmet → CORS → Rate Limiter → XSS → Body Parser       │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         ▼                                       │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────┐     │
│  │  Routes  │───▶│  Controllers │───▶│     Validators    │     │
│  └──────────┘    └──────┬───────┘    └───────────────────┘     │
│                         │                                       │
│                         ▼                                       │
│                  ┌──────────────┐                               │
│                  │   Services   │  ← Business Logic             │
│                  └──────┬───────┘                               │
│                         │                                       │
│                         ▼                                       │
│                  ┌──────────────┐                               │
│                  │ Repositories │  ← Data Access Layer          │
│                  └──────┬───────┘                               │
│                         │                                       │
│                         ▼                                       │
│                  ┌──────────────┐                               │
│                  │   Models     │  ← Mongoose Schemas           │
│                  └──────┬───────┘                               │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │    MongoDB     │
                 │   Database     │
                 └────────────────┘
```

## Layer Responsibilities

| Layer        | Responsibility                                          |
|------------- |-------------------------------------------------------- |
| Routes       | Define API endpoints and map them to controllers        |
| Controllers  | Handle HTTP request/response, delegate to services      |
| Validators   | Validate request data using express-validator            |
| Services     | Core business logic, orchestration                      |
| Repositories | Database queries, data access abstraction               |
| Models       | Mongoose schemas and data definitions                   |
| Middleware   | Cross-cutting concerns (auth, logging, error handling)  |

## Security Layers

1. **Helmet** — HTTP security headers
2. **CORS** — Cross-Origin Resource Sharing policy
3. **Rate Limiting** — Prevent brute-force attacks
4. **XSS Protection** — Sanitize user input
5. **JWT Authentication** — Stateless token-based auth
6. **bcrypt** — Password hashing
7. **Input Validation** — express-validator on every endpoint
