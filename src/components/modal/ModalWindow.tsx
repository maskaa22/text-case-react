import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
} from "@chakra-ui/react";
import { ModalInterface } from "../../interface";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

function ModalWindow({ isOpen, onClose, id, flag }: ModalInterface) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<string>("");

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const editStatus = async (status: string) => {
    await axios.put(`http://localhost:3000/editTransactionStatus/${id}`, {
      status,
    });
  };

  const deleteTransaction = async () => {
    await axios.delete(`http://localhost:3000/deleteTransaction/${id}`);
  };

  const editMutation = useMutation(editStatus, {
    onSuccess: () => queryClient.invalidateQueries("transactions"),
  });
  const deletetMutation = useMutation(deleteTransaction, {
    onSuccess: () => queryClient.invalidateQueries("transactions"),
  });

  const handleSaveSatus = () => {
    editMutation.mutate(newStatus);
    onClose();
  };
  const handleDeleteTransaction = () => {
    deletetMutation.mutate();
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {flag === "edit"
              ? "Edit status"
              : "Are you sure you want to delete it?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {flag === "edit" ? (
              <Select
                placeholder="Select status"
                onChange={(e) => handleChangeStatus(e)}
                value={newStatus}
              >
                <option value={"Pending"}>Pending</option>
                <option value={"Completed"}>Completed</option>
                <option value={"Cancelled"}>Cancelled</option>
              </Select>
            ) : (
              ""
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={flag === 'edit' ? handleSaveSatus: handleDeleteTransaction}>
              {flag === "edit" ? "Save" : "Yes"}
            </Button>
            <Button
              variant={"ghost"}
              colorScheme={flag === "delete" && "red"}
              onClick={onClose}
            >
              {flag === "edit" ? "Cansel" : "No"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default ModalWindow;
