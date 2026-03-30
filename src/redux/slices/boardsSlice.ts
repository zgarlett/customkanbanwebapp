import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Board {
  _id: string;
  title: string;
  description?: string;
  owner?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface BoardsState {
  data: Board[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: BoardsState = {
  data: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boards`);
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    return (await response.json()) as Board[];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
  }
});

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (board: { title: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(board),
      });
      if (!response.ok) {
        throw new Error('Failed to create board');
      }
      return (await response.json()) as Board;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  },
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearBoardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBoardError } = boardsSlice.actions;
export default boardsSlice.reducer;
