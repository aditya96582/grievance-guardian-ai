
import { Grievance, DepartmentType } from '../types';

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 12);

// Helper function to get a random date in the last 30 days
const getRandomDate = (daysBack = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Sample grievances for demonstration
export const sampleGrievances: Grievance[] = [
  {
    id: generateId(),
    title: "Water supply disruption in Gomti Nagar",
    description: "We have not received water supply in our area for the last 3 days. This is causing severe problems for all residents. Multiple complaints to the local office have gone unheeded.",
    category: "water_supply",
    sentiment: "negative",
    priority: "high",
    status: "open",
    submittedBy: "Rajesh Kumar",
    contactNumber: "9876543210",
    location: "Gomti Nagar, Lucknow",
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(2),
    aiSummary: "Urgent water supply issue affecting multiple residents with no response from local authorities.",
  },
  {
    id: generateId(),
    title: "Damaged road causing accidents",
    description: "The main road in Indira Nagar has large potholes that have caused multiple accidents in the past week. Two-wheeler riders are especially at risk. This needs immediate attention.",
    category: "roads",
    sentiment: "negative",
    priority: "critical",
    status: "processing",
    submittedBy: "Sunita Sharma",
    contactNumber: "8765432109",
    location: "Indira Nagar, Lucknow",
    createdAt: getRandomDate(10),
    updatedAt: getRandomDate(3),
    aiSummary: "Critical safety hazard: damaged road with potholes causing multiple accidents, requires urgent repair.",
    assignedTo: "Public Works Department, Lucknow Division",
  },
  {
    id: generateId(),
    title: "Power outages in Aliganj area",
    description: "We are facing frequent power cuts in Aliganj for the past week. The electricity goes out for 4-5 hours daily without any prior notice. This is particularly difficult as many people are working from home.",
    category: "electricity",
    sentiment: "negative",
    priority: "high",
    status: "open",
    submittedBy: "Amit Singh",
    contactNumber: "7654321098",
    location: "Aliganj, Lucknow",
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(5),
    aiSummary: "Frequent, lengthy power outages disrupting work-from-home activities with no prior notifications.",
  },
  {
    id: generateId(),
    title: "Appreciation for new healthcare center",
    description: "I would like to express my gratitude for the new healthcare center opened in Indiranagar. The facilities are excellent and the staff is very helpful. This has made access to healthcare much easier for residents.",
    category: "healthcare",
    sentiment: "positive",
    priority: "low",
    status: "closed",
    submittedBy: "Priya Verma",
    contactNumber: "6543210987",
    location: "Indiranagar, Lucknow",
    createdAt: getRandomDate(20),
    updatedAt: getRandomDate(18),
    aiSummary: "Positive feedback about new healthcare center, praising facilities and staff.",
    actionTaken: "Feedback forwarded to Health Department for acknowledgment."
  },
  {
    id: generateId(),
    title: "Irregular garbage collection",
    description: "The garbage collection in Vikas Nagar has been very irregular. Sometimes they don't come for days, leading to garbage piling up and causing health hazards. Please look into this matter.",
    category: "sanitation",
    sentiment: "negative",
    priority: "medium",
    status: "processing",
    submittedBy: "Mohammad Faiz",
    contactNumber: "5432109876",
    location: "Vikas Nagar, Lucknow",
    createdAt: getRandomDate(15),
    updatedAt: getRandomDate(10),
    aiSummary: "Irregular garbage collection causing waste accumulation and potential health hazards.",
    assignedTo: "Municipal Corporation, Sanitation Division"
  },
  {
    id: generateId(),
    title: "Stray dog menace in residential area",
    description: "There are packs of stray dogs in our residential area that have become aggressive. Children are afraid to play outside. We need animal control to address this safely.",
    category: "other",
    sentiment: "neutral",
    priority: "medium",
    status: "open",
    submittedBy: "Vikram Khanna",
    contactNumber: "4321098765",
    location: "Jankipuram, Lucknow",
    createdAt: getRandomDate(8),
    updatedAt: getRandomDate(8),
    aiSummary: "Stray dog issue causing safety concerns for children in residential area, requiring animal control intervention."
  }
];

// Department mapping
export const departmentOptions = [
  { value: 'water_supply', label: 'Water Supply Department' },
  { value: 'electricity', label: 'Electricity Department' },
  { value: 'sanitation', label: 'Sanitation Department' },
  { value: 'roads', label: 'Public Works Department' },
  { value: 'healthcare', label: 'Health Department' },
  { value: 'education', label: 'Education Department' },
  { value: 'law_enforcement', label: 'Police Department' },
  { value: 'housing', label: 'Housing & Urban Development' },
  { value: 'agriculture', label: 'Agriculture Department' },
  { value: 'other', label: 'Other Departments' }
];

// Get label for department
export const getDepartmentLabel = (value: DepartmentType): string => {
  const department = departmentOptions.find(dept => dept.value === value);
  return department ? department.label : 'Unknown Department';
};
