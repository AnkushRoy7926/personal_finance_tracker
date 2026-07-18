import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 24, width: 140, mr: 1 }} viewBox="0 0 140 24">
      <svg
        width={140}
        height={24}
        viewBox="0 0 140 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Planet body */}
        <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.85" />
        {/* Planet ring */}
        <ellipse
          cx="12"
          cy="12"
          rx="11"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          transform="rotate(-20 12 12)"
        />
        {/* Small highlight dot */}
        <circle cx="9" cy="9" r="1.5" fill="currentColor" opacity="0.3" />
        {/* Text */}
        <text
          x="30"
          y="16.5"
          fontFamily="Inter, sans-serif"
          fontSize="14"
          fontWeight="600"
          fill="currentColor"
        >
          Project Pluto
        </text>
      </svg>
    </SvgIcon>
  );
}
