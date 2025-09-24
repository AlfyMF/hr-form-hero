import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FileText,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jobRequisitionSchema, JobRequisitionFormData } from "@/lib/schemas";
import { FormStepper } from "./multi-step/FormStepper";
import { MultiSelectSkills } from "./multi-step/MultiSelectSkills";

export const HireXForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workArrangement, setWorkArrangement] = useState<"offshore" | "onsite" | "">("");
  const { toast } = useToast();

  const form = useForm<JobRequisitionFormData>({
    resolver: zodResolver(jobRequisitionSchema),
    defaultValues: {
      workArrangement: undefined,
      jobType: undefined,
      jobTitle: "",
      requestedDate: "",
      department: "",
      requestedBy: "",
      hiringManager: "",
      numberOfPositions: 1,
      expectedDateOfOnboarding: "",
      idealStartDate: "",
      billable: undefined,
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
      projectLocation: "",
      onsiteWorkMode: undefined,
      onsiteLocation: "",
      onsiteDaysInOffice: 0,
      workShift: "",
      preferredTimezone: "",
      jobPurpose: "",
      primaryDuties: "",
      goodToHave: "",
      jobSpecifications: "",
      additionalNotes: "",
      onsiteSpecificWorkMode: undefined,
      onsiteSpecificLocation: "",
      onsiteSpecificDaysInOffice: 0,
      onsiteSpecificWorkShift: "",
      onsiteSpecificPreferredTimezone: "",
      additionalInstructions: "",
      status: "draft",
      currentStep: 1,
    },
    mode: "onChange"
  });

  // Watch work arrangement to determine steps
  const watchWorkArrangement = form.watch("workArrangement");
  
  useEffect(() => {
    if (watchWorkArrangement) {
      setWorkArrangement(watchWorkArrangement);
    }
  }, [watchWorkArrangement]);

  // Dynamic steps based on work arrangement
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Work Arrangement", description: "Choose offshore or onsite" },
      { id: 2, title: "Basic Details", description: "Job type, title, department, and budget" },
      { id: 3, title: "Skills & Qualifications", description: "Required skills, experience, and education" },
      { id: 4, title: "Project & Client", description: "Project details and client information" },
      { id: 5, title: "Location & Shift", description: "Work mode, location, and schedule" },
      { id: 6, title: "Job Description", description: "Purpose, duties, and expectations" }
    ];

    if (workArrangement === "onsite") {
      return [
        ...baseSteps,
        { id: 7, title: "Onsite Specific", description: "Additional onsite requirements" }
      ];
    }

    return baseSteps;
  };

  const steps = getSteps();
  const maxSteps = steps.length;

  const nextStep = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveAndContinue = async () => {
    try {
      const currentData = form.getValues();
      currentData.currentStep = currentStep;
      
      // Save as draft (would be API call in real app)
      console.log("Saving draft:", currentData);
      
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved as a draft.",
      });

      if (currentStep < maxSteps) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: JobRequisitionFormData) => {
    try {
      // Validate entire form before submission
      const validationResult = jobRequisitionSchema.safeParse(data);
      
      if (!validationResult.success) {
        toast({
          title: "Validation Error",
          description: "Please complete all required fields before submitting.",
          variant: "destructive",
        });
        return;
      }

      data.status = "submitted";
      console.log("Job Requisition Submitted:", data);
      
      toast({
        title: "Job Requisition Submitted",
        description: "Your job requisition has been successfully submitted for review.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit requisition. Please try again.",
        variant: "destructive",
      });
    }
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
                    setWorkArrangement("");
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
        return <WorkArrangementStep form={form} />;
      case 2:
        return <BasicDetailsStep form={form} workArrangement={workArrangement} />;
      case 3:
        return <SkillsQualificationsStep form={form} />;
      case 4:
        return <ProjectClientStep form={form} />;
      case 5:
        return <LocationShiftStep form={form} />;
      case 6:
        return <JobDescriptionStep form={form} />;
      case 7:
        return workArrangement === "onsite" ? <OnsiteSpecificStep form={form} /> : null;
      default:
        return <WorkArrangementStep form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">HireX - Job Requisition Form</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a comprehensive job requisition with detailed requirements and conditional logic based on work arrangement.
          </p>
          {workArrangement && (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {workArrangement === "offshore" ? "Offshore Position" : "Onsite Position"}
            </Badge>
          )}
        </div>

        {/* Stepper */}
        <FormStepper 
          steps={steps}
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

              <div className="flex gap-3">
                {currentStep > 1 && currentStep < maxSteps && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveAndContinue}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save & Continue
                  </Button>
                )}

                {currentStep < maxSteps ? (
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Step Components
const WorkArrangementStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Work Arrangement
        </CardTitle>
        <CardDescription>
          Choose the work arrangement type to determine the required steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="workArrangement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Work Arrangement Type *</FormLabel>
              <FormDescription>
                This choice will determine the form steps and required information
              </FormDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    field.value === "offshore" ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => field.onChange("offshore")}
                >
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Offshore</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Remote positions with offshore teams
                    </p>
                    <Badge variant="outline">5 Steps Required</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    field.value === "onsite" ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => field.onChange("onsite")}
                >
                  <CardContent className="p-6 text-center">
                    <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Onsite</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Positions requiring physical presence
                    </p>
                    <Badge variant="outline">6 Steps Required</Badge>
                  </CardContent>
                </Card>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const BasicDetailsStep = ({ form, workArrangement }: { form: any; workArrangement: string }) => {
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
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="software-engineer">Software Engineer</SelectItem>
                    <SelectItem value="senior-software-engineer">Senior Software Engineer</SelectItem>
                    <SelectItem value="lead-software-engineer">Lead Software Engineer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="senior-product-manager">Senior Product Manager</SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                    <SelectItem value="senior-ux-designer">Senior UX Designer</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="senior-data-analyst">Senior Data Analyst</SelectItem>
                    <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                    <SelectItem value="senior-devops-engineer">Senior DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="requestedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested By *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select requester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="mike-davis">Mike Davis</SelectItem>
                    <SelectItem value="emily-brown">Emily Brown</SelectItem>
                    <SelectItem value="alex-wilson">Alex Wilson</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hiring manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                    <SelectItem value="david-martinez">David Martinez</SelectItem>
                    <SelectItem value="jennifer-taylor">Jennifer Taylor</SelectItem>
                    <SelectItem value="robert-garcia">Robert Garcia</SelectItem>
                    <SelectItem value="michelle-lee">Michelle Lee</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        {/* Conditional Date Fields */}
        {workArrangement === "offshore" && (
          <FormField
            control={form.control}
            name="expectedDateOfOnboarding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Date of Onboarding</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {workArrangement === "onsite" && (
          <FormField
            control={form.control}
            name="idealStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ideal Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="billable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billable *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Is this position billable?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("billable") === "yes" && (
          <FormField
            control={form.control}
            name="clientBillingRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Billing Rate *</FormLabel>
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
        )}

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

        {/* Expected Salary Range - Offshore Only */}
        {workArrangement === "offshore" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expectedSalaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Salary Min</FormLabel>
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
                  <FormLabel>Expected Salary Max</FormLabel>
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
        )}
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
          Define the required skills, experience, and educational qualifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="primarySkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skills *</FormLabel>
              <FormDescription>
                Select the essential skills required for this position
              </FormDescription>
              <MultiSelectSkills
                selectedSkills={field.value}
                onSelectionChange={field.onChange}
                placeholder="Select primary skills..."
                label="Primary Skills"
              />
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
              <FormDescription>
                Select additional skills that would be beneficial
              </FormDescription>
              <MultiSelectSkills
                selectedSkills={field.value || []}
                onSelectionChange={field.onChange}
                placeholder="Select secondary skills..."
                label="Secondary Skills"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormDescription>
                Select relevant certifications for this role
              </FormDescription>
              <MultiSelectSkills
                selectedSkills={field.value || []}
                onSelectionChange={field.onChange}
                placeholder="Select certifications..."
                label="Certifications"
                availableSkills={[
                  { id: "1", name: "AWS Certified Solutions Architect", category: "Cloud" },
                  { id: "2", name: "Azure Fundamentals", category: "Cloud" },
                  { id: "3", name: "Google Cloud Professional", category: "Cloud" },
                  { id: "4", name: "Certified Kubernetes Administrator", category: "DevOps" },
                  { id: "5", name: "PMP", category: "Project Management" },
                  { id: "6", name: "Scrum Master", category: "Agile" },
                  { id: "7", name: "CISSP", category: "Security" },
                  { id: "8", name: "CompTIA Security+", category: "Security" },
                ]}
              />
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
                <FormLabel>Experience (Years) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="Years of experience"
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
                <FormLabel>Education *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Bachelor's in Computer Science"
                    {...field}
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

const ProjectClientStep = ({ form }: { form: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Project & Client Information
        </CardTitle>
        <CardDescription>
          Provide details about the project and client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., E-commerce Platform Redesign" {...field} />
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
                  <Input placeholder="e.g., Tech Corp Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="digital-solutions">Digital Solutions</SelectItem>
                    <SelectItem value="enterprise-systems">Enterprise Systems</SelectItem>
                    <SelectItem value="cloud-services">Cloud Services</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="data-analytics">Data Analytics</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., New York, NY" {...field} />
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

const LocationShiftStep = ({ form }: { form: any }) => {
  const watchOnsiteWorkMode = form.watch("onsiteWorkMode");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Shift Details
        </CardTitle>
        <CardDescription>
          Specify work location and schedule requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="onsiteWorkMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onsite Work Mode *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="wfo">Work From Office</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchOnsiteWorkMode && watchOnsiteWorkMode !== "remote" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="onsiteLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onsite Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Office, 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchOnsiteWorkMode === "hybrid" && (
              <FormField
                control={form.control}
                name="onsiteDaysInOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onsite Days in Office *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="7" 
                        placeholder="Days per week"
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workShift"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Shift *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work shift" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="day-shift">Day Shift (9 AM - 5 PM)</SelectItem>
                    <SelectItem value="evening-shift">Evening Shift (1 PM - 9 PM)</SelectItem>
                    <SelectItem value="night-shift">Night Shift (9 PM - 5 AM)</SelectItem>
                    <SelectItem value="flexible">Flexible Hours</SelectItem>
                    <SelectItem value="rotational">Rotational Shifts</SelectItem>
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
                <FormLabel>Preferred Timezone</FormLabel>
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
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
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
          Job Descriptions & Expectations
        </CardTitle>
        <CardDescription>
          Define the role purpose, duties, and specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="jobPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Purpose *</FormLabel>
              <FormDescription>
                Describe the overall purpose and objectives of this role
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Lead the development of scalable web applications..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryDuties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Duties *</FormLabel>
              <FormDescription>
                List the main responsibilities and day-to-day tasks
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g., • Design and implement new features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobSpecifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Specifications *</FormLabel>
              <FormDescription>
                Detail the technical requirements and qualifications
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g., • 5+ years of React development experience&#10;• Strong knowledge of TypeScript&#10;• Experience with AWS services..."
                  className="min-h-[120px]"
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
              <FormDescription>
                Additional skills or experience that would be beneficial
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g., • Experience with Docker and Kubernetes&#10;• Knowledge of GraphQL&#10;• Previous startup experience..."
                  className="min-h-[100px]"
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
              <FormDescription>
                Any other relevant information or special requirements
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional information about the role..."
                  className="min-h-[80px]"
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

const OnsiteSpecificStep = ({ form }: { form: any }) => {
  const watchOnsiteSpecificWorkMode = form.watch("onsiteSpecificWorkMode");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Onsite Specific Requirements
        </CardTitle>
        <CardDescription>
          Additional requirements specific to onsite positions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="onsiteSpecificWorkMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onsite Specific Work Mode *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="wfo">Work From Office</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchOnsiteSpecificWorkMode && watchOnsiteSpecificWorkMode !== "remote" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="onsiteSpecificLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onsite Specific Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Specific office location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchOnsiteSpecificWorkMode === "hybrid" && (
              <FormField
                control={form.control}
                name="onsiteSpecificDaysInOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onsite Specific Days in Office</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="7" 
                        placeholder="Days per week"
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="onsiteSpecificWorkShift"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onsite Specific Work Shift</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work shift" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="day-shift">Day Shift (9 AM - 5 PM)</SelectItem>
                    <SelectItem value="evening-shift">Evening Shift (1 PM - 9 PM)</SelectItem>
                    <SelectItem value="night-shift">Night Shift (9 PM - 5 AM)</SelectItem>
                    <SelectItem value="flexible">Flexible Hours</SelectItem>
                    <SelectItem value="rotational">Rotational Shifts</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="onsiteSpecificPreferredTimezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onsite Specific Preferred Timezone</FormLabel>
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
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Instructions</FormLabel>
              <FormDescription>
                Any specific instructions or requirements for onsite work
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Security clearance required, specific equipment needs..."
                  className="min-h-[100px]"
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