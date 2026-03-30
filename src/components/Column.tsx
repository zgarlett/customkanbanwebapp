import Card, { type BoardCardData } from './Card';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface ColumnProps {
	id: string;
	title: string;
	cards: BoardCardData[];
	subtitle?: string;
}

const DraggableCard = ({ card }: { card: BoardCardData }) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: card.id,
		data: {
			type: 'card',
		},
	});

	const style = {
		transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
		opacity: isDragging ? 0.7 : 1,
		cursor: isDragging ? 'grabbing' : 'grab',
	};

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<Card card={card} />
		</div>
	);
};

const Column = ({ id, title, cards, subtitle }: ColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<section
			ref={setNodeRef}
			className={`project-column ${isOver ? 'project-column--over' : ''}`}
			aria-label={title}
		>
			<header className="project-column__header">
				<div>
					<div className="project-column__title-row">
						<h3 className="project-column__title">{title}</h3>
						<span className="project-column__count">{cards.length}</span>
					</div>
					{subtitle ? <p className="project-column__subtitle">{subtitle}</p> : null}
				</div>

				<button className="project-column__menu" type="button" aria-label={`Open ${title} column menu`}>
					<span />
					<span />
					<span />
				</button>
			</header>

			<div className="project-column__list">
				{cards.map((card) => (
					<DraggableCard key={card.id} card={card} />
				))}
			</div>

			<button className="project-column__add" type="button">
				<span aria-hidden="true">+</span>
				Add item
			</button>
		</section>
	);
};

export default Column;
