# ClassX Server

This is the backend server for the ClassX application. It is built using Node.js, Express, and MongoDB, providing robust authentication and API services for the platform.

## Architecture

- **Express.js**: Used as the web framework.
- **Mongoose**: Used for MongoDB object modeling and database interactions.
- **JWT (JSON Web Tokens)**: Used for secure, stateless authentication. Access tokens are used for API requests, while Refresh tokens handle session persistence and automatic token rotation.
- **Nodemailer**: Used for sending OTPs and verification emails via Brevo/Sendinblue.
- **Zod**: Used for strict request validation.

## Recent Fixes & Improvements

The authentication system recently underwent a major bug-fixing and stabilization phase. The following critical issues were resolved:

### 1. User Data Retrieval (GET `/getme`)
- Fixed a bug in the database query where `findOne({ id: userId })` was used instead of the correct MongoDB method `findById(userId)`.
- Fixed token generation logic: `generateAccessToken()` and `generateRefreshToken()` were previously called without passing the `userId`, resulting in tokens without an `id` payload. This caused the access middleware to fail.
- Improved JWT verification to throw specific errors (`TokenExpiredError`, `JsonWebTokenError`) instead of returning error objects, which were inadvertently evaluated as truthy.

### 2. Token Rotation
- Corrected a syntax error in the `tokenRotation` controller where `res.cookie()` was missing the configuration options due to misplaced parentheses.
- Fixed a typo (`cookiOption` -> `cookieOption`) and correctly imported the options from the main `config.js` file instead of the environment variables file.
- Updated the session repository to query the database using `{ user: userId }` instead of `{ userId }`, matching the Mongoose schema.
- Refactored the `config.js` cookie configuration from an invalid async function to a plain options object (`httpOnly`, `secure`, `sameSite`, `path`).

### 3. Rate Limiting Logic
- The `authLimiter` (which restricts requests to 5 per 15 minutes) was mistakenly applied globally to all `/auth` routes, causing `429 Too Many Requests` errors on normal page loads (`/getme`) and token rotations. The limiter is now correctly applied *only* to the `/login` and `/register` endpoints.

### 4. Email Verification
- Fixed the `/login` route, which was incorrectly registered as a `GET` request, preventing users from logging in.
- Fixed a case-sensitivity issue where the verification logic set `user.Verified = true` (capital V) instead of `user.verified = true`, which meant users were never marked as verified in the database.
- Updated the `verifyEmailOtp` service to return the newly updated verified user object instead of the old unverified data.

## Getting Started

1. Ensure MongoDB is running and your `.env` file is properly configured.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the server in development mode.
