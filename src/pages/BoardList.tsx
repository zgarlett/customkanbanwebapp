import { type FormEvent, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBoards, createBoard } from '../redux/slices/boardsSlice';
import { fetchTasks } from '../redux/slices/tasksSlice';
import {
  openCreateBoardModal,
  closeCreateBoardModal,
  setBoardFormTitle,
  setBoardFormDescription,
  setCreateBoardError,
} from '../redux/slices/uiSlice';

const BoardList = () => {
  const dispatch = useAppDispatch();

  const boards = useAppSelector((state) => state.boards.data);
  const boardsLoading = useAppSelector((state) => state.boards.isLoading);
  const boardsError = useAppSelector((state) => state.boards.error);

  const tasks = useAppSelector((state) => state.tasks.data);

  const isModalOpen = useAppSelector((state) => state.ui.isCreateBoardModalOpen);
  const formTitle = useAppSelector((state) => state.ui.createBoardForm.title);
  const formDescription = useAppSelector((state) => state.ui.createBoardForm.description);
  const isSubmitting = useAppSelector((state) => state.ui.createBoardForm.isSubmitting);
  const submitError = useAppSelector((state) => state.ui.createBoardForm.error);

  useEffect(() => {
    void dispatch(fetchBoards());
    void dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateBoard = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setCreateBoardError(null));

    const result = await dispatch(
      createBoard({
        title: formTitle.trim(),
        description: formDescription.trim(),
      }),
    );

    if (result.type === createBoard.fulfilled.type) {
      dispatch(closeCreateBoardModal());
    } else if (result.payload) {
      dispatch(setCreateBoardError(result.payload as string));
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      dispatch(closeCreateBoardModal());
    }
  };

  const taskCountByBoard = useMemo(() => {
    const counts = new Map<string, number>();

    tasks.forEach((task) => {
      const boardId = typeof task.board === 'string' ? task.board : task.board._id ?? '';
      if (!boardId) {
        return;
      }

      counts.set(boardId, (counts.get(boardId) ?? 0) + 1);
    });

    return counts;
  }, [tasks]);

  return (
    <main className="board-list-page">
      <header className="board-list-page__header">
        <div>
          <p className="board-list-page__kicker">Workspace</p>
          <h1>Board List</h1>
          <p className="board-list-page__subtext">See all boards and how many items each currently tracks.</p>
        </div>

        <div className="board-list-page__actions">
          <button
            type="button"
            onClick={() => dispatch(openCreateBoardModal())}
            className="board-list-page__btn-create"
          >
            + Create Board
          </button>
          <Link to="/board" className="board-list-page__cta">
            Open Main Board
          </Link>
        </div>
      </header>

      {boardsError ? <p className="board-list-page__error">{boardsError}</p> : null}
      {boardsLoading ? <p className="board-list-page__loading">Loading boards...</p> : null}

      {!boardsLoading && !boards.length ? <p className="board-list-page__loading">No boards found.</p> : null}

      {!boardsLoading && boards.length ? (
        <section className="board-list-grid" aria-label="Boards">
          {boards.map((board) => (
            <article className="board-list-card" key={board._id}>
              <div>
                <h2>{board.title}</h2>
                <p>{board.description || 'No description provided.'}</p>
              </div>
              <footer>
                <span>{taskCountByBoard.get(board._id) ?? 0} items</span>
              </footer>
            </article>
          ))}
        </section>
      ) : null}

      {isModalOpen ? (
        <div className="board-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="board-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <header className="board-modal__header">
              <h2 id="modal-title">Create a New Board</h2>
              <button
                type="button"
                className="board-modal__close"
                onClick={handleCloseModal}
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleCreateBoard} className="board-modal__form">
              {submitError ? <p className="board-modal__error">{submitError}</p> : null}

              <div className="board-modal__field">
                <label htmlFor="board-title">Board Title</label>
                <input
                  id="board-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => dispatch(setBoardFormTitle(e.target.value))}
                  placeholder="e.g., Q2 Roadmap"
                  required
                  disabled={isSubmitting}
                  maxLength={100}
                />
              </div>

              <div className="board-modal__field">
                <label htmlFor="board-description">Description (optional)</label>
                <textarea
                  id="board-description"
                  value={formDescription}
                  onChange={(e) => dispatch(setBoardFormDescription(e.target.value))}
                  placeholder="Describe what this board is for..."
                  disabled={isSubmitting}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <footer className="board-modal__footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="board-modal__btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="board-modal__btn-submit">
                  {isSubmitting ? 'Creating...' : 'Create Board'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default BoardList;