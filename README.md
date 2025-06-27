# 🛠 Full Stack MERN Project

This project is a **Full Stack MERN (MongoDB, Express, React, Node.js)** application that includes:
 ##FRONTEND
- ✅ User Authentication (JWT: Access + Refresh Tokens)
- ✅ Vite + React Frontend
- ✅ Express + MongoDB Backend
- ✅ CRUD Operations (Product/User management)
- ✅ Table Server-side Pagination
- ✅ Cookie-based login persistence
- ✅ Environment-safe configuration

### 🔐 Authentication

- User registration and login
- JWT access token (expires in 1 day)
- Refresh token (stored in HTTP-only cookie, expires in 7 days)
- Secure logout and token renewal

### ⚛️ Frontend (React + Vite)

- Built using **Vite** for fast development
- React hooks & context for state
- Login persistence using `axios` + `withCredentials`
- Paginated table view for product list

## BACKEND

-- Built with Node.js, Express, and MongoDB using MVC architecture

-- Implements JWT authentication with access & refresh tokens

-- Secure password hashing using bcryptjs

-- Robust input validation and error handling

-- Supports full CRUD operations with pagination

-- Uses Mongoose for schema modeling and lean queries

-- Stores refresh tokens in secure HTTP-only cookies

-- CORS configured for frontend communication

-- Integrated Winston logger for request/error tracking

-- Configurable via environment variables (.env)

-- Modular routing and middleware for scalability

--Disables Mongoose buffering for reliability in serverless environments

---> Backend github link-https://github.com/SathishRajesh/AttsBE

--> Live Url :https://atts-frontend.vercel.app/login
