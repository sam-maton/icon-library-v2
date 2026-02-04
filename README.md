# icon-library-v2

Angular application with signup/login forms and Hono backend with Better Auth authentication.

## Project Structure

- `frontend/` - Angular application with Material components
- `backend/` - Hono backend server with Better Auth

## Prerequisites

- Node.js (v20+)
- npm

## Setup and Running

### Backend

```bash
cd backend
npm install

# Run database migrations (first time only)
npm run db:migrate

# Start the server
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend application will run on `http://localhost:4200`

## Features

- **Authentication**: Email/password authentication using Better Auth
- **Database**: SQLite database with Drizzle ORM
- **Signup Page**: Form with email, password, and confirm password fields
- **Login Page**: Form with email and password fields
- **Session Management**: Automatic session handling with Better Auth
- **Angular Material**: UI components with Material Design
- **Form Validation**: Email and password validation
- **Routing**: Navigation between login and signup pages

## Authentication Endpoints

The backend provides the following authentication endpoints:

- `POST /api/signup` - User registration (backward compatible)
- `POST /api/login` - User login (backward compatible)
- `POST /api/auth/sign-up/email` - Better Auth signup endpoint
- `POST /api/auth/sign-in/email` - Better Auth login endpoint
- `POST /api/auth/sign-out` - Logout endpoint
- `GET /api/auth/session` - Get current session

## Database

The application uses SQLite with the following tables:

- `user` - User accounts
- `session` - Active sessions
- `account` - Authentication provider data (passwords are hashed)
- `verification` - Email verification tokens

See `backend/db/README.md` for more details.

## Usage

1. Start the backend server first (it will create the database if it doesn't exist)
2. Start the frontend application
3. Navigate to `http://localhost:4200` (will redirect to login page)
4. Create an account using the signup page
5. Login with your credentials

