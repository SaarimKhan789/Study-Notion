# StudyNotion - An Ed-Tech Platform

![StudyNotion Architecture](images/architecture.png)

A fully functional ed-tech platform that enables users to create, consume, and rate educational content. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### For Students
- Browse and search courses
- Add courses to wishlist
- Purchase courses with Razorpay integration
- View and rate course content
- Manage user profile

### For Instructors
- Create and manage courses
- Upload course content (videos, documents)
- View course analytics and insights
- Manage instructor profile

### Admin Features (Future Scope)
- Platform analytics dashboard
- User and instructor management
- Content moderation

## Tech Stack

**Frontend:**
- React.js
- Redux (State Management)
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)

**Services:**
- Cloudinary (Media Storage)
- Razorpay (Payment Gateway)
- JWT (Authentication)
- Bcrypt (Password Hashing)

## System Architecture

The platform follows a client-server architecture with three main components:
1. **Frontend**: React.js application
2. **Backend**: Node.js + Express.js server
3. **Database**: MongoDB with Mongoose

## API Design

RESTful API with endpoints for:
- User authentication (JWT)
- Course management
- Payment processing
- Content delivery

Sample endpoints:
```http
POST /api/auth/signup
POST /api/courses
GET /api/courses/:id
POST /api/payment/create-order
