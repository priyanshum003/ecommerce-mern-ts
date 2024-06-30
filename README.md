
# E-commerce Store with Admin Dashboard

## Overview

This project is a comprehensive e-commerce application built using the MERN stack (MongoDB, Express.js, React, Node.js) along with TypeScript. It includes both a customer-facing storefront and an admin dashboard for managing the store's operations. The project also integrates Google Firebase Authentication for secure user login and registration, and Stripe Payment Gateway for seamless and secure payment processing.
## Features

### User Authentication and Authorization
- Secure user registration and login with JWT-based authentication.
- Role-based access control for customers and administrators.
- Authentication via Google Firebase Auth using Google Sign-In and email/password.

### Product Management
- CRUD operations for products, including adding, updating, and deleting products.
- Product categories and subcategories for better organization.
- Handling product images using Cloudinary.

### Order Management
- Order creation, tracking, and management.
- Update order statuses (e.g., pending, shipped, delivered).
- View detailed order information.

### Coupon Management
- Create, update, and delete discount coupons.
- Apply coupons to orders during checkout.

### User Management
- Admin functionality to view and manage user accounts.

### Shopping Cart and Checkout
- Add, remove, and update items in the shopping cart.
- Secure checkout process with Stripe integration for payments.

### Dashboard Analytics
- Real-time analytics and reports on sales, revenue, and user demographics.
- Charts and graphs using Chart.js to visualize data.

### Responsive Design
- Fully responsive design for both the storefront and the admin dashboard, ensuring optimal user experience on all devices.

### Security Features
- Data sanitization and validation.
- Rate limiting and helmet for enhanced security.
- Firebase Admin for additional authentication methods.

## Technologies Used

### Frontend
- React with TypeScript for building a dynamic and type-safe user interface.
- Redux Toolkit for state management.
- Tailwind CSS for responsive and modern styling.
- React Router for client-side routing.
- Various React libraries for additional functionality (e.g., react-icons, react-toastify).

### Backend
- Node.js with Express for building the RESTful API.
- TypeScript for type safety and enhanced code quality.
- MongoDB with Mongoose for database operations.
- JWT for authentication and authorization.
- Multer for handling file uploads.
- Cloudinary for managing product images.
- Stripe for payment processing.

### Development Tools
- Vite for fast and optimized front-end development.
- Nodemon and ts-node for efficient server-side development.
- ESLint and Prettier for code quality and consistency.
- Jest and other testing libraries for unit and integration testing.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Firebase Project with Authentication enabled
- Cloudinary Account
- Stripe Account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/priyanshum003/ecommerce-mern-ts.git
   cd ecommerce-mern-ts
   ```
   
2.  Install dependencies for the server:
    
    ```
    cd server
    npm install
    ``` 
    
3.  Install dependencies for the client:

    ```
    cd ../client
    npm install
    ``` 
  

### Environment Variables

#### Server

Create a `.env` file in the `server` directory and add the following environment variables:

```
PORT=your_port
MONGO_URI=your_mongo_db_uri
MONGO_DB_NAME=mern-chat-app
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
# Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
``` 

#### Client

Create a `.env` file in the `client` directory and add the following environment variables:


```
VITE_GIPHY_API_KEY=your_giphy_api_key
``` 

### Running the Application

1.  Start the server:
    
    ```
    cd server
    npm run dev
    ``` 
    
2.  Start the client:
    
    ```
    cd client
    npm run dev
    ``` 
    

### Building for Production

1.  Build the server:

    
    ```
    cd server
    npm run build
    ``` 
    
2.  Build the client:
    
    ```
    cd client
    npm run build
    ``` 
    

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

-   [MongoDB](https://www.mongodb.com/)
-   [Express.js](https://expressjs.com/)
-   [React](https://reactjs.org/)
-   [Node.js](https://nodejs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Firebase](https://firebase.google.com/)
-   [Cloudinary](https://cloudinary.com/)
-   [Stripe](https://stripe.com/)
