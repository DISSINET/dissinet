import { Button } from "components";
import React, { ReactElement } from "react";
import { FaUnlink } from "react-icons/fa";
import { StyledButtonWrap, StyledCloud, StyledCloudWrap } from "./CloudStyles";
import { IEntity } from "@shared/types";

interface Cloud {
  children: ReactElement;
  onUnlink: () => void;
  originEntity: IEntity | undefined;
  disabled?: boolean;
}
export const Cloud: React.FC<Cloud> = ({
  children,
  onUnlink,
  originEntity,
  disabled,
}) => {
  return (
    <StyledCloudWrap>
      <StyledCloud>{children}</StyledCloud>
      <StyledButtonWrap>
        <Button
          color="plain"
          inverted
          tooltipLabel={`unlink ${
            originEntity?.label ?? "entity"
          } from the cloud`}
          icon={<FaUnlink />}
          onClick={onUnlink}
          disabled={disabled}
        />
      </StyledButtonWrap>
    </StyledCloudWrap>
  );
};
