import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
  Image,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { getToday } from '../helpers/utils';
import { SelectedWorkExperience, WorkExperience } from '../model/WorkExperience';
import { ModalStatus, SelectedModal } from '../page/ProfilePage';

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
  isSaving: boolean;
  onSave: (experienceId: string | null, values: any) => void;
  experience: WorkExperience & SelectedWorkExperience | null;
}

function EditExperienceModal({ modalStatus, onClose, onSave, isSaving, experience }: EditExperienceModalProps) {
  const [currentPosition, setCurrentPosition] = useState<boolean>(true);
  const [imageSrc, setImageSrc] = useState<string>();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    getValues,
    trigger,
    control
  } = useForm<Inputs>({})

  const watchEndDate = useWatch({
    control,
    name: "endDate"
  })

  useEffect(() => {
    if (watchEndDate !== "") trigger("startDate")
  }, [watchEndDate, trigger])


  const initializeValue = useCallback(() => {
    reset({
      startDate: getToday(),
      endDate: getToday()
    });

    setCurrentPosition(true)
  }, [reset])

  useEffect(() => {
    initializeValue();
    if (experience) {
      const { companyLogo, currentlyWorking, ...remaining } = experience
      reset({ ...remaining })
      if (companyLogo) {
        setImageSrc(companyLogo)
      }
      setCurrentPosition(currentlyWorking)
    }


  }, [experience, initializeValue, reset])

  const onSubmit: SubmitHandler<Inputs> = values => {
    if (experience === null) {
      onSave(null, { companyLogo: imageSrc, currentlyWorking: currentPosition, ...values });
    } else {
      onSave(experience.id, { companyLogo: imageSrc, currentlyWorking: currentPosition, ...values });
    }

  }
  const toggleSwitch = () => {
    setCurrentPosition(prevState => !prevState);
  }

  useEffect(() => {
    trigger(["startDate"])
  }, [currentPosition, trigger])

  const handleCancel = () => {
    reset({
      startDate: getToday(),
      endDate: getToday()
    });
    setImageSrc('');
    setCurrentPosition(false);
    onClose();
  }

  const inputRef = useRef<HTMLInputElement>(null);;
  const handleImageChange = () => {
    inputRef.current?.click();
  }
  const { openModal } = modalStatus

  const onSelectFile = (e: any) => {
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
      isOpen={
        openModal === SelectedModal.IS_ADDING_EXPERIENCE ||
        openModal === SelectedModal.IS_EDITING_EXPERIENCE}
      onClose={handleCancel}
    >
      <ModalOverlay />
      <ModalContent
        maxW={"50vw"}
        minHeight={"70rem"}
        height={"70rem"}
        minWidth={"40rem"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{openModal === SelectedModal.IS_EDITING_EXPERIENCE ? "Edit" : "Add"} Work Experience</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <VStack>
                <Image
                  margin={"auto"}
                  height={"14rem"}
                  width={"14rem"}
                  src={imageSrc}
                  fallbackSrc='https://via.placeholder.com/150' />
                <HStack>
                  <ButtonGroup>
                    <Button colorScheme='teal' onClick={handleImageChange}>
                      Change Photo
                    </Button>
                    <Button onClick={handleDeleteImage} type='button'>
                      Delete
                    </Button>
                    <Input type="file" display={"none"} ref={inputRef} onChange={onSelectFile} />
                  </ButtonGroup>
                </HStack>
              </VStack>
            </Box>
            <FormControl
              height={"5.5rem"}
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
                  {...register('endDate', {
                    validate: {
                      validateEndDate: (value) => {
                        console.log(value)
                        if (!currentPosition && value === '') return "Please enter end date"
                        else return true
                      }
                    }
                  })}
                />
                <HStack marginTop="0.5rem">
                  <Switch isChecked={currentPosition} onChange={toggleSwitch} />
                  <Box>Currently working in this role</Box>
                </HStack>
                <FormErrorMessage>
                  {errors.endDate && errors.endDate.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl height="5.5rem" isInvalid={Boolean(errors.company)} marginBottom="1.5rem">
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
              height="20rem"
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
                  resize={"none"}
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
            <Flex
              flexDirection={"row"}
              justifyContent={"flex-end"}
            >
              <ButtonGroup>
                <Button mt={4} colorScheme='red' onClick={handleCancel} type='button'>
                  Cancel
                </Button>
                <Button mt={4} colorScheme='teal' isLoading={isSaving} type='submit'>
                  Save
                </Button>

              </ButtonGroup>
            </Flex>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditExperienceModal;