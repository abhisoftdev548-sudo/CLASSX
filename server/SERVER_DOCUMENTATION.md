# ClassX Server Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Dependencies & Libraries](#dependencies--libraries)
4. [Architecture Patterns](#architecture-patterns)
5. [Error Handling System](#error-handling-system)
6. [Authentication & Security](#authentication--security)
7. [Database & Models](#database--models)
8. [API Endpoints](#api-endpoints)
9. [Middleware Stack](#middleware-stack)
10. [Services & Repositories](#services--repositories)
11. [Validation System](#validation-system)
12. [Configuration](#configuration)
13. [Development Setup](#development-setup)

---

## 🎯 Overview

ClassX Server is a Node.js Express.js application built with ES6 modules, implementing a robust authentication system with session management, email verification, and comprehensive error handling.

**Key Features:**
- JWT-based authentication with refresh tokens
- Session management with device tracking
- Email verification system
- Rate limiting and security middleware
- Comprehensive validation using Zod
- MongoDB with Mongoose ODM
- Structured repository pattern

---

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                    # Main Express app setup
│   ├── config/                   # Configuration files
│   │   ├── config.env.js        # Environment variables
│   │   └── config.js            # App configuration
│   ├── controllers/             # Request handlers
│   │   └── v1/
│   │       └── auth.controllers.js
│   ├── middlewares/              # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rate.limit.middleware.js
│   │   └── validate.middleware.js
│   ├── models/                   # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── session.model.js
│   │   └── otp.model.js
│   ├── repositories/              # Data access layer
│   │   └── v1/auth/
│   │       ├── auth.user.repo.js
│   │       └── auth.session.repo.js
│   ├── routes/                   # API routes
│   │   ├── index.js
│   │   └── v1/
│   │       ├── auth.routes.js
│   │       └── v1Router.js
│   ├── services/                 # Business logic
│   │   └── v1/
│   │       ├── auth/
│   │       ├── mail.service.js
│   │       └── otpServices.js
│   ├── utils/                    # Utility functions
│   │   ├── ErrorHandler.js
│   │   ├── apiResponse.js
│   │   └── catchAsyncError.js
│   └── validations/              # Request validation
│       └── auth.validation.js
├── package.json
├── server.js                     # Server entry point
└── .env                         # Environment variables
```

---

## 📦 Dependencies & Libraries

### Core Framework
- **Express.js (v5.2.1)** - Web framework for Node.js
  - Used for: HTTP server, routing, middleware
  - Why: Fast, unopinionated, extensive middleware ecosystem
  - Where: `app.js`, all route files

### Database & ODM
- **Mongoose (v9.5.0)** - MongoDB object modeling
  - Used for: Database connection, schema definition, queries
  - Why: Type-safe data modeling, validation, middleware
  - Where: All model files, repositories

### Authentication & Security
- **bcryptjs (v3.0.3)** - Password hashing
  - Used for: Hashing user passwords
  - Why: Secure, slow hashing algorithm
  - Where: `user.model.js` (pre-save hook)
- **jsonwebtoken (v9.0.3)** - JWT token generation
  - Used for: Access and refresh tokens
  - Why: Stateless authentication, industry standard
  - Where: `auth.token.services.js`
- **cookie-parser (v1.4.7)** - Cookie parsing
  - Used for: Reading HTTP cookies
  - Why: Session management via cookies
  - Where: `app.js`

### Validation
- **Zod (v4.3.6)** - Schema validation
  - Used for: Request body validation
  - Why: TypeScript-first, runtime validation
  - Where: `auth.validation.js`, `validate.middleware.js`

### Rate Limiting
- **express-rate-limit (v8.4.1)** - Request rate limiting
  - Used for: API rate limiting
  - Why: Prevent abuse, DDoS protection
  - Where: `rate.limit.middleware.js`

### CORS & Environment
- **CORS (v2.8.6)** - Cross-origin resource sharing
  - Used for: Enabling cross-origin requests
  - Why: Frontend-backend communication
  - Where: `app.js`
- **dotenv (v17.4.2)** - Environment variables
  - Used for: Loading .env file
  - Why: Configuration management
  - Where: `config.env.js`

### Email Services
- **Nodemailer (v8.0.6)** - Email sending
  - Used for: Sending verification emails
  - Why: Reliable email delivery
  - Where: `mail.service.js`

### Development Tools
- **nodemon (v3.1.14)** - Auto-restart server
  - Used for: Development auto-restart
  - Why: Improved development experience
  - Where: `package.json` scripts

---

## 🏗️ Architecture Patterns

### 1. **Layered Architecture**
```
Request → Middleware → Controller → Service → Repository → Model → Database
```

### 2. **Repository Pattern**
- **Purpose**: Abstract data access logic
- **Implementation**: Separate repository classes for each model
- **Benefits**: Testability, separation of concerns
- **Files**: `auth.user.repo.js`, `auth.session.repo.js`

### 3. **Service Layer Pattern**
- **Purpose**: Business logic encapsulation
- **Implementation**: Service classes with specific responsibilities
- **Benefits**: Reusability, maintainability
- **Files**: `auth.services.js`, `mail.service.js`

### 4. **Middleware Chain Pattern**
- **Purpose**: Request processing pipeline
- **Implementation**: Express middleware stack
- **Benefits**: Modularity, reusability
- **Order**: Global → Route-specific → Controller

---

## 🚨 Error Handling System

### Error Handling Strategy

#### 1. **Centralized Error Handler**
**File**: `utils/ErrorHandler.js`
```javascript
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Why**: Custom error class for operational errors
**When**: Throwing known errors with specific status codes
**Where**: All controllers and services

#### 2. **Async Error Wrapper**
**File**: `utils/catchAsyncError.js`
```javascript
export const catchAsyncError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Why**: Eliminates try-catch boilerplate in async functions
**When**: Wrapping all async controller functions
**Where**: All controller methods

#### 3. **Global Error Middleware**
**File**: `middlewares/error.middleware.js`
```javascript
export const errorHandler = (err, req, res, next) => {
  // Handle different error types
  if (err.name === 'ValidationError') { /* Mongoose validation */ }
  if (err.code === 11000) { /* Duplicate key */ }
  if (err.name === 'CastError') { /* Invalid ID */ }
  // Default error response
};
```

**Why**: Centralized error processing and response formatting
**When**: Last middleware in stack
**Where**: `app.js`

#### 4. **Validation Error Handling**
**File**: `middlewares/validate.middleware.js`
```javascript
if (error instanceof z.ZodError) {
  return res.status(400).json({
    success: false,
    message: "Validation Failed",
    errors: error.errors?.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    })),
  });
}
```

**Why**: Specific handling for Zod validation errors
**When**: Request body validation fails
**Where**: All validated routes

### Error Types & Handling

| Error Type | Source | Handler | Status Code | Response Format |
|------------|--------|---------|-------------|-----------------|
| Validation Errors | Zod | validate.middleware | 400 | `{success: false, message, errors}` |
| Mongoose Validation | Models | error.middleware | 400 | `{success: false, message}` |
| Duplicate Key | MongoDB | error.middleware | 400 | `{success: false, message}` |
| Cast Error | Invalid ID | error.middleware | 400 | `{success: false, message}` |
| JWT Errors | Auth | auth.middleware | 401 | `{success: false, message}` |
| Rate Limit | Rate Limiter | rate.limit.middleware | 429 | `{message}` |
| Operational Errors | Custom | errorHandler | Variable | `{success: false, message}` |
| System Errors | Unexpected | errorHandler | 500 | `{success: false, message}` |

---

## 🔐 Authentication & Security

### JWT Token System

#### 1. **Access Tokens**
- **Purpose**: Short-lived API access
- **Expiry**: 15 minutes
- **Algorithm**: HS256
- **Payload**: User ID, email, verified status

#### 2. **Refresh Tokens**
- **Purpose**: Long-lived session management
- **Expiry**: 7 days
- **Storage**: HTTP-only cookies + hashed in database
- **Rotation**: Automatic on each use

#### 3. **Token Rotation**
**File**: `auth.token.services.js`
```javascript
generateRefreshToken() {
  return jwt.sign({ type: 'refresh' }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  });
}
```

**Why**: Security against token theft
**When**: Every token refresh
**Where**: `auth.controllers.js` tokenRotation endpoint

### Session Management

#### 1. **Session Model**
**File**: `models/session.model.js`
```javascript
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  lastUsed: { type: Date, default: Date.now }
});
```

**Why**: Track active sessions across devices
**Features**: Device tracking, last used timestamp, automatic cleanup

#### 2. **Session Limits**
- **Maximum sessions**: 4 per user
- **Cleanup strategy**: Remove oldest session when limit exceeded
- **Security**: Prevents session flooding attacks

### Security Middleware Stack

#### 1. **Rate Limiting**
**File**: `rate.limit.middleware.js`
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many requests, please try again later'
});
```

**Why**: Prevent brute force attacks
**Endpoints**: Auth endpoints (login, register, etc.)

#### 2. **CORS Configuration**
**File**: `app.js`
```javascript
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

**Why**: Secure cross-origin requests
**Features**: Whitelist origins, credentials support

#### 3. **Cookie Security**
**File**: `app.js`
```javascript
const cookiOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};
```

**Why**: Prevent XSS and CSRF attacks
**Features**: HTTP-only, secure flag, same-site policy

---

## 🗄️ Database & Models

### MongoDB Collections

#### 1. **User Model**
**File**: `models/user.model.js`

**Schema Fields**:
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  mobileNumber: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: { type: Date, default: Date.now }
}
```

**Methods**:
- `comparePassword()`: Password verification
- `createResetToken()`: Password reset token generation
- **Static Methods**: `createResetToken()`

**Middleware**:
- **Pre-save**: Password hashing with bcrypt
- **Validation**: Email format, password strength

#### 2. **Session Model**
**File**: `models/session.model.js`

**Schema Fields**:
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  lastUsed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}
```

**Methods**:
- `compareRefreshToken()`: Token verification
- **Indexes**: User field for efficient queries

**Middleware**:
- **Pre-save**: Refresh token hashing

#### 3. **OTP Model**
**File**: `models/otp.model.js`

**Schema Fields**:
```javascript
{
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false }
}
```

**Features**:
- Auto-expiration with TTL index
- Single-use OTPs
- Email-based verification

### Database Connection

**File**: `config/config.env.js`
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

**Features**:
- Connection retry logic
- Error handling and logging
- Graceful shutdown

---

## 🛣️ API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Purpose | Middleware | Response |
|--------|----------|---------|------------|----------|
| POST | `/ragister` | User registration | validate, authLimiter | `{success, message, data?}` |
| POST | `/login` | User login | validate, authLimiter | `{success, message, data}` |
| GET | `/getme` | Get current user | authMiddleware | `{success, data}` |
| POST | `/logout` | Logout current device | authMiddleware | `{success, message}` |
| POST | `/logout-all-devices` | Logout all devices | authMiddleware | `{success, message}` |
| GET | `/rotate-token` | Refresh access token | - | `{success, data}` |
| POST | `/send-email-varification-otp` | Send verification OTP | validate, sensitiveTaskLimiter | `{success, message}` |
| POST | `/verify-email-otp` | Verify email OTP | validate | `{success, data}` |
| POST | `/forget-password` | Request password reset | validate, sensitiveTaskLimiter | `{success, message}` |
| POST | `/reset-password/:token` | Reset password | validate | `{success, message}` |

### Response Format Standards

#### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

#### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors array */ ]
}
```

---

## 🔧 Middleware Stack

### Execution Order

1. **Global Middleware** (`app.js`)
   - `express.json()` - Request body parsing
   - `cors()` - CORS handling
   - `cookieParser()` - Cookie parsing
   - `globalLimiter` - Global rate limiting

2. **Route Middleware** (`auth.routes.js`)
   - `authLimiter` - Auth-specific rate limiting
   - `validate(schema)` - Request validation
   - `authMiddleware.verifyAccess` - JWT verification

3. **Controller Middleware** (`auth.controllers.js`)
   - `catchAsyncError` - Async error wrapping

4. **Error Middleware** (`app.js`)
   - `errorHandler` - Global error handling

### Custom Middleware Details

#### 1. **Auth Middleware**
**File**: `middlewares/auth.middleware.js`

**Features**:
- JWT token verification
- User attachment to request object
- Token rotation support

#### 2. **Validation Middleware**
**File**: `middlewares/validate.middleware.js`

**Features**:
- Zod schema validation
- Detailed error messages
- Request body parsing

#### 3. **Rate Limiting Middleware**
**File**: `middlewares/rate.limit.middleware.js`

**Features**:
- Multiple rate limiters
- Different limits per endpoint
- Custom error messages

---

## 🏪 Services & Repositories

### Service Layer Architecture

#### 1. **Auth Service**
**File**: `services/v1/auth/auth.services.js`

**Methods**:
- `ragister()` - User registration
- `login()` - User authentication
- `logout()` - Session termination
- `logoutFromAllDevices()` - Global logout
- `verifyEmailOtp()` - Email verification
- `forgetPassword()` - Password reset initiation
- `resetPassword()` - Password reset completion

**Design Pattern**: Service layer with dependency injection

#### 2. **Token Service**
**File**: `services/v1/auth/auth.token.services.js`

**Methods**:
- `generateAccessToken()` - Short-lived token creation
- `generateRefreshToken()` - Long-lived token creation
- `verifyAccessToken()` - Access token validation
- `verifyRefreshToken()` - Refresh token validation

**Security Features**:
- Separate secrets for access/refresh tokens
- Token rotation support
- Expiration handling

#### 3. **Session Service**
**File**: `services/v1/auth/auth.session.services.js`

**Methods**:
- `createSession()` - New session creation
- `createOrUpdateSession()` - Session upsert logic
- `findSessionByToken()` - Session lookup
- `updateSession()` - Session update
- `deleteSession()` - Session removal

**Features**:
- Device tracking
- Session limits enforcement
- Automatic cleanup

#### 4. **Mail Service**
**File**: `services/v1/mail.service.js`

**Methods**:
- `sendMail()` - Generic email sending
- `sendVerificationEmail()` - OTP verification
- `sendPasswordResetEmail()` - Password reset

**Configuration**:
- SMTP settings
- Template system
- Error handling

### Repository Pattern Implementation

#### 1. **User Repository**
**File**: `repositories/v1/auth/auth.user.repo.js`

**Methods**:
- `create()` - User creation
- `findByEmail()` - Email lookup
- `findByEmailAndMobile()` - Combined lookup
- `setUserVerified()` - Verification status update
- `setUserUnVerified()` - Verification status reset

**Features**:
- Mongoose query abstraction
- Error handling
- Type safety

#### 2. **Session Repository**
**File**: `repositories/v1/auth/auth.session.repo.js`

**Methods**:
- `createSession()` - Session creation
- `createOrUpdateSession()` - Session upsert
- `findByToken()` - Token-based lookup
- `findAndupdateSession()` - Session update
- `deleteByToken()` - Token-based deletion
- `deleteAllByUserId()` - User session cleanup

**Features**:
- Session limit enforcement
- Token hashing
- Device tracking

---

## ✅ Validation System

### Zod Schema Definitions

**File**: `validations/auth.validation.js`

#### Validation Rules
```javascript
const nameRule = z.string().min(2, "Name must be at least 2 chars").max(100).trim();
const emailRule = z.string().email("Invalid email address").trim().toLowerCase();
const mobileRule = z.string().regex(/^\d{10,15}$/, "Invalid mobile number format");
const passwordRule = z.string().min(6, "Password must be at least 6 characters");
```

#### Request Schemas
```javascript
export const ragisterSchema = z.object({
  name: nameRule,
  mobileNumber: mobileRule,
  email: emailRule,
  password: passwordRule,
});
```

### Validation Middleware Flow

1. **Request Intercept**: Middleware captures request
2. **Schema Application**: Zod schema validates `req.body`
3. **Error Handling**: Validation errors formatted and returned
4. **Success**: Request passes to next handler

### Validation Error Format
```javascript
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## ⚙️ Configuration

### Environment Variables

**File**: `.env`
```env
# Database
MONGO_URI=mongodb://localhost:27017/classx

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Server
PORT=5000
NODE_ENV=development

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cookie
COOKIE_SECURE=false
COOKIE_SAMESITE=strict
```

### Configuration Files

#### 1. **Environment Config**
**File**: `config/config.env.js`

**Features**:
- Environment variable loading
- Default value handling
- Validation

#### 2. **App Config**
**File**: `config/config.js`

**Features**:
- Cookie options
- CORS settings
- Rate limit configurations

---

## 🚀 Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd ClassX/server
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development Server**
```bash
npm run dev
```

### Development Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Start Dev | `npm run dev` | Start with nodemon |
| Test | `npm test` | Run tests (placeholder) |

### File Watching
- **nodemon**: Auto-restart on file changes
- **Watched Files**: `*.js`, `*.json`
- **Ignored**: `node_modules`, `*.log`

---

## 🔍 Debugging & Monitoring

### Logging Strategy

1. **Development**: Console logging with emojis
2. **Production**: Structured logging (to be implemented)
3. **Error Tracking**: Centralized error handling

### Common Debugging Scenarios

#### 1. **Validation Errors**
```javascript
// Check validation middleware logs
console.log('Request Body:', req.body);
console.log('Validation Errors:', error.errors);
```

#### 2. **Database Issues**
```javascript
// Check MongoDB connection
mongoose.connection.on('error', console.error);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
```

#### 3. **Authentication Problems**
```javascript
// Check JWT token verification
console.log('Token:', req.cookies.RefreshToken);
console.log('User:', req.user);
```

---

## 📊 Performance Considerations

### Database Optimization
- **Indexes**: Email, mobileNumber, user fields
- **Query Optimization**: Lean queries, selective fields
- **Connection Pooling**: Default Mongoose pooling

### Security Performance
- **Rate Limiting**: Prevents abuse
- **Token Rotation**: Reduces token theft impact
- **Session Limits**: Controls resource usage

### Memory Management
- **Session Cleanup**: Automatic old session removal
- **Error Handling**: Prevents memory leaks
- **Middleware Optimization**: Efficient request processing

---

## 🔄 Future Enhancements

### Planned Features
1. **API Documentation**: Swagger/OpenAPI integration
2. **Testing Suite**: Jest unit and integration tests
3. **Logging System**: Winston or Pino integration
4. **Metrics Collection**: Prometheus integration
5. **Caching Layer**: Redis implementation
6. **File Upload**: Multer integration
7. **WebSocket Support**: Real-time features

### Security Enhancements
1. **2FA Implementation**: TOTP support
2. **Account Lockout**: Failed login tracking
3. **IP Whitelisting**: Admin access control
4. **Audit Logging**: Action tracking

---

## 📞 Support & Maintenance

### Common Issues
1. **MongoDB Connection**: Check connection string and network
2. **JWT Errors**: Verify secret keys and token format
3. **Email Delivery**: Check SMTP configuration
4. **Rate Limits**: Adjust limits for development

### Maintenance Tasks
1. **Regular Updates**: Keep dependencies current
2. **Security Patches**: Apply security updates promptly
3. **Database Backups**: Regular backup schedule
4. **Log Rotation**: Prevent log file bloat

---

## 📚 Additional Resources

### Documentation Links
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Zod Documentation](https://zod.dev/)
- [JWT Documentation](https://jwt.io/)

### Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/security-best-practices.html)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/best-practices/)

---

**Last Updated**: April 30, 2026
**Version**: 1.0.0
**Maintainer**: ClassX Development Team
