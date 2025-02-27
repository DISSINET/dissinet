import styled from "styled-components";

export const StyledDots = styled.p`
  display: flex;
  align-items: flex-end;
  margin-left: ${({ theme }) => theme.space[1]};
  cursor: default;
`;

export const StyledLoaderWrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSelectorCell = styled.div`
  cursor: pointer;
  margin: -0.5em 0em;
`;

export const StyledActionLabel = styled.div`
  font-size: 90%;
  max-width: 12em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface StyledTableWrapper {
  $isListMode?: boolean;
}
export const StyledTableWrapper = styled.div<StyledTableWrapper>`
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow-x: ${({ $isListMode }) => ($isListMode ? "auto" : "hidden")};
  flex-shrink: 0;
  padding-right: 0.1rem;
  padding-bottom: 1rem;
`;

export const StyledEmptyState = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color["gray"][600]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
  display: flex;
  align-self: center;
  align-items: center;
  text-align: center;
`;
