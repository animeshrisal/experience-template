import { WorkExperience } from "./WorkExperience"

export interface User {
    id: string,
    name: string,
    age: number,
    profilePicture: string,
    workExperiences: Record<string, WorkExperience>
};