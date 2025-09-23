import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  GraduationCap,
  Settings,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jobRequisitionSchema, JobRequisitionFormData } from "@/lib/schemas";
import { FormStepper } from "./multi-step/FormStepper";
import { MultiSelectSkills } from "./multi-step/MultiSelectSkills";

const FORM_STEPS = [
  {
    id: 1,
    title: "Basic Details",
    description: "Job type, title, department, and budget"
  },
  {
    id: 2,
    title: "Skills & Qualifications",
    description: "Required skills, experience, and education"
  },
  {
    id: 3,
    title: "Project & Client",
    description: "Project details and client information"
  },
  {
    id: 4,
    title: "Location & Shift",
    description: "Work mode, location, and schedule"
  },
  {
    id: 5,
    title: "Job Description",
    description: "Purpose, duties, and expectations"
  }
];

export const HireXForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<JobRequisitionFormData>({
    resolver: zodResolver(jobRequisitionSchema),
    defaultValues: {
      jobType: "",
      jobTitle: "",
      department: "",
      requestedDate: "",
      requestedBy: "",
      hiringManager: "",
      numberOfPositions: 1,
      billable: false,
      clientBillingRate: 0,
      totalBudgetMin: 0,
      totalBudgetMax: 0,
      expectedSalaryMin: 0,
      expectedSalaryMax: 0,
      primarySkills: [],
      secondarySkills: [],
      certifications: [],
      experienceYears: 0,
      education: "",
      projectName: "",
      clientName: "",
      businessUnit: "",
      workMode: "remote",
      onsiteLocation: "",
      onsiteDays: 0,
      shift: "",
      preferredTimezone: "",
      jobPurpose: "",
      duties: "",
      specifications: "",
      goodToHave: "",
      additionalNotes: "",
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = async () => {
    const fieldsByStep = {
      1: ['jobType', 'jobTitle', 'department', 'requestedDate', 'requestedBy', 'hiringManager', 'numberOfPositions', 'totalBudgetMin', 'totalBudgetMax', 'expectedSalaryMin', 'expectedSalaryMax'],
      2: ['primarySkills', 'experienceYears', 'education'],
      3: ['projectName', 'clientName', 'businessUnit'],
      4: ['workMode', 'shift', 'preferredTimezone'],
      5: ['jobPurpose', 'duties', 'specifications']
    };

    const fieldsToValidate = fieldsByStep[currentStep as keyof typeof fieldsByStep] || [];
    const isValid = await form.trigger(fieldsToValidate as any);
    return isValid;
  };

  const onSubmit = async (data: JobRequisitionFormData) => {
    console.log("Job Requisition Submitted:", data);
    
    toast({
      title: "Job Requisition Submitted",
      description: "Your job requisition has been successfully submitted for review.",
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-700">Submission Successful!</h2>
                <p className="text-green-600">
                  Your job requisition has been submitted and is now under review. 
                  You will receive an email confirmation shortly.
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">
                    <strong>Next Steps:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• HR team will review your requisition within 2-3 business days</li>
                    <li>• You'll receive email updates on the approval status</li>
                    <li>• Once approved, the position will be posted for recruitment</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    setCompletedSteps(new Set());
                    form.reset();
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Submit Another Requisition
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep form={form} />;
      case 2:
        return <SkillsQualificationsStep form={form} />;
      case 3:
        return <ProjectClientStep form={form} />;
      case 4:
        return <LocationShiftStep form={form} />;
      case 5:
        return <JobDescriptionStep form={form} />;
      default:
        return <BasicDetailsStep form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">HireX - Job Requisition Form</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a comprehensive job requisition with detailed requirements, skills, and business justification.
          </p>
        </div>

        {/* Stepper */}
        <FormStepper 
          steps={FORM_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < FORM_STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                >
                  Submit Requisition
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Step Components
const BasicDetailsStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Basic Details
        </CardTitle>
        <CardDescription>
          Provide fundamental information about the job requisition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requestedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="requestedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested By *</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hiringManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hiring Manager *</FormLabel>
                <FormControl>
                  <Input placeholder="Hiring manager name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="numberOfPositions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Positions *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Billable Position</FormLabel>
                  <FormDescription className="text-xs">
                    Is this a client-billable role?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientBillingRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Billing Rate</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="$/hour"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalBudgetMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Budget Min *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Minimum budget"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalBudgetMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Budget Max *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Maximum budget"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expectedSalaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary Min *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Minimum salary"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedSalaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary Max *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Maximum salary"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SkillsQualificationsStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Skills & Qualifications
        </CardTitle>
        <CardDescription>
          Define the technical and professional requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="primarySkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skills *</FormLabel>
              <FormControl>
                <MultiSelectSkills
                  selectedSkills={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Select primary skills..."
                />
              </FormControl>
              <FormDescription>
                Core skills that are essential for this role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondarySkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Skills</FormLabel>
              <FormControl>
                <MultiSelectSkills
                  selectedSkills={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Select secondary skills..."
                />
              </FormControl>
              <FormDescription>
                Additional skills that would be beneficial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="Required years of experience"
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="certification">Professional Certification</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormControl>
                <MultiSelectSkills
                  selectedSkills={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Select certifications..."
                  availableSkills={[
                    { id: "1", name: "AWS Certified", category: "Cloud" },
                    { id: "2", name: "PMP", category: "Project Management" },
                    { id: "3", name: "Scrum Master", category: "Agile" },
                    { id: "4", name: "CISSP", category: "Security" },
                    { id: "5", name: "Google Cloud Certified", category: "Cloud" },
                    { id: "6", name: "Microsoft Azure Certified", category: "Cloud" },
                  ]}
                />
              </FormControl>
              <FormDescription>
                Professional certifications relevant to the role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const ProjectClientStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Project & Client Information
        </CardTitle>
        <CardDescription>
          Details about the project and client assignment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name *</FormLabel>
              <FormControl>
                <Input placeholder="Name of the project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name *</FormLabel>
              <FormControl>
                <Input placeholder="Client or customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Unit *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="product-development">Product Development</SelectItem>
                  <SelectItem value="managed-services">Managed Services</SelectItem>
                  <SelectItem value="research-development">Research & Development</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const LocationShiftStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Shift Information
        </CardTitle>
        <CardDescription>
          Work location, schedule, and time zone preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="workMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Mode *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="onsiteLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On-site Location</FormLabel>
                <FormControl>
                  <Input placeholder="Office location if applicable" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="onsiteDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On-site Days per Week</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="7"
                    placeholder="Days per week in office"
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shift"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="day">Day Shift (9 AM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening Shift (2 PM - 10 PM)</SelectItem>
                    <SelectItem value="night">Night Shift (10 PM - 6 AM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="rotating">Rotating Shifts</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTimezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Timezone *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const JobDescriptionStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Description & Expectations
        </CardTitle>
        <CardDescription>
          Detailed job purpose, duties, and specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="jobPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Purpose *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the main purpose and objectives of this role..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Duties & Responsibilities *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List the main duties and responsibilities..."
                  rows={5}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Specifications *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Technical specifications and requirements..."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goodToHave"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Good to Have</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional qualifications that would be beneficial..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional information or special requirements..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};