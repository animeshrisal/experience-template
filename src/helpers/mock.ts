import { v4 as uuidv4 } from 'uuid';
import { User } from '../model/User';

export const mockData: User = {
    id: "1",
    name: "Abhinav Risal",
    dateOfBirth: '2022-11-11',
    profilePicture: "",
    workExperiences: {
      [uuidv4()]: {
        startDate: '2022-11-11',
        endDate: '2022-11-12',
        currentlyWorking: false,
        jobTitle: "Software Engineer",
        company: "Cloud Factory",
        companyLogo: "",
        jobDescription: "Software engineer",
      }
    }
  }
  