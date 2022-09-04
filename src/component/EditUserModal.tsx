import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Box,
  FormErrorMessage,
  VStack,
  Textarea,
  Button,
  Divider,
  Flex,
  ButtonGroup,
  Avatar,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  name: string;
  profilePicture: string | null;
  dateOfBirth: string;
}

interface EditUserModalProps {
  user: Inputs
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
}

function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Inputs>()

  useEffect(() => {
    const {profilePicture, ...extra} = user;
    reset({...extra});
    if (profilePicture) {
      setImageSrc(profilePicture)
    }
  }, [user, reset])

  const inputFile = useRef<HTMLInputElement>(null);
  const onSubmit: SubmitHandler<Inputs> = values => {
    onSave({...values, profilePicture: imageSrc})
  }

   const handleCancel = () => {
    reset();
    setImageSrc("");
  }

  const handleImageChange = () => {
    inputFile.current?.click();
  }

  const onSelectFile = (e: any) => {
    console.log(e.target.files[0])
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setImageSrc(reader.result as string)
    }
  }

  const handleDeleteImage = () => {
    setImageSrc("");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        maxW={"20vw"}
        height={"45vh"}
      >
        <ModalBody marginTop={"4rem"}>        
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.profilePicture)}>
            <VStack>
              <Avatar size='2xl' src={imageSrc} onClick={handleImageChange} />
              <Input
                type="file"
                id='profilePicture'
                display={"none"}
                {...register('profilePicture')}
                ref={inputFile}
                onChange={onSelectFile} 
              />
              <ButtonGroup>
                <Button colorScheme='teal' onClick={handleImageChange}>
                  Change Photo
                </Button>
                <Button onClick={handleDeleteImage} type='button'>
                  Delete
                </Button>
                <Input type="file" display={"none"} ref={inputRef} onChange={onSelectFile} />
              </ButtonGroup>
            </VStack>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.name)} marginTop="2rem">
            <HStack height="3.5rem" align={"flex-start"}>
              <FormLabel
                htmlFor='name'
                width="8rem"
                marginTop={"0.5rem"}
                fontWeight={"bold"}
                alignSelf="top"
              >
                Name
              </FormLabel>
              <VStack width="100%" align={"flex-start"}>
                <Input
                  id='name'
                  {...register('name', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                />
                <FormErrorMessage height="1.5rem">
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </VStack>
            </HStack>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.dateOfBirth)} marginTop="2rem">
            <HStack height="3.5rem" align={"flex-start"}>
              <FormLabel
                htmlFor='dateOfBirth'
                width="8rem"
                marginTop={"0.5rem"}
                fontWeight={"bold"}
                alignSelf="top"
                whiteSpace={"nowrap"}
              >
                Date of Birth
              </FormLabel>
              <VStack width="100%" align={"flex-start"}>
                <Input
                  type="date"
                  id='dateOfBirth'
                  {...register('dateOfBirth', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage height="1.5rem">
                  {errors.dateOfBirth && errors.dateOfBirth.message}
                </FormErrorMessage>
              </VStack>
            </HStack>
          </FormControl>
          <Divider margin="1.5rem 0" />
          <Flex>
            <ButtonGroup marginLeft={"auto"}>
              <Button mt={4} colorScheme='red' isLoading={isSubmitting} onClick={handleCancel} type='button'>
                Cancel
              </Button>
              <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                Save
              </Button>
            </ButtonGroup>
          </Flex>
        </form>
        </ModalBody>

      </ModalContent>
    </Modal>
  )
}

export default EditUserModal;