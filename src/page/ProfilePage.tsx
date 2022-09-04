import { Avatar, Box, Button, Container, Flex, Heading, HStack, Portal, Spacer, Text, VStack } from "@chakra-ui/react";
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
import EditUserModal from "../component/EditUserModal";
import { createStandaloneToast } from '@chakra-ui/toast';

const { ToastContainer, toast } = createStandaloneToast()

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockData: User = {
  id: "1",
  name: "Abhinav Risal",
  dateOfBirth: '2022-11-11',
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
const defaultState: ModalStatus = {
  isOpen: false,
  isEditing: false,
}
function ProfilePage() {
  const intervalRef = useRef<undefined | ReturnType<typeof setInterval>>();
  const [profile, setProfile] = useState<User | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(defaultState);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience & SelectedWorkExperience | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

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
        toast({
          title: 'Network is online',
          description: 'Data has been syncced',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
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

  const save = useCallback(async () => {
    const online = await isOnline();

    if (profile) {
      if (online) {
        saveData(profile).then(() => {
          setIsSaving(false);
          setModalStatus(defaultState)
          setIsEditProfileOpen(false)
          toast({
            title: 'Saved',
            description: 'Data has been saved successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
      } else {
        saveDataToLocalStorage(profile);
        setIsSaving(false);
        setModalStatus(defaultState)
        setIsEditProfileOpen(false)
        toast({
          title: 'No network detectedd.',
          description: 'Saving data to local storage',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        localStorage.setItem("SyncRequired", "1");
        const id = setInterval(() => {
          checkIfOnline();
        }, 5000)

        intervalRef.current = id;
      }
    }
  }, [checkIfOnline, profile, saveData])

  useEffect(() => {
    if (isSaving) {
      save()
    }
  }, [isSaving, save])



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
      setProfile(prevState => {
        console.log(prevState)
        if (prevState) {
          if (experienceId === null) {
            prevState.workExperiences[uuidv4()] = data
          } else {
            prevState.workExperiences[experienceId] = data
          }
          return prevState
        } else {
          return null
        }
      })

      setIsSaving(true)
    }

  }

  const handleClose = () => {
    setModalStatus(defaultState);
    setSelectedExperience(null)
  }

  const handleProfileSave = async (data: any) => {
    setProfile({ ...profile, ...data })
    setIsSaving(true)
  }

  const handleProfileClose = () => {
    setIsEditProfileOpen(false)
  }

  const handleEditProfile = () => {
    setIsEditProfileOpen(true)
  }

  const handleNewExperience = () => {
    setModalStatus({
      isOpen: true,
      isEditing: false,
    })
  }

  const calculateAge = (dateOfBirth: string) => {
    const ageDifMs = Date.now() - new Date(dateOfBirth).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  if (profile !== null) {

    const { workExperiences, ...user } = profile;
    const age = calculateAge(user.dateOfBirth)
    const sorted = Object.entries(workExperiences)
      .map((e: [string, WorkExperience]) => ({ id: e[0], ...e[1] }))
      .sort(function (a, b) {
        const firstTime = new Date(a.startDate)
        const secondTime = new Date(b.startDate)
        return secondTime.valueOf()- firstTime.valueOf() 
      })

    return (
      <Container
        maxW={"50vw"}
        marginTop="8rem"
      >
        <HStack width="100%">
          <Box width="100%">
            <VStack align={"flex-start"}>
              <Flex alignItems={"center"} justifyContent={"space-between"} width="100%">
                <Heading>
                  Profile
                </Heading>
                <Button onClick={handleEditProfile}>Edit Profile</Button>
              </Flex>
              <VStack align={"flex-start"} width="100%">
                <HStack width={"100%"}>
                  <Avatar
                    src={user.profilePicture}
                    alignSelf={"center"}
                    height={"6rem"}
                    width={"6rem"}
                  />
                  <Box>
                    <Box>
                      <Text>Name: {user.name}</Text>
                    </Box>
                    <Box>
                      <Text>Age: {age}</Text>
                    </Box>
                  </Box>
                </HStack>
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
              {
                sorted.map((value) => <WorkExperienceContainer key={value.id} {...value} onEdit={handleEditWorkExperience} />
                )}
            </VStack>
          </Box>
        </HStack>
        <Portal>
          <ToastContainer />
          <EditUserModal
            user={user}
            isSaving={isSaving}
            isOpen={isEditProfileOpen}
            onSave={handleProfileSave}
            onClose={handleProfileClose}
          />
          <EditExperienceModal
            isSaving={isSaving}
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