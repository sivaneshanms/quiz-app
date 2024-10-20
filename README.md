# Quiz Application

## Overview

This is a full-stack quiz application where teachers can create quizzes and students can attempt them. The app features role-based access, with teachers having additional functionality such as creating, editing, and deleting quiz questions, while students can attempt quizzes and view their scores. A leaderboard tracks user scores, displaying ranks for both students and teachers.

## Tech Stack

- **Frontend**: React with Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Token)

## Features

- **Role-based Access**:
  - Teachers: Create, edit, and delete quiz questions.
  - Students: Attempt quizzes and view their scores.
- **Leaderboard**: Displays all users ranked by score, with a highlight on the current user's rank.
- **Question Management**: Teachers can manage questions with correct answers and multiple options.
- **Randomized Questions**: The order of the questions is randomized when presented to students.
- **Form Validation**: All questions are required before form submission.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sivaneshanms/quiz-app.git
cd quiz-app

# 2. Install Dependencies
# Frontend
cd client
npm install
# Backend
cd server
npm install

# 3. Configure Environment Variables
# Frontend

In the client directory, create a .env file and add the following:

REACT_APP_API_URL=http://localhost:3001/api

# Backend

In the server directory, create a .env file and add the following:

DATABASE_URL=your-database-connection-string
JWT_SECRET=your-jwt-secret

# 4. Run the Application
# Frontend

cd client
npm start


# Backend

cd server
npx sequelize db:migrate
npm run dev

# 5. Access the Application

Frontend: http://localhost:3000
Backend: http://localhost:3001