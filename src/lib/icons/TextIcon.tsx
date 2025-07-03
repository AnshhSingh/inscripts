import React from 'react';
import { IconProps } from './IconProps';

export const TextIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 16, 
  color = 'currentColor',
  title 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >

      <path d="M17 10H3" />
      <path d="M21 6H3" />
      <path d="M21 14H3" />
      <path d="M17 18H3" />
    </svg>
  );
};
