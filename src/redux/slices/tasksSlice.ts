import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  board: string | { _id?: string; title?: string };
  assignee?: { _id?: string; name?: string; email?: string } | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt?: string;
  updatedAt?: string;
}

interface TasksState {
  data: Task[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: TasksState = {
  data: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return (await response.json()) as Task[];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
  }
});

export const fetchTasksByBoard = createAsyncThunk(
  'tasks/fetchTasksByBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/board/${boardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch board tasks');
      }
      return (await response.json()) as Task[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  },
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }: { taskId: string; status: TaskStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      return (await response.json()) as Task;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    optimisticUpdateTask: (state, action) => {
      const index = state.data.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTasksByBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksByBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchTasksByBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError, optimisticUpdateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
