import { Router, Request, Response } from 'express'
import { Task } from '../models/Task.js'

const router = Router()

// GET all tasks
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('board', 'title')
      .populate('assignee', 'name email')
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET task by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('board', 'title')
      .populate('assignee', 'name email')
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// POST create new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body)
    await task.save()
    await task.populate('board', 'title')
    await task.populate('assignee', 'name email')
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PUT update task
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('board', 'title')
      .populate('assignee', 'name email')
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// DELETE task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET tasks by board
router.get('/board/:boardId', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .populate('board', 'title')
      .populate('assignee', 'name email')
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
