import React from 'react';
import { IconProps } from './IconProps';

export const ChevronDownIcon: React.FC<IconProps> = ({ 
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

      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};
