export interface WorkExperience extends Record<string, any> {
  startDate: string;
  endDate: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  jobDescription: string;
  currentlyWorking: boolean;
}

export interface SelectedWorkExperience {
  id: string;
}
