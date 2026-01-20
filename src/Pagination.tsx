import { useState } from 'react';
import styled from 'styled-components';
import { storeMeter } from './rootStore.ts';

const StyledButton = styled.button<{ active?: boolean }>`
  background-color: ${(props) => (props.active ? '#CED5DE' : '#FFFFFF')};
  width: 32px;
  height: 32px;
  border: 1px solid #ced5de;
  border-radius: 6px;
  cursor: pointer;
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const BUTTONS_COUNT = 3;

interface PaginationProps {
  currentPage: number;
  onChange: (page: number) => void;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  onChange,
  totalPages,
}: PaginationProps) {
  const [start, setStart] = useState(Math.max(1, currentPage - BUTTONS_COUNT));

  const maxStart = totalPages - BUTTONS_COUNT * 2 + 1;

  const leftSide = Array.from(
    { length: BUTTONS_COUNT },
    (_, i) => start + i
  ).filter((page) => page <= totalPages);

  const rightSide = Array.from(
    { length: BUTTONS_COUNT },
    (_, i) => start + BUTTONS_COUNT + i
  ).filter((page) => page <= totalPages);

  const first = leftSide[0];
  const last = rightSide[rightSide.length - 1];

  const handleClick = (page: number) => {
    if (storeMeter.loading) {
      return;
    }
    onChange(page);

    if (page === first && start > 1) {
      setStart((prev) => Math.max(1, prev - BUTTONS_COUNT));
    }

    if (page === last && start < maxStart) {
      setStart((prev) => Math.min(maxStart, prev + BUTTONS_COUNT));
    }
  };

  return (
    <StyledWrapper>
      {leftSide.map((page) => (
        <StyledButton
          key={page}
          onClick={() => handleClick(page)}
          active={page === currentPage}
        >
          {page}
        </StyledButton>
      ))}

      <StyledButton>…</StyledButton>
      {rightSide.map((page) => (
        <StyledButton
          key={page}
          onClick={() => handleClick(page)}
          active={page === currentPage}
        >
          {page}
        </StyledButton>
      ))}
    </StyledWrapper>
  );
}
