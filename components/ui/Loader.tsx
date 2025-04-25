'use client'

import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

interface StyledWrapperProps {
  theme?: DefaultTheme;
}

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loading">
        <svg height="48px" width="64px">
          <polyline id="back" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
          <polyline id="front" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .loading svg polyline {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loading svg polyline#back {
    fill: none;
    stroke: ${({ theme }) => theme?.colors?.gray?.[300] ?? '#D1D5DB'};
    /* Add dark theme stroke if needed */
    /* @media (prefers-color-scheme: dark) {
      stroke: ${({ theme }) => theme?.colors?.gray?.[600] || '#4B5563'}; 
    } */
  }

  .loading svg polyline#front {
    fill: none;
    stroke: ${({ theme }) => theme?.colors?.red?.[500] || '#FF0000'};
    stroke-dasharray: 48, 144;
    stroke-dashoffset: 192;
    animation: dash_682 1.4s linear infinite;
  }

  @keyframes dash_682 {
    72.5% {
      opacity: 0;
    }

    to {
      stroke-dashoffset: 0;
    }
  }
`;

export default Loader;