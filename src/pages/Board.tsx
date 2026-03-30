import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useMemo } from 'react';
import Column from '../components/Column';
import type { BoardCardData, CardLabelTone } from '../components/Card';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBoards } from '../redux/slices/boardsSlice';
import { fetchTasksByBoard, updateTaskStatus, optimisticUpdateTask } from '../redux/slices/tasksSlice';
import type { Task, TaskStatus } from '../redux/slices/tasksSlice';

interface BoardColumnData {
  id: TaskStatus;
  title: string;
  subtitle: string;
  cards: BoardCardData[];
}

interface TasksByStatus {
  todo: BoardCardData[];
  'in-progress': BoardCardData[];
  done: BoardCardData[];
}

const statusMeta: Record<TaskStatus, Omit<BoardColumnData, 'cards'>> = {
  todo: {
    id: 'todo',
    title: 'Backlog',
    subtitle: 'Ideas and scoped work waiting for a sprint slot.',
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    subtitle: 'Active work with owners and a clear next decision.',
  },
  done: {
    id: 'done',
    title: 'Done',
    subtitle: 'Recently delivered work with follow-up notes attached.',
  },
};

const priorityToneMap: Record<Task['priority'], CardLabelTone> = {
  low: 'research',
  medium: 'feature',
  high: 'bug',
};

const formatUpdatedAt = (updatedAt: string | undefined) => {
  if (!updatedAt) return 'Updated recently';
  const updatedDate = new Date(updatedAt);
  if (Number.isNaN(updatedDate.getTime())) {
    return 'Updated recently';
  }

  const time = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const deltaMs = updatedDate.getTime() - Date.now();
  const deltaHours = Math.round(deltaMs / (1000 * 60 * 60));

  if (Math.abs(deltaHours) < 24) {
    return `Updated ${time.format(deltaHours, 'hour')}`;
  }

  const deltaDays = Math.round(deltaHours / 24);
  return `Updated ${time.format(deltaDays, 'day')}`;
};

const mapTaskToCard = (task: Task): BoardCardData => ({
  id: task._id,
  title: task.title,
  labels: [
    { text: task.priority, tone: priorityToneMap[task.priority] },
    ...(task.status === 'done' ? [{ text: 'release', tone: 'release' as const }] : []),
  ],
  meta: [formatUpdatedAt(task.updatedAt)],
  assignee: typeof task.assignee === 'object' && task.assignee ? task.assignee.name : undefined,
});

export default function Board() {
  const dispatch = useAppDispatch();

  const boards = useAppSelector((state) => state.boards.data);
  const tasks = useAppSelector((state) => state.tasks.data);
  const tasksLoading = useAppSelector((state) => state.tasks.isLoading);
  const tasksError = useAppSelector((state) => state.tasks.error);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    void dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (boards.length > 0) {
      void dispatch(fetchTasksByBoard(boards[0]._id));
    }
  }, [boards, dispatch]);

  const tasksByStatus = useMemo<TasksByStatus>(() => {
    const grouped: TasksByStatus = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(mapTaskToCard(task));
    });

    return grouped;
  }, [tasks]);

  const columns = useMemo<BoardColumnData[]>(() => {
    return (Object.keys(statusMeta) as TaskStatus[]).map((status) => ({
      ...statusMeta[status],
      cards: tasksByStatus[status],
    }));
  }, [tasksByStatus]);

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;

    if (!overId) {
      return;
    }

    const destination = overId as TaskStatus;
    if (!statusMeta[destination]) {
      return;
    }

    const task = tasks.find((t) => t._id === activeId);
    if (!task || task.status === destination) {
      return;
    }

    const optimisticTask = { ...task, status: destination };
    dispatch(optimisticUpdateTask(optimisticTask));

    void dispatch(updateTaskStatus({ taskId: activeId, status: destination })).catch(() => {
      const originalTask = { ...task };
      dispatch(optimisticUpdateTask(originalTask));
    });
  };

  const boardName = boards[0]?.title ?? 'Project Board';
  const totalItems =
    tasksByStatus.todo.length + tasksByStatus['in-progress'].length + tasksByStatus.done.length;

  return (
    <main className="board-page">
      <section className="board-page__hero">
        <div>
          <p className="board-page__kicker">Project Roadmap</p>
          <h1>Columns that feel like GitHub Projects.</h1>
          <p className="board-page__intro">
            A compact planning surface with neutral lanes, issue-style cards, and the same
            restrained hierarchy GitHub uses to keep dense project boards readable.
          </p>
          {tasksError ? <p className="board-page__error">{tasksError}</p> : null}
        </div>

        <div className="board-page__summary">
          <span>{boardName}</span>
          <strong>{tasksLoading ? 'Loading...' : `${totalItems} open items`}</strong>
        </div>
      </section>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <section className="board-grid" aria-label="Project columns">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              subtitle={column.subtitle}
              cards={column.cards}
            />
          ))}
        </section>
      </DndContext>
    </main>
  );
}