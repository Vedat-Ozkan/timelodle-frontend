export interface Person {
  name: string;
  dob: number; // Year of birth (e.g., 1925)
  dod: number; // Year of death (e.g., 2013)
  gender: "Male" | "Female" | "Other"; // Adjust as needed for your dataset
  popularity: number; // Popularity score
  occupation: string;
  country: string; // Country or countries as a string, could be comma-separated
}
