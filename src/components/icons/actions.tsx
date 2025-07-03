import React from 'react';
import { IconProps } from './types';

export const SortIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
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
      d="M2.667 4h10.666M4.667 8h6.666M6.667 12h2.666"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
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
      d="M14.667 2H1.333l5.334 6.307v4.36L9.333 14V8.307L14.667 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HideFieldsIcon: React.FC<IconProps> = ({ className = '', size = 16, ...props }) => (
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
      d="M2 2l12 12M8.146 8.146a2 2 0 01-2.828-2.828M13.866 13.866A8.001 8.001 0 012.134 2.134m11.732 11.732A8.001 8.001 0 014.293 4.293"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
