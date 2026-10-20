# ReserveHub — Requirements Draft

## What is the project?

ReserveHub is a booking system that allows customers to create an account, browse available booking options, and make and manage reservations.

## Requirements

* R1: Users can sign up, log in, and log out.
* R2: Users can browse available booking options and view their details.
* R3: Users can create a booking for an available option.
* R4: Users can view and update their profile.
* R5: Admins can view and manage users and user bookings.

## Non-goals

* N1: Real online payment is not included in the first version.
* N2: Reviews are not included in the first version.
* N3: Notifications are not included in the first version.

## Entities
* User
* Service
* Booking


User
- name
- email
- password
- verificationCode
- verificationCodeSentAt
- resetPasswordCode
- resetPasswordCodeSentAt
- passwordChangedAt
- role
- avatar
- isVerified
- timestamps

Service
- name
- description
- price
- isActive
- durationMinutes
- availability[]
- timestamps


Booking
- serviceId
- startTime
- endTime
- userId
- status
- timestamps


Auth
- POST /auth/signup
- POST /auth/verify
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/resend-verification
- POST /auth/resend-reset-password
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

Users
- GET   /users/me
- PATCH /users/me

Services
- POST   /services
- PATCH  /services/:serviceId
- DELETE /services/:serviceId
- GET    /services
- GET    /services/:serviceId

Bookings
- POST  /bookings
- PATCH /bookings/:bookingId/status
- GET   /bookings
- GET   /bookings/:bookingId
