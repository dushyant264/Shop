# E-Commerce API

This is a complete backend API for an E-Commerce application. It's built with Express, MongoDB, and Node.js.

## Features

- User Registration
- User Sign In
- Authorization using JWT tokens stored in cookies
- Admin Control Dashboard
- Product Management (Add, Update, Delete)
- Order Management

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB

### Installing

1. Clone the repository
git clone https://github.com/yourusername/your-repo-name.git


2. Install NPM packages

npm install

3. Create a `.env` file in the root directory and add the following:

DB_CONNECT = YOUR_MONGODB_CONNECTION_STRING   JWT_SECRET = YOUR_SECRET_KEY   PORT=5000


4. Run the server

npm start


