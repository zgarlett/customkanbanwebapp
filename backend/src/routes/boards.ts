import { Router, Request, Response } from 'express'
import { Board } from '../models/Board.js'

const router = Router()

// GET all boards
router.get('/', async (_req: Request, res: Response) => {
  try {
    const boards = await Board.find().populate('owner', 'name email')
    res.json(boards)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET board by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id).populate('owner', 'name email')
    if (!board) return res.status(404).json({ error: 'Board not found' })
    res.json(board)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// POST create new board
router.post('/', async (req: Request, res: Response) => {
  try {
    const board = new Board(req.body)
    await board.save()
    await board.populate('owner', 'name email')
    res.status(201).json(board)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PUT update board
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      'owner',
      'name email'
    )
    if (!board) return res.status(404).json({ error: 'Board not found' })
    res.json(board)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// DELETE board
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    res.json({ message: 'Board deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
