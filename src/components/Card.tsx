export type CardLabelTone = 'feature' | 'bug' | 'research' | 'release' | 'design';

export interface BoardCardData {
	id: string;
	title: string;
	labels?: Array<{
		text: string;
		tone?: CardLabelTone;
	}>;
	meta?: string[];
	assignee?: string;
}

interface CardProps {
	card: BoardCardData;
}

const getInitials = (assignee?: string) => {
	if (!assignee) {
		return 'GH';
	}

	return assignee
		.split(' ')
		.map((part) => part[0]?.toUpperCase())
		.join('')
		.slice(0, 2);
};

const getToneClassName = (tone: CardLabelTone = 'feature') => {
	return `project-card__label project-card__label--${tone}`;
};

const getDisplayCardId = (id: string) => {
	if (id.length <= 8) {
		return id;
	}

	return id.slice(-6);
};

const Card = ({ card }: CardProps) => {
	return (
		<article className="project-card">
			<div className="project-card__eyebrow">#{getDisplayCardId(card.id)}</div>
			<h4 className="project-card__title">{card.title}</h4>

			{card.labels?.length ? (
				<div className="project-card__labels" aria-label="Card labels">
					{card.labels.map((label) => (
						<span key={`${card.id}-${label.text}`} className={getToneClassName(label.tone)}>
							{label.text}
						</span>
					))}
				</div>
			) : null}

			<footer className="project-card__footer">
				<div className="project-card__meta">
					{card.meta?.map((item) => (
						<span key={`${card.id}-${item}`}>{item}</span>
					))}
				</div>

				<div className="project-card__avatar" aria-label={card.assignee ?? 'Unassigned'}>
					{getInitials(card.assignee)}
				</div>
			</footer>
		</article>
	);
};

export default Card;
