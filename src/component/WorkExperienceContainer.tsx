import { Box, Button, ButtonGroup, Container, Divider, HStack, Image, Text } from "@chakra-ui/react";
import { WorkExperience } from "../model/WorkExperience"


export interface WorkExperienceContainerProps extends WorkExperience {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const WorkExperienceContainer = ({
  onEdit,
  onDelete,
  id,
  startDate,
  endDate,
  jobTitle,
  company,
  companyLogo,
  jobDescription,
  currentlyWorking
}: WorkExperienceContainerProps) => {

  const handleEdit = () => {
    onEdit(id)
  }

  const handleDelete = () => {
    onDelete(id)
  }

  return (
    <Box
      width={"100%"}
    >
      <Divider />
      <HStack
        marginTop={"1rem"}
        position="relative" align="flex-start" width="100%">
        <ButtonGroup
          position={"absolute"}
          top="0"
          right="0">
          <Button
            onClick={handleEdit}

          >Edit</Button>
          <Button 
            colorScheme='red'
            onClick={handleDelete}
          >Delete</Button>
        </ButtonGroup>
        <Container width="5rem" paddingTop="1rem">
          <Image src={companyLogo} height="4rem" width="4rem" />
        </Container>
        <Box width="100%">
          <Box>
            <Text
              fontSize={"1.5rem"}
              fontWeight="bold"
            >{jobTitle}</Text></Box>
          <Box>
            <Text
              fontSize={"1.2rem"}
              fontWeight="bold"
            >{company}</Text></Box>
          <Box>{startDate} - {currentlyWorking ? "current" : endDate}</Box>
          <Box>{jobDescription}</Box>
        </Box>
      </HStack>
    </Box>
  )
}

export default WorkExperienceContainer