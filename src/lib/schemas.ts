import { z } from "zod";

// Job Requisition Schema with conditional logic for Work Arrangement
export const jobRequisitionSchema = z.object({
  // Work Arrangement - determines the flow
  workArrangement: z.enum(["offshore", "onsite"], {
    required_error: "Work arrangement is required",
  }),

  // Step 1: Basic Details
  jobType: z.enum(["permanent", "contract", "consultant"], {
    required_error: "Job type is required",
  }),
  jobTitle: z.string().min(1, "Job title is required"),
  requestedDate: z.string().min(1, "Requested date is required"),
  department: z.string().min(1, "Department is required"),
  requestedBy: z.string().min(1, "Requested by is required"),
  hiringManager: z.string().min(1, "Hiring manager is required"),
  numberOfPositions: z.number().min(1, "Number of positions must be at least 1"),
  
  // Conditional fields for offshore vs onsite
  expectedDateOfOnboarding: z.string().optional(), // Offshore only
  idealStartDate: z.string().optional(), // Onsite only
  
  billable: z.enum(["yes", "no"], {
    required_error: "Billable status is required",
  }),
  clientBillingRate: z.number().optional(),
  totalBudgetMin: z.number().min(0, "Total budget min must be positive"),
  totalBudgetMax: z.number().min(0, "Total budget max must be positive"),
  expectedSalaryMin: z.number().min(0, "Expected salary min must be positive").optional(), // Offshore only
  expectedSalaryMax: z.number().min(0, "Expected salary max must be positive").optional(), // Offshore only

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
  projectLocation: z.string().optional(),

  // Step 4: Location & Shift Details
  onsiteWorkMode: z.enum(["remote", "hybrid", "wfo"], {
    required_error: "Onsite work mode is required",
  }),
  onsiteLocation: z.string().optional(),
  onsiteDaysInOffice: z.number().min(0).max(7).optional(),
  workShift: z.string().min(1, "Work shift is required"),
  preferredTimezone: z.string().optional(),

  // Step 5: Job Descriptions & Expectations
  jobPurpose: z.string().min(1, "Job purpose is required"),
  primaryDuties: z.string().min(1, "Primary duties are required"),
  goodToHave: z.string().optional(),
  jobSpecifications: z.string().min(1, "Job specifications are required"),
  additionalNotes: z.string().optional(),

  // Step 6: Onsite Specific (only for onsite work arrangement)
  onsiteSpecificWorkMode: z.enum(["remote", "hybrid", "wfo"]).optional(),
  onsiteSpecificLocation: z.string().optional(),
  onsiteSpecificDaysInOffice: z.number().min(0).max(7).optional(),
  onsiteSpecificWorkShift: z.string().optional(),
  onsiteSpecificPreferredTimezone: z.string().optional(),
  additionalInstructions: z.string().optional(),

  // Draft management
  status: z.enum(["draft", "submitted"]).default("draft"),
  currentStep: z.number().default(1),
}).refine(
  (data) => data.totalBudgetMin <= data.totalBudgetMax,
  {
    message: "Total budget min must be less than or equal to max",
    path: ["totalBudgetMax"],
  }
).refine(
  (data) => {
    if (data.expectedSalaryMin && data.expectedSalaryMax) {
      return data.expectedSalaryMin <= data.expectedSalaryMax;
    }
    return true;
  },
  {
    message: "Expected salary min must be less than or equal to max",
    path: ["expectedSalaryMax"],
  }
).refine(
  (data) => {
    if (data.billable === "yes" && !data.clientBillingRate) {
      return false;
    }
    return true;
  },
  {
    message: "Client billing rate is required when billable",
    path: ["clientBillingRate"],
  }
).refine(
  (data) => {
    if (data.onsiteWorkMode !== "remote" && !data.onsiteLocation) {
      return false;
    }
    return true;
  },
  {
    message: "Onsite location is required when not remote",
    path: ["onsiteLocation"],
  }
).refine(
  (data) => {
    if (data.onsiteWorkMode === "hybrid" && !data.onsiteDaysInOffice) {
      return false;
    }
    return true;
  },
  {
    message: "Onsite days in office is required for hybrid mode",
    path: ["onsiteDaysInOffice"],
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