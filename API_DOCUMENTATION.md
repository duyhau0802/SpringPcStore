# Spring PC Store - Authentication API Documentation

## Overview
This document describes the authentication endpoints for the Spring PC Store application.

## Base URL
```
http://localhost:8080/api/auth
```

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Registers a new user in the system.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phoneNumber": "1234567890",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

**Validation Rules:**
- `username`: Required, 3-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `fullName`: Optional
- `phoneNumber`: Optional

### 2. Login User
**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phoneNumber": "1234567890",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "username": "Username must be between 3 and 50 characters",
  "email": "Invalid email format"
}
```

### Authentication Errors (401 Unauthorized)
```json
{
  "error": "Invalid email or password"
}
```

### User Not Found (404 Not Found)
```json
{
  "error": "User not found with email: user@example.com"
}
```

### Conflict Errors (400 Bad Request)
```json
{
  "error": "Email is already taken"
}
```

## Using the JWT Token

After successful login, include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Expiration
- JWT tokens expire after 24 hours (86400000 milliseconds)
- After expiration, users need to login again to get a new token

## Security Features
- Passwords are encrypted using BCrypt
- JWT tokens are signed and validated
- CORS is enabled for cross-origin requests
- Input validation on all endpoints
