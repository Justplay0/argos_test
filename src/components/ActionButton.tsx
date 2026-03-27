import type { FC } from 'react';
import './ActionButton.css';

interface ActionButtonProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: FC<ActionButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <button
      type="button"
      className={`action-button action-button-${variant}`}
      onClick={onClick}
      disabled={disabled}
      data-testid={`action-btn-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {label}
    </button>
  );
};
