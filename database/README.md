# Database Documentation

## Overview

The Remote Voting System uses **MongoDB** as its primary database, accessed through **Mongoose** ODM.

## Connection

- **Development**: `mongodb://localhost:27017/remote_voting_system`
- **Production**: Use MongoDB Atlas or a managed MongoDB instance via the `MONGO_URI` environment variable.

## Collections (Planned)

| Collection   | Purpose                                    |
|------------- |------------------------------------------- |
| users        | Voter and admin accounts                   |
| elections    | Election definitions and configuration     |
| candidates   | Candidates linked to elections             |
| votes        | Cast votes (encrypted/hashed)              |
| audit_logs   | System audit trail                         |

## Indexes (Planned)

Indexes will be defined in Mongoose schemas to optimize query performance:

- `users.email` — unique index
- `elections.status` — for filtering active elections
- `votes.electionId + votes.voterId` — compound unique index to prevent double voting

## Data Integrity

- Mongoose schema validation enforces data types and required fields
- Application-level validation via express-validator
- Unique constraints prevent duplicate records
- Transactions will be used for vote casting to ensure atomicity

## Backup Strategy

For production deployments:
1. Enable MongoDB Atlas automated backups
2. Configure point-in-time recovery
3. Regular `mongodump` snapshots for self-hosted instances
