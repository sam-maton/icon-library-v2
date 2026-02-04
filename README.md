# icon-library-v2

Angular application with signup/login forms and Hono backend.

## Project Structure

- `frontend/` - Angular application with Material components
- `backend/` - Hono backend server

## Prerequisites

- Node.js (v20+)
- npm

## Setup and Running

### Backend

```bash
cd backend
npm install
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

- **Signup Page**: Form with email, password, and confirm password fields
- **Login Page**: Form with email and password fields
- **Angular Material**: UI components with Material Design
- **Hono Backend**: Lightweight backend that logs form submissions to console
- **Form Validation**: Email and password validation
- **Routing**: Navigation between login and signup pages

## Usage

1. Start the backend server first
2. Start the frontend application
3. Navigate to `http://localhost:4200` (will redirect to login page)
4. Switch between login and signup pages using the links
5. Submit forms to see console logs in the backend terminal
