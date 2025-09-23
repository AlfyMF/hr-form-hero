import { z } from "zod";

// Job Requisition Schema matching the multi-step form structure
export const jobRequisitionSchema = z.object({
  // Step 1: Basic Details
  jobType: z.string().min(1, "Job type is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  requestedDate: z.string().min(1, "Requested date is required"),
  requestedBy: z.string().min(1, "Requested by is required"),
  hiringManager: z.string().min(1, "Hiring manager is required"),
  numberOfPositions: z.number().min(1, "Number of positions must be at least 1"),
  billable: z.boolean().optional(),
  clientBillingRate: z.number().optional(),
  totalBudgetMin: z.number().min(0, "Total budget min must be positive"),
  totalBudgetMax: z.number().min(0, "Total budget max must be positive"),
  expectedSalaryMin: z.number().min(0, "Expected salary min must be positive"),
  expectedSalaryMax: z.number().min(0, "Expected salary max must be positive"),

  // Step 2: Skills & Qualifications
  primarySkills: z.array(z.string()).min(1, "At least one primary skill is required"),
  secondarySkills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  experienceYears: z.number().min(0, "Experience years must be positive"),
  education: z.string().min(1, "Education level is required"),

  // Step 3: Project & Client Info
  projectName: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  businessUnit: z.string().min(1, "Business unit is required"),

  // Step 4: Location & Shift
  workMode: z.enum(["remote", "hybrid", "onsite"], {
    required_error: "Work mode is required",
  }),
  onsiteLocation: z.string().optional(),
  onsiteDays: z.number().min(0).max(7).optional(),
  shift: z.string().min(1, "Shift is required"),
  preferredTimezone: z.string().min(1, "Preferred timezone is required"),

  // Step 5: Job Descriptions & Expectations
  jobPurpose: z.string().min(1, "Job purpose is required"),
  duties: z.string().min(1, "Duties are required"),
  specifications: z.string().min(1, "Specifications are required"),
  goodToHave: z.string().optional(),
  additionalNotes: z.string().optional(),
}).refine(
  (data) => data.totalBudgetMin <= data.totalBudgetMax,
  {
    message: "Total budget min must be less than or equal to max",
    path: ["totalBudgetMax"],
  }
).refine(
  (data) => data.expectedSalaryMin <= data.expectedSalaryMax,
  {
    message: "Expected salary min must be less than or equal to max",
    path: ["expectedSalaryMax"],
  }
);

export type JobRequisitionFormData = z.infer<typeof jobRequisitionSchema>;

// Master data schemas
export const jobTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
});

export const shiftSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const timezoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  offset: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  role: z.string(),
});

export const jobRequisitionListItemSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  department: z.string(),
  status: z.enum(["draft", "pending", "approved", "rejected", "closed"]),
  requestedBy: z.string(),
  requestedDate: z.string(),
  numberOfPositions: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type JobRequisitionListItem = z.infer<typeof jobRequisitionListItemSchema>;