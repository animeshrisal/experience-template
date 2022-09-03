import { Box, Button, Container, Flex, Heading, HStack, Portal, Spacer, Text, VStack } from "@chakra-ui/react";
import { defaultMaxListeners } from "events";
import { useState } from "react";
import EditExperienceModal from "../component/EditExperienceModal";
import WorkExperienceContainer from "../component/WorkExperienceContainer";
import { User } from "../model/User";
import { SelectedWorkExperience, WorkExperience } from "../model/WorkExperience";
import { v4 as uuidv4 } from 'uuid';

const mockData: User = {
  id: "1",
  name: "Abhinav Risal",
  age: 1,
  profilePicture: "test",
  workExperiences: {
    [uuidv4()]: {
      startDate: '2022-11-11',
      endDate: '2022-11-12',
      currentlyWorking: false,
      jobTitle: "Software Engineer",
      company: "Cloud Factory",
      companyLogo: "image",
      jobDescription: "Software engineer",
    }
  }
}

export interface ModalStatus {
  isOpen: boolean;
  isEditing: boolean;
}

function ProfilePage() {

  const defaultState: ModalStatus = {
    isOpen: false,
    isEditing: false,
  }

  const [modalStatus, setModalStatus] = useState<ModalStatus>(defaultState);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience & SelectedWorkExperience | null>(null);

  const handleEditWorkExperience = (id: string) => {
    console.log(mockData.workExperiences[id])
    setSelectedExperience({ id, ...mockData.workExperiences[id] })
    setModalStatus({ isOpen: true, isEditing: true });
  }

  const handleSave = (experienceId: string | null, data: any) => {
    if(experienceId === null) {
      mockData.workExperiences[uuidv4()] = data;
    } else {
      mockData.workExperiences[experienceId] = data;
    }
    setModalStatus(defaultState)
  }

  const handleClose = () => {
    setModalStatus(defaultState);
    setSelectedExperience(null)
  }

  const handleNewExperience = () => {
    setModalStatus({
      isOpen: true,
      isEditing: false,
    })
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
            {Object.entries(workExperiences).map(([key, workExperience]) =>
              (<WorkExperienceContainer key={key} id={key} {...workExperience} onEdit={handleEditWorkExperience} />)
            )}
          </VStack>
        </Box>
      </HStack>
      <Portal>
        <EditExperienceModal
          experience={selectedExperience}
          modalStatus={modalStatus}
          onSave={handleSave}
          onClose={handleClose} />
      </Portal>
    </Container>
  )
}

export default ProfilePage;