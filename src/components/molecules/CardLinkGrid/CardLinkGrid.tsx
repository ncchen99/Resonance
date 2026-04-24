import { StoryCard } from '@/components/molecules/StoryCard/StoryCard';
import type { Card, User } from '@/lib/db/types';
import { cardToStory } from '@/lib/mock/adapters';
import { Link } from '@/i18n/navigation';

export interface CardLinkGridProps {
  cards: Card[];
  authors: Record<string, User>;
}

export function CardLinkGrid({ cards, authors }: CardLinkGridProps) {
  return (
    <div
      data-card-grid
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
      }}
    >
      {cards.map((card, i) => {
        const author = authors[card.authorId];
        const story = author
          ? cardToStory(card, author)
          : { title: card.thoughtCore, excerpt: '', author: '—', authorInitials: '?', readTime: '—', tag: card.tags[0] ?? '—' };
        return (
          <Link
            key={card.id}
            href={`/card/${card.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <StoryCard story={story} index={i} isLast={i === cards.length - 1} />
          </Link>
        );
      })}
    </div>
  );
}
