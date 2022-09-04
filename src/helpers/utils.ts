import { WorkExperience } from "../model/WorkExperience";

export function calculateAge(dateOfBirth: string) {
  const ageDifMs = Date.now() - new Date(dateOfBirth).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function sortWorkExperience(workExperiences: Record<string, WorkExperience>) {
  return Object.entries(workExperiences)
    .map((e: [string, WorkExperience]) => ({ id: e[0], ...e[1] }))
    .sort(function (a, b) {
      const firstTime = new Date(a.startDate)
      const secondTime = new Date(b.startDate)
      return secondTime.valueOf() - firstTime.valueOf()
    })
}

export function getToday() {
  const date = new Date();

  const currentDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
    + ('0' + date.getDate()).slice(-2)

  console.log(currentDate)
  return currentDate
}