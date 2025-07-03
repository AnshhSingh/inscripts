import React from 'react';
import { IconProps } from './IconProps';

export const NumberIcon: React.FC<IconProps> = ({ 
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
      
      <path d="M9 7L9 17" />
      <path d="M15 7V17" />
      <path d="M5 11H19" />
    </svg>
  );
};
