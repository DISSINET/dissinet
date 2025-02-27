import styled from "styled-components";

export const StyledRelation = styled.div`
  display: inline-flex;
  overflow: hidden;
  flex-wrap: wrap;
`;
export const StyledEntityWrapper = styled.div`
  display: inline-flex;
  overflow: hidden;
  max-width: 100%;
  margin-right: ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;
export const StyledCloudEntityWrapper = styled.div`
  display: inline-flex;
  overflow: hidden;
  max-width: 100%;
  margin: ${({ theme }) => theme.space[1]};
`;
interface StyledGrid {
  $hasAttribute?: boolean;
  $hasOrder: boolean;
}
export const StyledGrid = styled.div<StyledGrid>`
  display: grid;
  grid-template-columns: ${({ $hasAttribute, $hasOrder }) =>
    `${$hasOrder ? "2rem" : ""} ${
      $hasAttribute ? "minmax(7rem, auto)" : "auto"
    } ${$hasAttribute ? "10.5rem" : ""}`};
  max-width: 100%;
  align-items: center;
  width: fit-content;
`;
export const StyledGridColumn = styled.div`
  margin: ${({ theme }) => theme.space[1]};
  display: grid;
  align-items: center;
`;
export const StyledLabelSuggester = styled.div`
  display: flex;
  flex-direction: column;
`;
interface StyledRelationValues {
  $hasSuggester: boolean;
}
export const StyledRelationValues = styled.div<StyledRelationValues>`
  margin-top: ${({ theme, $hasSuggester }) =>
    $hasSuggester ? theme.space[2] : theme.space[1]};
`;
export const StyledSuggesterWrapper = styled.div`
  margin-top: ${({ theme }) => theme.space[1]};
`;

export const StyledRelationBlock = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
`;

interface StyledEntityDetailRelationGraph {
  height?: number;
}

export const StyledEntityDetailRelationGraph = styled.div<StyledEntityDetailRelationGraph>`
  display: block;
  height: ${({ theme, height }) => (height ? `${height}px` : "500px")};
  margin-bottom: ${({ theme }) => theme.space[12]};
  margin-bottom: ${({ theme }) => -theme.space[8]};
`;
