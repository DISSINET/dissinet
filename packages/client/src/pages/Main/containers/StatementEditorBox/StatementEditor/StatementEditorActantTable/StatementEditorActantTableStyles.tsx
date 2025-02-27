import { ElementTypeColor } from "Theme/theme";
import styled from "styled-components";

export const StyledEditorActantTableWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
  min-width: 58rem;
`;

interface StyledRow {
  $marginBottom?: boolean;
}
export const StyledRow = styled.div<StyledRow>`
  margin-bottom: ${({ $marginBottom }) => ($marginBottom ? "2rem" : "")};
`;
interface StyledGrid {
  tempDisabled?: boolean;
  $hasActant?: boolean;
}
export const StyledGrid = styled.div<StyledGrid>`
  display: grid;
  align-items: center;
  grid-template-columns: ${({ $hasActant }) =>
    ` minmax(${$hasActant ? "7rem" : "14.5rem"}, auto) repeat(5, auto)`};
  width: fit-content;
  grid-auto-flow: row;
  padding-left: ${({ theme }) => theme.space[0]};
  padding-bottom: ${({ theme }) => theme.space[1]};
  padding-right: ${({ theme }) => theme.space[2]};
  max-width: 100%;

  opacity: ${({ tempDisabled }) => (tempDisabled ? 0.2 : 1)};
`;

interface StyledGridColumn {}
export const StyledGridColumn = styled.div<StyledGridColumn>`
  margin: ${({ theme }) => theme.space[1]};
  display: grid;
  align-items: center;
`;

export const StyledTagWrapper = styled.div`
  display: inline-flex;
  overflow: hidden;
`;

export const StyledMarkerWrap = styled.div`
  margin-left: ${({ theme }) => `${theme.space[1]}`};
  color: ${({ theme }) => theme.color["success"]};
`;

export const StyledCI = styled.div`
  margin-left: 2.5rem;
  margin-right: ${({ theme }) => theme.space[1]};
`;
export const StyledCIHeading = styled.p`
  font-weight: ${({ theme }) => theme.fontWeight.light};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
  color: ${({ theme }) => theme.color["success"]};
  text-align: left;
  font-style: italic;
  padding-left: ${({ theme }) => theme.space[2]};
`;
export const StyledCIGrid = styled.div`
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-column-gap: 0.5rem;
  width: fit-content;
  max-width: 100%;
  align-items: center;
  padding-right: 0.5rem;
`;

export const StyledExpandedRow = styled.div`
  display: grid;
  align-items: center;
  margin-left: 3rem;
  grid-template-columns: repeat(3, auto) 1fr;
  grid-column-gap: 1rem;
  font-size: 1.4rem;
`;
interface StyledBorderLeft {
  $borderColor: keyof ElementTypeColor;
  $padding?: boolean;
  $marginBottom?: boolean;
}
export const StyledBorderLeft = styled.div<StyledBorderLeft>`
  border-left: 3px solid
    ${({ theme, $borderColor }) => theme.color.elementType[$borderColor]};
  padding-left: ${({ theme, $padding }) => ($padding ? theme.space[1] : "")};
  margin-bottom: ${({ theme, $marginBottom }) =>
    $marginBottom ? theme.space[4] : ""};
`;
export const StyledFlexStart = styled.div`
  display: flex;
  align-items: flex-start;
`;
export const StyledSuggesterWrap = styled.span`
  min-width: 13rem;
`;
