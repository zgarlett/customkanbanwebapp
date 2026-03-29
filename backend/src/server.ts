import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'

const app: Express = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitets-db'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  void _next
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

// Routes
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'Server is running' })
})

// Import routes (we'll create these next)
import userRoutes from './routes/users.js'
import boardRoutes from './routes/boards.js'
import taskRoutes from './routes/tasks.js'

app.use('/api/users', userRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/tasks', taskRoutes)

// Start server
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

startServer()
