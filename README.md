# 🚀 ReserveHub — Backend

### Powerful API. Seamless Booking Experience.

**ReserveHub Backend** is a RESTful API built with Node.js, Express.js, and MongoDB to power a complete service booking and appointment management platform.

It provides secure authentication, service management, appointment scheduling, user administration, and role-based access control through a structured, maintainable backend architecture.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Authentication-25304B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## ✨ Key Features

### 🔐 Authentication & Security

| Feature | Description |
|---|---|
| User Registration | Create accounts with validated user information |
| Authentication | Login and logout with JWT-based sessions |
| Email Verification | Verify user accounts through email |
| Password Recovery | Forgot password and secure password reset |
| Token Refresh | Refresh expired access tokens |
| Authorization | Restrict endpoints based on user roles |
| Profile Management | Retrieve and update account information and avatars |

### 🛠️ Service Management

| Feature | Description |
|---|---|
| Create Services | Add services with images, pricing, and duration |
| Update Services | Modify service information and availability |
| Service Status | Activate or deactivate services |
| Service Discovery | Retrieve and filter available services |
| Availability | Configure working days and appointment time ranges |
| Validation | Validate service data and prevent overlapping availability ranges |

### 📅 Booking Management

| Feature | Description |
|---|---|
| Create Bookings | Reserve available appointment slots |
| Availability Validation | Prevent conflicting active bookings |
| Booking History | Retrieve personal booking records |
| Admin Management | Retrieve and manage bookings across the platform |
| Booking Status | Manage pending, confirmed, completed, and cancelled appointments |
| Cancellation | Cancel eligible bookings and release their reserved slots |

### 👥 User Administration

- Retrieve registered users with pagination
- View user information and account verification status
- Change user roles with administrator authorization
- Prevent administrators from changing their own role
- Access user statistics for dashboard summaries

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JSON Web Tokens (JWT) |
| **Email** | SMTP |
| **File Handling** | Multipart file uploads |
| **Architecture** | Layered RESTful API |

---

## 🏗️ Backend Architecture

ReserveHub follows a layered architecture to separate HTTP handling, business logic, and database operations.

```text
                  Client Request
                        |
                        v
                    API Routes
                        |
                        v
                    Middleware
              Authentication / Validation
                        |
                        v
                   Controllers
                        |
                        v
                     Services
                 Business Logic
                        |
                        v
                   Repositories
                        |
                        v
                 Mongoose Models
                        |
                        v
                     MongoDB
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| **Routes** | Define API endpoints and HTTP methods |
| **Middleware** | Handle authentication, authorization, validation, and file uploads |
| **Controllers** | Process requests and return HTTP responses |
| **Services** | Implement booking, authentication, and application business rules |
| **Repositories** | Handle database queries and persistence |
| **Models** | Define MongoDB document schemas using Mongoose |

This architecture keeps controllers focused, promotes code reuse, and makes business logic easier to maintain.

---

## 🌐 API Overview

### Base URL

```text
http://localhost:8000/api/v1
```

### Service Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/services` | Retrieve services |
| `GET` | `/services/:serviceId` | Retrieve service details |
| `POST` | `/services` | Create a service (Admin) |
| `PATCH` | `/services/:serviceId` | Update a service (Admin) |
| `DELETE` | `/services/:serviceId` | Delete a service (Admin) |

The API also provides endpoints for authentication, email verification, password recovery, profile management, user administration, and booking operations.

Protected endpoints require the appropriate authentication and authorization.

---

## 🔄 Booking Workflow

ReserveHub uses a controlled booking lifecycle.

```text
                   Pending
                   /     \
                  v       v
            Confirmed   Cancelled
             /    \
            v      v
       Completed  Cancelled
```

### Booking Rules

| Status | Allowed Actions |
|---|---|
| **Pending** | Confirm or cancel |
| **Confirmed** | Complete or cancel |
| **Completed** | No further status changes |
| **Cancelled** | No further status changes |

**Important booking constraints:**

- Appointments must use available service time slots.
- Conflicting active bookings are prevented.
- Completion is only allowed after the appointment end time.
- Cancelled bookings release their reserved slots.
- Booking status changes are validated by the backend.

These rules help maintain booking consistency and prevent invalid appointment transitions.

---

## ⚙️ Getting Started

### Prerequisites

Before running the backend, make sure you have:

- Node.js and npm
- Access to a MongoDB database
- SMTP credentials for email functionality

### 1. Installation

Download or clone this repository, open the project directory, and install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root and configure the following environment variables.

| Variable | Purpose |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `PORT` | Backend server port |
| `SMTP_USER` | Email account used to send messages |
| `SMTP_PASS` | SMTP authentication credential |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |

Environment variables contain sensitive configuration and must not be committed to version control.

### 3. Start the Server

Start the backend in development mode:

```bash
npm run dev
```

With port `8000` configured, the backend runs locally at:

```text
http://localhost:8000
```

The API is accessible under `/api/v1`.

---

## 🗃️ Data Models

### User

Manages registered accounts, profile information, account verification, and authorization roles.

### Service

Stores the information required to offer and schedule appointments.

| Field | Description |
|---|---|
| `name` | Service title |
| `description` | Service description |
| `price` | Service price |
| `image` | Service image |
| `durationMinutes` | Appointment duration |
| `availability` | Available days and time ranges |
| `isActive` | Service activation status |

### Booking

Connects users to services and maintains appointment scheduling information, booking status, and reservation availability.

---

## 🛡️ Security & Validation

The backend uses multiple protection and validation mechanisms:

- JWT authentication and token refresh
- Role-based access restrictions
- Protected administrative operations
- Server-side input validation
- Service availability validation
- Booking conflict prevention
- Controlled booking status transitions
- Centralized error-handling middleware

Authorization and business rules are enforced on the backend rather than relying only on frontend restrictions.

---

## 🔗 Frontend Integration

ReserveHub Backend powers a separate Vue 3 frontend application.

**Frontend technologies:**

`Vue 3` · `Vite` · `Pinia` · `Vue Router` · `Axios` · `Bootstrap 5` · `SCSS`

The frontend communicates with the backend through RESTful API requests to handle user authentication, services, bookings, profiles, and administrative operations.

---

## 🎯 Project Highlights

ReserveHub Backend demonstrates practical full-stack development concepts, including:

**REST API Design** · **Layered Architecture** · **JWT Authentication** · **Role-Based Authorization** · **MongoDB & Mongoose** · **Business Logic Validation** · **Appointment Scheduling** · **File Uploads**

---

### ReserveHub — Book Smarter. Experience More.

Built with Node.js, Express, and MongoDB, with a focus on clean architecture, maintainable code, and reliable booking management.
