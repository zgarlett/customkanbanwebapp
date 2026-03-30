import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBoards } from '../redux/slices/boardsSlice';
import { fetchTasks } from '../redux/slices/tasksSlice';
import type { TaskStatus, TaskPriority } from '../redux/slices/tasksSlice';

interface CounterCardProps {
	label: string;
	value: number;
	tone?: 'default' | 'success' | 'warning';
}

const REFRESH_MS = 30000;

const CounterCard = ({ label, value, tone = 'default' }: CounterCardProps) => {
	return (
		<article className={`dashboard-counter dashboard-counter--${tone}`}>
			<p>{label}</p>
			<strong>{value}</strong>
		</article>
	);
};

const Dashboard = () => {
	const dispatch = useAppDispatch();
	
	const boards = useAppSelector((state) => state.boards.data);
	const boardsLoading = useAppSelector((state) => state.boards.isLoading);
	const boardsError = useAppSelector((state) => state.boards.error);
	
	const tasks = useAppSelector((state) => state.tasks.data);
	const tasksLoading = useAppSelector((state) => state.tasks.isLoading);
	const tasksError = useAppSelector((state) => state.tasks.error);
	
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const loadCounts = () => {
		void dispatch(fetchBoards());
		void dispatch(fetchTasks());
		setLastUpdated(new Date());
	};

	useEffect(() => {
		// Initial load and periodic refresh
		const performRefresh = () => {
			void dispatch(fetchBoards());
			void dispatch(fetchTasks());
			setLastUpdated(new Date());
		};

		performRefresh();

		const intervalId = window.setInterval(() => {
			performRefresh();
		}, REFRESH_MS);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [dispatch]);

	const statusCounts = useMemo(() => {
		return tasks.reduce(
			(acc, task) => {
				acc[task.status] += 1;
				return acc;
			},
			{
				todo: 0,
				'in-progress': 0,
				done: 0,
			} as Record<TaskStatus, number>,
		);
	}, [tasks]);

	const priorityCounts = useMemo(() => {
		return tasks.reduce(
			(acc, task) => {
				acc[task.priority] += 1;
				return acc;
			},
			{
				low: 0,
				medium: 0,
				high: 0,
			} as Record<TaskPriority, number>,
		);
	}, [tasks]);

	const boardBreakdown = useMemo(() => {
		const boardNames = new Map(boards.map((board) => [board._id, board.title]));

		const counts = new Map<string, number>();
		tasks.forEach((task) => {
			const boardId = typeof task.board === 'string' ? task.board : task.board._id ?? '';
			const boardTitle = typeof task.board === 'string' ? boardNames.get(boardId) : task.board.title;
			const key = boardTitle || 'Unknown board';
			counts.set(key, (counts.get(key) ?? 0) + 1);
		});

		return Array.from(counts.entries())
			.map(([title, count]) => ({ title, count }))
			.sort((a, b) => b.count - a.count);
	}, [boards, tasks]);

	const updatedText = lastUpdated
		? lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
		: '--';

	const isLoading = boardsLoading || tasksLoading;
	const error = boardsError || tasksError;

	return (
		<section className="dashboard" aria-label="Item counts dashboard">
			<header className="dashboard__header">
				<div>
					<p className="dashboard__kicker">Tracking</p>
					<h2>Item Counts Dashboard</h2>
					<p className="dashboard__subtext">
						Live count snapshot across boards. Auto-refreshes every 30 seconds.
					</p>
				</div>

				<div className="dashboard__actions">
					<span>Last update: {updatedText}</span>
					<button type="button" onClick={() => void loadCounts()}>
						Refresh
					</button>
				</div>
			</header>

			{error ? <p className="dashboard__error">{error}</p> : null}

			<div className="dashboard__counter-grid">
				<CounterCard label="Total Items" value={tasks.length} />
				<CounterCard label="To Do" value={statusCounts.todo} />
				<CounterCard label="In Progress" value={statusCounts['in-progress']} tone="warning" />
				<CounterCard label="Done" value={statusCounts.done} tone="success" />
				<CounterCard label="High Priority" value={priorityCounts.high} tone="warning" />
				<CounterCard label="Boards" value={boards.length} />
			</div>

			<div className="dashboard__board-breakdown">
				<h3>Items per board</h3>
				{isLoading ? <p>Loading metrics...</p> : null}
				{!isLoading && boardBreakdown.length === 0 ? <p>No tasks found.</p> : null}
				{!isLoading && boardBreakdown.length > 0 ? (
					<ul>
						{boardBreakdown.map((entry) => (
							<li key={entry.title}>
								<span>{entry.title}</span>
								<strong>{entry.count}</strong>
							</li>
						))}
					</ul>
				) : null}
			</div>
		</section>
	);
};

export default Dashboard;
