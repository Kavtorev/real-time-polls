import React from "react";
import styled from "styled-components";

const StyledSvg = styled.svg`
  & path {
    fill: var(--primary-button-color);
  }
`;

export const ArrowRightIcon: React.FC = () => {
  return (
    <StyledSvg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.80281 1.07167L7.59558 0.2583C7.93126 -0.0861015 8.47405 -0.0861015 8.80616 0.2583L15.7482 7.37715C16.0839 7.72155 16.0839 8.27845 15.7482 8.61919L8.80616 15.7417C8.47048 16.0861 7.92769 16.0861 7.59558 15.7417L6.80281 14.9283C6.46356 14.5803 6.47071 14.0124 6.8171 13.6716L11.1202 9.46554L0.857047 9.46554C0.3821 9.46554 0 9.0735 0 8.58621V7.41378C0 6.92649 0.3821 6.53446 0.857047 6.53446L11.1202 6.53446L6.8171 2.32837C6.46714 1.98763 6.45999 1.41974 6.80281 1.07167Z"
        fill="#525151"
      />
    </StyledSvg>
  );
};