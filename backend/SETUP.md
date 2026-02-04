# Better Auth Setup Guide

This guide explains how to set up and use Better Auth with this application.

## Initial Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `better-auth` - Authentication framework
- `drizzle-orm` - Database ORM
- `better-sqlite3` - SQLite database driver
- `drizzle-kit` - Database migration tool

### 2. Run Database Migrations

```bash
npm run db:migrate
```

This creates the SQLite database at `backend/db/app.db` with the following tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - Authentication credentials (with hashed passwords)
- `verification` - Email verification tokens

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Backward Compatible Endpoints

These endpoints maintain compatibility with the existing frontend:

- **POST /api/signup**
  - Body: `{ email, password, name? }`
  - Returns: `{ token, user: { id, email, name, emailVerified, createdAt, updatedAt } }`

- **POST /api/login**
  - Body: `{ email, password }`
  - Returns: `{ token, user: { ... }, redirect: false }`

### Better Auth Native Endpoints

These are the standard Better Auth endpoints:

- **POST /api/auth/sign-up/email**
  - Body: `{ email, password, name? }`
  - Returns: `{ token, user: { ... } }`

- **POST /api/auth/sign-in/email**
  - Body: `{ email, password }`
  - Returns: `{ token, user: { ... }, redirect: false }`

- **POST /api/auth/sign-out**
  - Signs out the current user

- **GET /api/auth/session**
  - Returns the current session if authenticated

## Testing

Run the test script to verify the authentication flow:

```bash
./test-auth.sh
```

Or test manually with curl:

```bash
# Sign up a new user
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","name":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory (see `.env.example`):

```env
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_BASE_URL=http://localhost:3000
```

- `BETTER_AUTH_SECRET` - Secret key for signing tokens (required in production)
- `BETTER_AUTH_BASE_URL` - Base URL of the application

## Database Management

### View Database Contents

```bash
# View users
sqlite3 db/app.db "SELECT id, email, name FROM user;"

# View sessions
sqlite3 db/app.db "SELECT id, userId, token FROM session;"

# View accounts (credentials)
sqlite3 db/app.db "SELECT userId, providerId FROM account;"
```

### Reset Database

```bash
# Delete database
rm db/app.db db/app.db-shm db/app.db-wal

# Run migrations again
npm run db:migrate
```

### Generate New Migrations

If you modify the schema in `db/schema.js`:

```bash
npm run db:generate
npm run db:migrate
```

## Security Features

- **Password Hashing**: Passwords are automatically hashed using bcrypt
- **Session Tokens**: Secure random tokens for session management
- **CSRF Protection**: Better Auth includes built-in CSRF protection
- **SQL Injection Protection**: Drizzle ORM provides parameterized queries

## Troubleshooting

### Server won't start
- Make sure port 3000 is available
- Check that migrations have been run

### Authentication fails
- Verify the database exists: `ls -la db/app.db`
- Check server logs for errors
- Ensure you're using the correct email/password

### Database locked error
- Stop all running instances of the server
- Delete `.db-shm` and `.db-wal` files if they exist

## Next Steps

- Add email verification
- Implement password reset functionality
- Add OAuth providers (Google, GitHub, etc.)
- Add rate limiting for authentication endpoints
- Set up proper environment variables for production
