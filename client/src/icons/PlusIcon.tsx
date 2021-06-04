import React from "react";
import styled from "styled-components";
import { StyledIconWrapper } from "./StyledIconWrapper";

const StyledPlusIconWrapper = styled(StyledIconWrapper)`
  display: inline-flex;
`;

export const PlusIcon: React.FC<{ onClick: React.MouseEventHandler }> = ({
  onClick,
}) => {
  return (
    <StyledPlusIconWrapper onClick={onClick}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path
            d="M18.9999 9H11.0001V0.999939C11.0001 0.448059 10.552 0 9.99994 0C9.44806 0 9 0.448059 9 0.999939V9H0.999939C0.448059 9 0 9.44806 0 9.99994C0 10.552 0.448059 11.0001 0.999939 11.0001H9V18.9999C9 19.552 9.44806 20.0001 9.99994 20.0001C10.552 20.0001 11.0001 19.552 11.0001 18.9999V11.0001H18.9999C19.552 11.0001 20.0001 10.552 20.0001 9.99994C20.0001 9.44806 19.552 9 18.9999 9V9Z"
            fill="#525151"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </StyledPlusIconWrapper>
  );
};
