# UniNotes Backend API 🚀

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-lightblue.svg)](https://www.prisma.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

This is the backend service for the **UniNotes** application—a comprehensive platform for university students to share and access academic resources. It provides a secure API for user authentication, profile management, and session handling using modern security practices.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Storage:** Cloudinary (for academic resources)
- **Security:**
  - JWT (JSON Web Tokens) for stateless authentication
  - HttpOnly & Secure Cookies for session management
  - **bcryptjs** for secure password and token hashing
  - CORS-enabled with credential support

---

## 📁 Project Structure

```text
backend/
├── prisma/               # Database schema and migrations
├── src/
│   ├── config/           # Configuration files (DB connection, etc.)
│   ├── controllers/      # Request handlers and business logic
│   ├── middlewares/      # Express middlewares (Auth, Logging, etc.)
│   ├── routes/           # API route definitions
│   ├── services/         # Reusable business logic & DB interactions
│   ├── utils/            # Helper functions and utilities
│   └── app.js            # Express application setup
├── .env                  # Environment variables
├── server.js             # Entry point (Starts the server)
└── package.json          # Dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18 or higher
- **PostgreSQL:** A running instance of PostgreSQL
- **npm:** Node Package Manager

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/uninotes?schema=public"
JWT_SECRET="your_secure_random_token"
NODE_ENV="development"
# Optional: ACCESS_TOKEN_EXPIRY=15m
# Optional: REFRESH_TOKEN_EXPIRY=7d
```

### 3. Installation
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Sync database schema
npx prisma db push
```

### 4. Running the Application
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

---

## 🔌 API Reference

All routes are prefixed with `/api`.

### 🔐 Auth & Profile (`/api/auth`)

#### 1. Register a New User
- **Endpoint:** `POST /register`
- **Auth Required:** No
- **Description:** Creates a new user account, starts a session, and returns an access token.

#### 2. Login
- **Endpoint:** `POST /login`
- **Auth Required:** No
- **Description:** Authenticates user and returns an access token. Sets a `refreshToken` cookie.

#### 3. Get Current User Profile
- **Endpoint:** `GET /me`
- **Auth Required:** **Yes** (Bearer Token)
- **Description:** Returns the profile information of the authenticated user.

#### 4. Update Profile
- **Endpoint:** `PUT /me`
- **Auth Required:** **Yes** (Bearer Token)
- **Description:** Updates the profile information for the current user. All fields are optional.

#### 5. Refresh Access Token
- **Endpoint:** `GET /refresh`
- **Auth Required:** No (Uses `refreshToken` Cookie)
- **Description:** Issues a new access token and rotates the refresh token.

#### 6. Logout
- **Endpoint:** `POST /logout`
- **Description:** Invalidates the current session and clears the refresh token cookie.

### 📚 Resources (`/api/resources`)

#### 1. Upload a Resource
- **Endpoint:** `POST /`
- **Auth Required:** **Yes** (Bearer Token)
- **Content-Type:** `multipart/form-data`
- **Description:** Uploads a file to Cloudinary and creates a resource entry in the database pinned to the user.

#### 2. Get My Resources
- **Endpoint:** `GET /me`
- **Auth Required:** **Yes** (Bearer Token)
- **Description:** Fetches all resources uploaded by the authenticated user.

#### 3. Get All Resources (with Filtering)
- **Endpoint:** `GET /`
- **Auth Required:** No
- **Query Parameters:**
  - `department`: String (e.g., "Computer Science")
  - `subject`: String (e.g., "Data Structures")
  - `semester`: Int (e.g., 3)
  - `type`: String (e.g., "Notes")
- **Description:** Fetches all resources with optional server-side filtering. Returns unified format `{ success: true, count: number, data: [...] }`.


---

## 🗄️ Database Models

### `User`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `username` | String | Unique username |
| `email` | String | Unique email address |
| `password` | String | Hashed password |
| `fullname` | String | User's full name |
| `bio` | String | Optional biography |
| `university` | String | University name |
| `department` | String | Academic department |
| `year` | Int | Academic year |

### `Session`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `userId` | UUID | Foreign Key (User) |
| `refreshTokenHash` | String | Hashed refresh token |
| `ip` | String | IP address of the user |
| `userAgent` | String | User agent string |
| `revoke` | Boolean | Whether the session is revoked |

### `Resources`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `title` | String | Resource title |
| `subject` | String | Academic subject |
| `resourceType` | String | Type (Notes, PYQ, etc.) |
| `description` | String | Detailed description |
| `fileLink` | String | URL to the hosted file (Cloudinary) |
| `department` | String | Targeted academic department |
| `semester` | Int | Academic semester |
| `userId` | UUID | Foreign Key (Owner) |
| `createdAt` | DateTime | Timestamp of upload |


---

## 🛡️ Security
- **JWT Authentication:** Access tokens passed in `Authorization` header.
- **Refresh Token Rotation:** Refresh tokens stored in `HttpOnly` cookies.
- **Password & Token Hashing:** **bcryptjs** with adaptive salting.
- **CORS:** Configured for credential support and trusted origins.

---
*Developed with focus on performance, security, and scalability.*
