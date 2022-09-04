import { WorkExperience } from "./WorkExperience"

export interface User {
    id: string,
    name: string,
    dateOfBirth: string,
    profilePicture: string,
    workExperiences: Record<string, WorkExperience>
};