import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isCreateBoardModalOpen: boolean;
  createBoardForm: {
    title: string;
    description: string;
    isSubmitting: boolean;
    error: string | null;
  };
}

const initialState: UiState = {
  isCreateBoardModalOpen: false,
  createBoardForm: {
    title: '',
    description: '',
    isSubmitting: false,
    error: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreateBoardModal: (state) => {
      state.isCreateBoardModalOpen = true;
    },
    closeCreateBoardModal: (state) => {
      state.isCreateBoardModalOpen = false;
      state.createBoardForm.title = '';
      state.createBoardForm.description = '';
      state.createBoardForm.error = null;
      state.createBoardForm.isSubmitting = false;
    },
    setBoardFormTitle: (state, action: PayloadAction<string>) => {
      state.createBoardForm.title = action.payload;
    },
    setBoardFormDescription: (state, action: PayloadAction<string>) => {
      state.createBoardForm.description = action.payload;
    },
    setCreateBoardSubmitting: (state, action: PayloadAction<boolean>) => {
      state.createBoardForm.isSubmitting = action.payload;
    },
    setCreateBoardError: (state, action: PayloadAction<string | null>) => {
      state.createBoardForm.error = action.payload;
    },
    resetCreateBoardForm: (state) => {
      state.createBoardForm.title = '';
      state.createBoardForm.description = '';
      state.createBoardForm.error = null;
    },
  },
});

export const {
  openCreateBoardModal,
  closeCreateBoardModal,
  setBoardFormTitle,
  setBoardFormDescription,
  setCreateBoardSubmitting,
  setCreateBoardError,
  resetCreateBoardForm,
} = uiSlice.actions;

export default uiSlice.reducer;
