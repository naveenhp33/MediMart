# MediMart - Pharmacy Management System

MediMart is a high-performance, full-stack e-commerce platform tailored for medical products. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Vite, it provides a seamless experience for customers, sellers, and administrators.

## Features

- **Customer Experience**: Browse medicines with real-time search, category filtering, cart management, and a wishlist system.
- **Seller Dashboard**: Manage product listings, track stock levels, and monitor sales performance.
- **Admin Suite**: Oversee the entire marketplace, approve products, manage user roles, and track system-wide analytics.
- **Prescription Support**: Option to require prescriptions for specific medicines.
- **Modern UI**: Responsive design featuring glassmorphism elements, smooth animations, and interactive transitions.
- **Notifications**: Real-time status updates for orders and system alerts.

## Project Structure

```
MediMart/
├── backend/            # Express.js Server & MongoDB Integration
│   ├── uploads/        # Stored product and prescription images
│   ├── data.json       # Initial seed data for products
│   └── server.js       # Main API entry point
└── frontend/           # React (Vite) Frontend
    ├── src/
    │   ├── api/        # Axios configuration and API calls
    │   ├── components/ # Reusable UI components (Navbar, ProductCard, etc.)
    │   ├── context/    # Global state (Auth, Cart, Wishlist, Toast)
    │   ├── pages/      # Application views and dashboards
    │   └── routes/     # Protected route management
    └── index.html      # Main entry point
```

## Getting Started

### Prerequisites

- **Node.js** (v18.x or higher)
- **MongoDB** (Cloud or Local instance)
- **npm** or **yarn**

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd MediMart
   ```

2. **Backend Configuration:**
   ```sh
   cd backend
   npm install
   ```
   *Note: Ensure your MongoDB connection string is configured in `server.js` or via environment variables.*

3. **Frontend Configuration:**
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```sh
   cd backend
   npm start
   ```
   The backend will run on [http://localhost:5001](http://localhost:5001)

2. **Start the Frontend Development Server:**
   ```sh
   cd ../frontend
   npm run dev
   ```
   The application will be available at [http://localhost:5173](http://localhost:5173)

## Test Credentials

To assist with testing and demonstration, use the following pre-seeded accounts:

### 🛡️ Administrator Panel
- **Email**: `medadmin@gmail.com`
- **Password**: `2605`

### 🏪 Seller Dashboard
- **Email**: `naveen26@gmail.com`
- **Password**: `2604`

---

## Tech Stack

- **Frontend**: React, Vite, CSS3 (Custom Variables & Animations)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **State Management**: React Context API
- **Auth**: JWT (JSON Web Tokens) with Bcrypt password hashing

## License

This project is for educational and demonstration purposes.


