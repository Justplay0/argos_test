import type { FC } from 'react';
import './TagBadge.css';

interface TagBadgeProps {
  label: string;
  variant?: 'default' | 'danger' | 'success';
}

export const TagBadge: FC<TagBadgeProps> = ({ label, variant = 'default' }) => {
  return (
    <span
      className={`tag-badge tag-badge-${variant}`}
      data-testid={`badge-${label.toLowerCase()}`}
    >
      {label}
    </span>
  );
};
