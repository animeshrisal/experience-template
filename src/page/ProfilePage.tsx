import { Box, Button, Container, Flex, Heading, HStack, Portal, Spacer, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import EditExperienceModal from "../component/EditExperienceModal";
import WorkExperienceContainer from "../component/WorkExperienceContainer";
import { User } from "../model/User";
import { WorkExperience } from "../model/WorkExperience";

const mockData: User = {
  id: "1",
  name: "Abhinav Risal",
  age: 1,
  profilePicture: "test",
  workExperiences: [{
    id: 'asd',
    startDate: '2022-11-11',
    endDate: '2022-11-12',
    currentlyWorking: false,
    jobTitle: "Software Engineer",
    company: "Cloud Factory",
    companyLogo: "image",
    jobDescription: "Software engineer",
  }]
}

function ProfilePage() {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
  
  const handleEditWorkExperience = (id: string) => {
    setSelectedExperience(mockData.workExperiences[0])
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
    setSelectedExperience(null)
  }

  const handleNewExperience = () => {
    setIsOpen(true)
  }

  const { workExperiences } = mockData;
  return (
    <Container
      maxW={"50vw"}
      marginTop="8rem"
    >
      <HStack width="100%">
        <Box width="100%">
          <VStack align={"flex-start"}>
            <Heading>
              Profile
            </Heading>
            <VStack align={"flex-start"}>
              <Box>
                <Text>Name: {mockData.name}</Text>
              </Box>
              <Box>
                Age: {mockData.age}
              </Box>
            </VStack>
            <Spacer />
            <Flex
              width="100%"
              flexDirection={"row"}
              justifyContent={"space-between"}>
              <Heading>Experience</Heading>
              <Button
                onClick={handleNewExperience}
              >Add New Experience</Button>
            </Flex>
            {workExperiences.map(workExperience =>
              (<WorkExperienceContainer {...workExperience} onEdit={handleEditWorkExperience} />)
            )}
          </VStack>
        </Box>
      </HStack>
      <Portal>
        <EditExperienceModal 
          experience={selectedExperience}
          isOpen={isOpen} 
          onClose={handleClose} />
      </Portal>
    </Container>
  )
}

export default ProfilePage;