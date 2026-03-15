# UniNotes Backend API 🚀

This is the backend service for the UniNotes application. It provides a robust API for user authentication managing academic resources (notes, PYQs, solutions), and tracking user activity.

*Note: This project was primarily developed leveraging AI tools.*

## Tech Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma (`@prisma/client`, `@prisma/adapter-pg`)
- **Authentication:** JSON Web Tokens (JWT) & HTTP-Only Cookies
- **Language:** JavaScript (ES Modules)

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- A `.env` file containing the required environment variables.

### Environment Variables
Create a `.env` file in the root of the backend folder with the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/uninotes?schema=public"
JWT_SECRET="your_super_secret_key"
NODE_ENV="development"
```

### Installation
1. Install the dependencies:
   ```bash
   npm install
   ```

2. Initialize and sync Prisma with your PostgreSQL database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will start and listen on the port specified in your `.env` (defaults to 5000).

## API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Registers a new user and generates access/refresh tokens. | No |
| **POST** | `/login` | Authenticates an existing user and sets session cookies. | No |
| **GET** | `/get-me` | Fetches the currently authenticated user's profile data. | Yes |
| **GET** | `/refresh-token` | Renews the access and refresh token using the current active cookie. | No |
| **POST** | `/logout` | Invalidates the current session and clears the users tokens. | No |

## Recent Upgrades & Features
- **Robust Auth Controller:** Refactored endpoint logic out into reusable `auth.service.js` functions.
- **Data Modeling Enhancements:** Enhanced Prisma `schema.prisma` structure to accommodate resource statistics, user bookmarks, user downloads, and overall site activity tracking. 
- **Centralized Security:** Secure, `httpOnly` cookie handling natively handles secure cross-application context via `cookie-parser` and configured CORS policies.
