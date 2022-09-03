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
  import { useRef, useState } from 'react';
  import { SubmitHandler, useForm } from 'react-hook-form';
  
  type Inputs = {
    name: string;
    profilePicture: string | null;
    age: number;
    workExperience: number;
    startDate: Date;
    endDate: Date | null;
    jobTitle: string;
    company: string;
    companyLogo: string;
    jobDescription: string;
  }
  
  interface EditExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  function EditExperienceModal({ isOpen, onClose }: EditExperienceModalProps) {
    const [currentPosition, setCurrentPosition] = useState<boolean>(false);
    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
      reset
    } = useForm<Inputs>()
  
    const inputFile = useRef<HTMLInputElement>(null);;
  
    const onSubmit: SubmitHandler<Inputs> = values => {
      console.log(values);
    }
    const toggleSwitch = () => {
      setCurrentPosition(prevState => !prevState);
    }
  
    const handleCancel = () => {
      reset();
    }
  
    const validateStartDate = (startDate: Date) => {
      return new Date(startDate) < new Date();
    }
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          maxW={"50vw"}
          height={"70vh"}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
  
            <ModalBody>
  
              <HStack height="8rem" align={"flex-start"}>
                <FormControl isInvalid={Boolean(errors.startDate)}>
                  <FormLabel htmlFor='startDate' width="15rem" fontWeight={"bold"}>Start Date</FormLabel>
                  <Input
                    type="date"
                    id='profilePicture'
                    placeholder=''
                    {...register('startDate', {
                      required: 'This is required',
                      validate: validateStartDate
                    })}
                  />
                  <FormErrorMessage>
                    {errors.startDate && errors.startDate.message}
                    {errors.startDate && errors.startDate.type === "validate" && (
                      <Box>asdasd</Box>
                    )}
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
  
              <FormControl isInvalid={Boolean(errors.jobTitle)}>
                <HStack height="3.5rem" align={"flex-start"}>
                  <FormLabel
                    htmlFor='jobTitle'
                    width="15rem"
                    marginTop={"0.5rem"}
                    fontWeight={"bold"}
                    alignSelf="top"
                  >
                    Job Title
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
                </HStack>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.company)}>
                <HStack height="3.5rem" align={"flex-start"}>
                  <FormLabel
                    htmlFor='company'
                    width="15rem"
                    marginTop={"0.5rem"}
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
                </HStack>
              </FormControl>
  
              <FormControl isInvalid={Boolean(errors.companyLogo)}>
                <HStack height="4rem">
                  <FormLabel htmlFor='companyLogo' width="15rem" fontWeight={"bold"}>Company Logo</FormLabel>
                  <Input
                    type="file"
                    id='companyLogo'
                    placeholder=''
                    {...register('companyLogo')}
                  />
                  <FormErrorMessage>
                    {errors.profilePicture && errors.profilePicture.message}
                  </FormErrorMessage>
                </HStack>
              </FormControl>
  
  
              <FormControl isInvalid={Boolean(errors.jobDescription)}>
                <HStack height="15rem" align={"flex-start"}>
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
                </HStack>
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button mt={4} colorScheme='red' isLoading={isSubmitting} onClick={onClose} type='button'>
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