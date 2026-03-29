import mongoose, { Schema, Document } from 'mongoose'

export interface IBoard extends Document {
  title: string
  description?: string
  owner: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const boardSchema = new Schema<IBoard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const Board = mongoose.model<IBoard>('Board', boardSchema)
