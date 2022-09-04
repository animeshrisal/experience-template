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
  Avatar,
  Image,
  ButtonGroup,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectedWorkExperience, WorkExperience } from '../model/WorkExperience';
import { ModalStatus } from '../page/ProfilePage';

type Inputs = {
  startDate: string;
  endDate: string | null;
  jobTitle: string;
  company: string;
  jobDescription: string;
}

interface EditExperienceModalProps {
  modalStatus: ModalStatus;
  onClose: () => void;
  onSave: (experienceId: string | null, values: any) => void;
  experience: WorkExperience & SelectedWorkExperience | null;
}

function EditExperienceModal({ modalStatus, onClose, onSave, experience }: EditExperienceModalProps) {
  const [currentPosition, setCurrentPosition] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    trigger
  } = useForm<Inputs>()

  useEffect(() => {
    if (experience) {
      const { companyLogo, currentlyWorking, ...remaining } = experience
      reset({ ...remaining })
      if (companyLogo) {
        setImageSrc(companyLogo)
      }
      setCurrentPosition(currentlyWorking)
    }
  }, [experience, reset])

  const onSubmit: SubmitHandler<Inputs> = values => {
    if (experience === null) {
      onSave(null, { companyLogo: imageSrc, ...values });
    } else {
      onSave(experience.id, { companyLogo: imageSrc, ...values });
    }

  }
  const toggleSwitch = () => {
    setCurrentPosition(prevState => !prevState);
  }

  useEffect(() => {
    trigger(["startDate"])
  }, [currentPosition, trigger])

  const handleCancel = () => {
    reset({});
    setImageSrc('');
    setCurrentPosition(false);
    onClose();
  }

  const inputRef = useRef<HTMLInputElement>(null);;
  const handleImageChange = () => {
    inputRef.current?.click();
  }
  const { isOpen, isEditing } = modalStatus

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
      onClose={handleCancel}
    >
      <ModalOverlay />
      <ModalContent
        maxW={"50vw"}
        height={"75vh"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{isEditing ? "Edit" : "Add"} Work Experience</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <VStack>
                <Image
                  margin={"auto"}
                  height={"10rem"}
                  width={"10rem"}
                  src={imageSrc}
                  fallbackSrc='https://via.placeholder.com/150' />
                <HStack>
                  <ButtonGroup>
                    <Button onClick={handleDeleteImage} type='button'>
                      Delete
                    </Button>
                    <Button colorScheme='teal' onClick={handleImageChange}>
                      Change Photo
                    </Button>
                    <Input type="file" display={"none"} ref={inputRef} onChange={onSelectFile} />
                  </ButtonGroup>
                </HStack>
              </VStack>
            </Box>
            <FormControl
              isInvalid={Boolean(errors.jobTitle)}
              marginBottom={"1.5rem"}>
              <FormLabel
                htmlFor='jobTitle'
                width="15rem"
                marginTop={"0.5rem"}
                fontWeight={"bold"}
                alignSelf="top"

              >
                Job Title*
              </FormLabel>
              <VStack width="100%" align={"flex-start"}>
                <Input
                  id='jobTitle'
                  {...register('jobTitle', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage height="1.5rem">
                  {errors.jobTitle && errors.jobTitle.message}
                </FormErrorMessage>
              </VStack>
            </FormControl>
            <HStack height="8rem" align={"flex-start"}>

              <FormControl isInvalid={Boolean(errors.startDate)}>
                <FormLabel htmlFor='startDate' width="15rem" fontWeight={"bold"}>Start Date</FormLabel>
                <Input
                  type="date"
                  id='startDate'
                  {...register('startDate', {
                    required: 'This is required',
                    validate: {
                      validateEndDate: (value) => {
                        const startDate = new Date(value);
                        const endDate = new Date(getValues().endDate!)
                        if (!currentPosition && startDate > endDate) {
                          return "Start Date cannot be after End date"
                        }
                      }
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.startDate && errors.startDate.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.endDate)} >
                <FormLabel htmlFor='endDate' fontWeight={"bold"}>End Date</FormLabel>
                <Input
                  disabled={currentPosition}
                  type="date"
                  id='endDate'
                  {...register('endDate')}
                />
                <HStack marginTop="0.5rem">
                  <Switch onChange={toggleSwitch} />
                  <Box>Currently working in this role</Box>
                </HStack>
              </FormControl>
            </HStack>
            <FormControl isInvalid={Boolean(errors.company)} marginBottom="1.5rem">
              <FormLabel
                htmlFor='company'
                width="15rem"
                fontWeight={"bold"}
                alignSelf="top"
              >
                Company
              </FormLabel>
              <VStack width="100%" align={"flex-start"}>
                <Input
                  id='company'
                  {...register('company', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage height="1.5rem">
                  {errors.company && errors.company.message}
                </FormErrorMessage>
              </VStack>
            </FormControl>

            <FormControl
              isInvalid={Boolean(errors.jobDescription)}

            >
              <FormLabel
                htmlFor='jobDescription'
                width="15rem"
                marginTop={"0.5rem"}
                fontWeight={"bold"}
                alignSelf="top"
              >
                Job Description
              </FormLabel>
              <VStack width="100%" align={"flex-start"}>
                <Textarea
                  height={"15rem"}
                  id='jobDescription'
                  {...register('jobDescription', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage height="1.5rem">
                  {errors.jobDescription && errors.jobDescription.message}
                </FormErrorMessage>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mt={4} colorScheme='red' isLoading={isSubmitting} onClick={handleCancel} type='button'>
              Cancel
            </Button>
            <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditExperienceModal;