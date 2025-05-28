# QuizMaker 2.0 Backend

A robust backend server for the QuizMaker 2.0 application, built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- User authentication and authorization
- Quiz management system
- RESTful API architecture
- Secure password hashing
- JWT-based authentication
- MongoDB database integration
- TypeScript for type safety
- CORS enabled
- Request logging with Morgan

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variables
- cors for cross-origin resource sharing
- morgan for HTTP request logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quizmaker_2.0_server.git
cd quizmaker_2.0_server
```

2. Install dependencies:
```bash
npm install
```

3. Install tsx globally (for development):
```bash
npm install -g tsx
```

4. Create a `.env` file in the root directory and add the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Build the TypeScript code:
```bash
npm run build
```

## 🚀 Running the Application

### Development Mode
```bash
# Using the npm script (recommended)
npm run dev

# Or using tsx directly
tsx src/server.ts
```

### Production Mode
```bash
# First build the project
npm run build

# Then start the server
npm start
```

## 🔑 Testing Credentials

For testing the deployed version, you can use the following credentials:

- Username: `admin`
- Password: `123`

## 📚 API Documentation

The API endpoints are documented in the following structure:

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Quizzes
- GET `/api/quizzes` - Get all quizzes
- POST `/api/quizzes` - Create a new quiz
- GET `/api/quizzes/:id` - Get a specific quiz
- PUT `/api/quizzes/:id` - Update a quiz
- DELETE `/api/quizzes/:id` - Delete a quiz

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/quizmaker_2.0_server/issues).

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
