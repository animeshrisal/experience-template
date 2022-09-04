import { Box, Button, Container, Flex, Heading, HStack, Portal, Spacer, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import EditExperienceModal from "../component/EditExperienceModal";
import WorkExperienceContainer from "../component/WorkExperienceContainer";
import { User } from "../model/User";
import { SelectedWorkExperience, WorkExperience } from "../model/WorkExperience";
import { v4 as uuidv4 } from 'uuid';
import { getDataFromLocalStorage, saveDataToLocalStorage } from "../helpers/storage";
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore/lite';
import isOnline from "is-online";

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

  const intervalRef = useRef<undefined | ReturnType<typeof setInterval>>();
  const [profile, setProfile] = useState<User | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(defaultState);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience & SelectedWorkExperience | null>(null);

  const saveData = useCallback(async (data: any) => {
      try {
        await setDoc(doc(db, "profile", "user"), data);
      } catch (e) {
        console.error("Error adding document: ", e);
      } finally {
        saveDataToLocalStorage(data);
      }
  }, [])

  const checkIfOnline = useCallback(async () => {
    const online = await isOnline();
    if (online) {
      saveData(getDataFromLocalStorage()).then(() => {
        clearInterval(intervalRef.current);
        localStorage.removeItem("SyncRequired");
      })
    }
  }, [saveData])

  useEffect(() => {
    const syncRequired = localStorage.getItem("SyncRequired");
    if (syncRequired) {
      setProfile(getDataFromLocalStorage()!)
      const id = setInterval(() => {
        checkIfOnline();
      }, 5000)
      intervalRef.current = id;
    } else {
      getDataFromServer();
    }

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [checkIfOnline])

  const getDataFromServer = async () => {
    try {
      const querySnapshot = await getDoc(doc(db, "profile", "user"));
      setProfile(querySnapshot.data() as User)
    } catch {
      setProfile(getDataFromLocalStorage()!)
    }
  }

  const handleEditWorkExperience = (id: string) => {
    setSelectedExperience({ id, ...profile!.workExperiences[id] })
    setModalStatus({ isOpen: true, isEditing: true });
  }

  const handleSave = async (experienceId: string | null, data: any) => {
    if (profile) {
      if (experienceId === null) {
        profile.workExperiences[uuidv4()] = data;
      } else {
        profile.workExperiences[experienceId] = data;
      }
    }

    const online = await isOnline();

    if (profile) {
      if (online) {
        saveData(profile)
      } else {
        saveDataToLocalStorage(profile);
        localStorage.setItem("SyncRequired", "1");
        const id = setInterval(() => {
          checkIfOnline();
        }, 5000)

        intervalRef.current = id;
      }
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

  if (profile !== null) {

    const { workExperiences } = profile;
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

  return <div>Loading....</div>
}

export default ProfilePage;