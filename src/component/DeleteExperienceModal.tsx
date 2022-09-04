import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Flex,
  ButtonGroup,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react'

interface DeleteExperienceModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onDelete: () => void;
}

function DeleteExperienceModal({ isOpen, isSaving, onClose, onDelete }: DeleteExperienceModalProps) {

  const handleCancel = () => {
    onClose()
  }

  const handleDelete = () => {
    onDelete();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
      >
        <ModalHeader>Delete Experience</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this experience ?
        </ModalBody>
        <ModalFooter>
          <Flex
            flexDirection={"row"}
            justifyContent={"flex-end"}
          >
            <ButtonGroup>
              <Button colorScheme='red' onClick={handleCancel} type='button'>
                Cancel
              </Button>
              <Button colorScheme='teal' isLoading={isSaving} type='submit' onClick={handleDelete}>
                Deletes
              </Button>

            </ButtonGroup>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteExperienceModal;