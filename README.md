# QuizMaker 2.0 Backend

A robust backend server for the QuizMaker 2.0 application, built with Node.js, Express, TypeScript, and MongoDB. This application provides a comprehensive quiz management system with user authentication, faculty approval workflows, question bank management, and student quiz taking capabilities.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Faculty, Student)
  - Secure password hashing with bcrypt
  - User activation/deactivation system

- **Faculty Management**
  - Faculty approval request system
  - Admin approval workflow
  - Faculty account management

- **Question Bank Management**
  - Create and manage question banks
  - Add, update, and remove questions
  - Organize questions by categories

- **Quiz Management**
  - Create, update, and delete quizzes
  - Add/remove questions from quizzes
  - Quiz activation/deactivation
  - Quiz availability management

- **Student Features**
  - View available quizzes for their class
  - Take quizzes and submit answers
  - View quiz results and performance
  - Access quiz questions

- **Administrative Features**
  - User management
  - Quiz oversight
  - Result monitoring
  - Faculty approval management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv + envalid
- **CORS**: Cross-origin resource sharing
- **Logging**: Morgan HTTP request logger
- **Error Handling**: http-errors
- **Development**: nodemon, tsx

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/quizmaker_2.0_server.git
cd quizmaker_2.0_server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

4. **Build the project:**
```bash
npm run build
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build the project first
npm run build

# Start the production server
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Faculty Approval System
- `GET /api/approveFaculty` - Get all faculty requests
- `GET /api/approveFaculty/pending` - Get pending faculty requests
- `GET /api/approveFaculty/check/:username` - Check existing faculty request
- `PATCH /api/approveFaculty` - Approve faculty request
- `DELETE /api/approveFaculty/:requestId` - Delete rejected request

### Question Bank Management
- `GET /api/qbank` - Get all question banks
- `GET /api/qbank/:id` - Get specific question bank
- `POST /api/qbank` - Create new question bank
- `PUT /api/qbank/:id` - Rename question bank
- `DELETE /api/qbank/:id` - Delete question bank
- `POST /api/qbank/addQuestion/:id` - Add question to bank
- `DELETE /api/qbank/removeQuestion/:id/:questionId` - Remove question from bank
- `PUT /api/qbank/updateQuestion/:questionId` - Update question

### Quiz Management
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/all` - Get all quizzes (admin only)
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz` - Create new quiz
- `PUT /api/quiz/:id` - Update quiz
- `PATCH /api/quiz/:id/toggle` - Toggle quiz activation
- `DELETE /api/quiz/:id` - Delete quiz
- `PATCH /api/quiz/:quizId/addQuestions` - Add questions to quiz
- `PATCH /api/quiz/:quizId/removeQuestions` - Remove questions from quiz

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle` - Toggle user activation

### Student Features
- `GET /api/student/quizzes` - Get available quizzes for student
- `POST /api/student/quizzes/attempt` - Attempt a quiz
- `GET /api/student/result` - Get student's quiz results
- `GET /api/student/resultAdm` - Get all results (admin)
- `GET /api/student/:quizId/questions` - Get quiz questions
- `DELETE /api/student/result/:resultId` - Delete result

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎬 Portfolio demo workspace

The client home screen includes one-click, public demo accounts for each role. They are deliberately separate from real users and can be reset after a recruiter explores the product.

1. Set `MONGO_URI`, `JWT_SECRET`, and (optionally) `DEMO_PASSWORD` in the deployed server environment. Use a non-default `DEMO_PASSWORD` for a public deployment. `DEMO_PASS` is also supported as a compatibility alias.
2. Run `npm run demo:seed` from this server directory once after deployment, and any time you want to restore the sample workspace.
3. Configure the client’s `VITE_DEMO_*` values to match the password and usernames. The default usernames are `demo-admin`, `demo-faculty`, and `demo-student`.

The seed creates a faculty-owned question bank, an active quiz, and a sample student result. It deletes and recreates **only** data owned by the demo faculty/student, so it does not reset normal application users.

Role permissions are enforced by the API as well as the client routes: admins manage users and faculty approvals, faculty manage question banks and quizzes, and students can take quizzes and view their own results.

## 🏗️ Project Structure

```
src/
├── controllers/          # Route controllers
├── middlewares/          # Custom middleware
├── models/              # MongoDB models
├── routes/              # API routes
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── app.ts              # Express app configuration
└── index.ts            # Server entry point
```

## 🔑 Testing Credentials

For testing the deployed version, you can use the following credentials:

- **Username**: `admin`
- **Password**: `123`

## 🚀 Deployment

The project includes Vercel configuration for easy deployment:

```bash
# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
