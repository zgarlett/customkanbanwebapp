# Backend API Setup

This is the Express.js + MongoDB backend for the Vite React TypeScript app.

## Prerequisites

### Install MongoDB Locally (macOS)

**Option 1: Using Homebrew**
```bash
# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh  # Opens MongoDB shell
```

**Option 2: Using Docker**
```bash
# Pull and run MongoDB image
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop MongoDB
docker stop mongodb
```

**Option 3: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get your connection string
- Update `.env` with the Atlas URI

## Setup Instructions

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` if needed** (default uses localhost MongoDB)
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vitets-db
   NODE_ENV=development
   ```

5. **Ensure MongoDB is running**, then start the dev server
   ```bash
   npm run dev
   ```

Server will start on `http://localhost:5000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Create User Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board by ID
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

**Create Board Example:**
```json
{
  "title": "Project Alpha",
  "description": "Team project board",
  "owner": "USER_ID_HERE"
}
```

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/board/:boardId` - Get tasks for a board
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Create Task Example:**
```json
{
  "title": "Implement feature",
  "description": "Build user authentication",
  "board": "BOARD_ID_HERE",
  "assignee": "USER_ID_HERE",
  "status": "in-progress",
  "priority": "high"
}
```

## Troubleshooting

**MongoDB connection refused:**
- Make sure MongoDB is running: `mongosh` or `docker ps`
- Check the `MONGODB_URI` in `.env`

**Port already in use:**
- Change `PORT` in `.env` to something else (e.g., 5001)
- Or kill the process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

**Dependencies not installing:**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint
