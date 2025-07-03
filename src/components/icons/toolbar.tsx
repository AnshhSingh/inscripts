import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const UndoIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3.333 6.667h6A3.333 3.333 0 0112.667 10v0A3.333 3.333 0 019.333 13.333H6M3.333 6.667L5.667 4.333M3.333 6.667L5.667 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RedoIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12.667 6.667h-6A3.333 3.333 0 003.333 10v0a3.333 3.333 0 003.334 3.333H10M12.667 6.667L10.333 4.333M12.667 6.667L10.333 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PaintFormatIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 2H4v3.333h8V2zM8 5.333v9.334M4.667 14.667h6.666"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PercentageIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12.667 3.333L3.333 12.667M5 4.667a1.333 1.333 0 11-2.667 0 1.333 1.333 0 012.667 0zM13.667 11.333a1.333 1.333 0 11-2.667 0 1.333 1.333 0 012.667 0z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CurrencyIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M8 1.333v13.334M11.333 4H6.333C5.597 4 5 4.597 5 5.333v0C5 6.07 5.597 6.667 6.333 6.667h3.334c.736 0 1.333.597 1.333 1.333v0c0 .736-.597 1.333-1.333 1.333H4.667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NumberDecreaseIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M2.667 8h10.666M8.667 10.667L11.333 8 8.667 5.333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
