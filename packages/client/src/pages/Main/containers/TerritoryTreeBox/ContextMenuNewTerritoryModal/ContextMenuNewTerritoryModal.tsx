import { EntityEnums, UserEnums } from "@shared/enums";
import { ITerritory } from "@shared/types";
import api from "api";
import {
  Button,
  ButtonGroup,
  Input,
  Loader,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "components";
import { CTerritory } from "constructors";
import { useSearchParams } from "hooks";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { setTreeInitialized } from "redux/features/territoryTree/treeInitializeSlice";
import { useAppDispatch } from "redux/hooks";
import { getShortLabelByLetterCount } from "utils/utils";

interface ContextMenuNewTerritoryModal {
  territoryActantId: string;
  onClose: () => void;
}
export const ContextMenuNewTerritoryModal: React.FC<
  ContextMenuNewTerritoryModal
> = ({ onClose, territoryActantId }) => {
  const [territoryName, setTerritoryName] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(true);
  }, []);

  const queryClient = useQueryClient();

  // get user data
  const userId = localStorage.getItem("userid");
  const {
    status: statusUser,
    data: user,
    error: errorUser,
    isFetching: isFetchingUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (userId) {
        const res = await api.usersGet(userId);
        return res.data;
      }
    },
    enabled: !!userId && api.isLoggedIn(),
  });

  const { setTerritoryId, appendDetailId } = useSearchParams();
  const dispatch = useAppDispatch();

  const createTerritoryMutation = useMutation({
    mutationFn: async (newTerritory: ITerritory) =>
      await api.entityCreate(newTerritory),
    onSuccess: (data, variables) => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["tree"] });

      dispatch(setTreeInitialized(false));
      setTerritoryId(variables.id);

      appendDetailId(variables.id);
    },
    onError: () => {
      toast.error(
        `Error: Territory [${getShortLabelByLetterCount(
          territoryName,
          120
        )}] not created!`
      );
    },
  });

  const handleCreateTerritory = () => {
    if (territoryName.length > 0 && user) {
      const newTerritory: ITerritory = CTerritory(
        localStorage.getItem("userrole") as UserEnums.Role,
        user.options,
        territoryName,
        "",
        territoryActantId,
        EntityEnums.Order.Last
      );
      createTerritoryMutation.mutate(newTerritory);
    } else {
      toast.warning("Fill territory name!");
    }
  };

  return (
    <>
      <Modal
        onEnterPress={handleCreateTerritory}
        onClose={() => onClose()}
        showModal={showModal}
        disableBgClick
        isLoading={createTerritoryMutation.isPending}
      >
        <ModalHeader title={"Add Territory"} />
        <ModalContent>
          <Input
            autoFocus
            label={"Territory name: "}
            value={territoryName}
            onChangeFn={(value: string) => setTerritoryName(value)}
            changeOnType
          />
        </ModalContent>
        <ModalFooter>
          <ButtonGroup>
            <Button
              label="Cancel"
              color="success"
              onClick={() => {
                onClose();
              }}
            />
            <Button
              label="Save"
              color="primary"
              onClick={() => handleCreateTerritory()}
            />
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
};
