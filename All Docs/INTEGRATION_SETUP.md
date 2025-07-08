# Frontend-Backend Integration Setup

This document explains how the Indian Trade Mart frontend and backend are integrated.

## Architecture Overview

- **Frontend**: React application with Chakra UI (Port 3000)
- **Backend**: Spring Boot REST API (Port 8080)  
- **Database**: MySQL
- **Authentication**: JWT-based with Spring Security

## What's Been Configured

### 1. Backend Changes (D:\itech-backend\itech-backend)

#### CORS Configuration
- Added CORS configuration in `SecurityConfig.java`
- Allows requests from frontend origin (localhost:3000)
- Supports all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Enables credentials for JWT authentication

#### Application Properties
- Enhanced database configuration
- Added CORS settings
- Improved logging for debugging
- Added health check endpoints

### 2. Frontend Changes (E:\IndianTradeMart-main)

#### API Configuration
- **`src/config/api.js`**: Centralized API endpoint configuration
- **`src/config/axios.js`**: Configured axios instance with interceptors
- **`.env.development`**: Environment variables for development
- **`.env.production`**: Environment variables for production

#### Updated API Layer
- **`src/redux/Authentication/auth.api.js`**: Updated to use new configuration
- Automatic token management
- Better error handling
- Environment-based URL configuration

### 3. Development Scripts
- **`start-dev.ps1`**: PowerShell script to start both applications

## Setup Instructions

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8.0+
- Maven (or use included wrapper)

### 1. Database Setup
```sql
CREATE DATABASE itech_db;
```

### 2. Backend Setup
```bash
cd D:\itech-backend\itech-backend
./mvnw clean install
./mvnw spring-boot:run
```

### 3. Frontend Setup
```bash
cd E:\IndianTradeMart-main
npm install
npm run itm
```

### 4. Quick Start (Recommended)
Run the PowerShell script:
```powershell
.\start-dev.ps1
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify` - OTP verification

### Admin
- `GET /admin/users` - Get all users
- `DELETE /admin/user/{id}` - Delete user
- `POST /admin/add-admin` - Add admin
- `GET /admin/admins` - Get all admins

### Public Endpoints
- `GET /products` - Get products
- `GET /categories` - Get categories
- `POST /contact` - Contact form

## Environment Configuration

### Development
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Database: `localhost:3306/itech_db`

### Production
- Update `.env.production` with your production API URL
- Configure database credentials for production
- Update CORS origins in backend configuration

## Security Features

### JWT Authentication
- Token stored in localStorage as 'vendorToken'
- Automatic token attachment to requests
- Token expiration handling (24 hours)
- Automatic logout on token expiry

### CORS Protection
- Configured for development (localhost:3000)
- Must be updated for production domains

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend URL
   - Check browser dev tools for specific CORS errors

2. **Connection Refused**
   - Verify backend is running on port 8080
   - Check if MySQL is running

3. **401 Unauthorized**
   - Check if JWT token is valid
   - Verify token format and expiration

4. **Database Connection**
   - Verify MySQL credentials in application.properties
   - Ensure database 'itech_db' exists

### Logging
- Backend logs: Check console output for detailed logs
- Frontend logs: Check browser console for API request/response logs

## Next Steps

1. **Update other API files** (similar to auth.api.js):
   - `src/redux/solarpanel/solarpanel.action.js`
   - `src/redux/projector/projector.action.js`
   - `src/redux/medicines/medicines.action.js`
   - `src/redux/Carts/Cart.action.js`

2. **Add error boundaries** for better error handling
3. **Implement loading states** for better UX
4. **Add API response caching** for better performance
5. **Setup production deployment** configuration

## Contact
For any integration issues, check the logs and ensure both applications are running correctly.
