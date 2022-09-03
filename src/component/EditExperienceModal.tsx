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
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectedWorkExperience, WorkExperience } from '../model/WorkExperience';

type Inputs = {
  name: string;
  profilePicture: string | null;
  age: number;
  workExperience: number;
  startDate: string;
  endDate: string | null;
  jobTitle: string;
  company: string;
  companyLogo: string | FileList;
  jobDescription: string;
}

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experienceId: string, values: any) => void;
  experience: WorkExperience & SelectedWorkExperience | null;
}

function EditExperienceModal({ isOpen, onClose, onSave, experience }: EditExperienceModalProps) {
  const [currentPosition, setCurrentPosition] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>()

  useEffect(() => {
    console.log(experience)
    if (experience) {
      const { ...remaining} = experience
      reset({  ...remaining})
    }
  }, [experience, reset])

  const inputFile = useRef<HTMLInputElement>(null);;

  const onSubmit: SubmitHandler<Inputs> = values => {
    console.log(experience)
    if(experience) onSave(experience.id, values);
  }
  const toggleSwitch = () => {
    setCurrentPosition(prevState => !prevState);
  }

  const handleCancel = () => {
    reset({});
    onClose();
  }

  const validateStartDate = (startDate: string) => {
    return new Date(startDate) < new Date();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <ModalOverlay />
      <ModalContent
        maxW={"50vw"}
        height={"70vh"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Work Experience</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
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

            <FormControl isInvalid={Boolean(errors.companyLogo)}>
              <Input
                type="file"
                id='companyLogo'
                placeholder=''
                {...register('companyLogo')}
              />
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