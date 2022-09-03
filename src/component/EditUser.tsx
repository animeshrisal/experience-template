import { Avatar, Box, Button, ButtonGroup, Divider, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, VStack } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"

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

const EditForm = () => {
  const defaultSrc =
    "https://www.pngkit.com/png/full/301-3012694_account-user-profile-avatar-comments-fa-user-circle.png";

  const [currentPosition, setCurrentPosition] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Inputs>()

  const inputFile = useRef<HTMLInputElement>(null);;
  const onSubmit: SubmitHandler<Inputs> = values => {
  }

  const handleCancel = () => {
    reset();
  }

  const handleImageChange = () => {
      inputFile.current?.click();
  }

  return (
    <Box marginTop={"5rem"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.profilePicture)}>
          <VStack>
            <Avatar size='2xl' src={defaultSrc} onClick={handleImageChange} />
            <Input
              type="file"
              id='profilePicture'
              visibility="hidden"
              {...register('profilePicture')}
              ref={inputFile}
            />
          </VStack>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.name)} marginTop="2rem">
          <HStack height="3.5rem" align={"flex-start"}>
            <FormLabel
              htmlFor='name'
              width="15rem"
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
        <FormControl isInvalid={Boolean(errors.age)} marginTop="2rem">
          <HStack height="3.5rem" align={"flex-start"}>
            <FormLabel
              htmlFor='age'
              width="15rem"
              marginTop={"0.5rem"}
              fontWeight={"bold"}
              alignSelf="top"
            >
              Age
            </FormLabel>
            <VStack width="100%" align={"flex-start"}>
              <Input
                type="number"
                id='age'
                {...register('age', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage height="1.5rem">
                {errors.age && errors.age.message}
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
    </Box>
  )
}

export default EditForm;