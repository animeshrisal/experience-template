import { Avatar, Box, Button, Container, Divider, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import { WorkExperience } from "../model/WorkExperience"


export interface WorkExperienceContainerProps extends WorkExperience {
  onEdit: (id: string) => void;
}

const WorkExperienceContainer = ({
  onEdit,
  id,
  startDate,
  endDate,
  jobTitle,
  company,
  companyLogo,
  jobDescription
}: WorkExperienceContainerProps) => {

  const handleEdit = () => {
    onEdit(id)
  }

  return (
    <Box
      width={"100%"}
    >
      <Divider />
      <HStack
        marginTop={"1rem"}
        position="relative" align="flex-start" width="100%">
        <Button
          onClick={handleEdit}
          position={"absolute"}
          top="0"
          right="0"
        >Edit</Button>
        <Container width="5rem" paddingTop="1rem">
          <Avatar />
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
          <Box>{startDate} - {endDate}</Box>
          <Box>{jobDescription}</Box>
        </Box>
      </HStack>
    </Box>
  )
}

export default WorkExperienceContainer