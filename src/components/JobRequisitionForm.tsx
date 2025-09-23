import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobRequisitionData {
  jobTitle: string;
  department: string;
  reportingManager: string;
  employmentType: string;
  location: string;
  salaryRange: string;
  startDate: string;
  positionsNeeded: string;
  jobDescription: string;
  requirements: string;
  preferredQualifications: string;
  businessJustification: string;
  requestorName: string;
  requestorEmail: string;
  requestorPhone: string;
}

const JobRequisitionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<JobRequisitionData>({
    defaultValues: {
      jobTitle: "",
      department: "",
      reportingManager: "",
      employmentType: "",
      location: "",
      salaryRange: "",
      startDate: "",
      positionsNeeded: "",
      jobDescription: "",
      requirements: "",
      preferredQualifications: "",
      businessJustification: "",
      requestorName: "",
      requestorEmail: "",
      requestorPhone: "",
    },
  });

  const onSubmit = (data: JobRequisitionData) => {
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
                  onClick={() => setIsSubmitted(false)}
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

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Job Requisition Form</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit a new job requisition for your department. Please provide detailed information 
            to help HR and leadership understand the position requirements and business need.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Information
                </CardTitle>
                <CardDescription>
                  Basic details about the position you're requesting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    rules={{ required: "Job title is required" }}
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
                  
                  <FormField
                    control={form.control}
                    name="department"
                    rules={{ required: "Department is required" }}
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
                            <SelectItem value="customer-success">Customer Success</SelectItem>
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
                    name="reportingManager"
                    rules={{ required: "Reporting manager is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporting Manager *</FormLabel>
                        <FormControl>
                          <Input placeholder="Manager's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employmentType"
                    rules={{ required: "Employment type is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    rules={{ required: "Location is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Location *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryRange"
                    rules={{ required: "Salary range is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Salary Range *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $80k - $120k" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="positionsNeeded"
                    rules={{ required: "Number of positions is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Positions Needed *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="startDate"
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Desired Start Date *
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Detailed description and requirements for the position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  rules={{ required: "Job description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the role, responsibilities, and day-to-day activities..."
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include key responsibilities, team collaboration, and growth opportunities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  rules={{ required: "Requirements are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Qualifications *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the essential qualifications, skills, and experience required for this position..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include education, years of experience, technical skills, and certifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredQualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Qualifications</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any preferred but not required qualifications..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Nice-to-have skills that would make a candidate stand out
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Business Justification */}
            <Card>
              <CardHeader>
                <CardTitle>Business Justification</CardTitle>
                <CardDescription>
                  Explain the business need for this position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="businessJustification"
                  rules={{ required: "Business justification is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Justification *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why this position is needed, how it supports business objectives, and the impact of not filling it..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include business impact, team capacity, growth plans, or replacement needs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Requestor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Requestor Information</CardTitle>
                <CardDescription>
                  Your contact information for follow-up questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestorName"
                    rules={{ required: "Your name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestorEmail"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requestorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional - for urgent follow-up questions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="px-8">
                Submit Job Requisition
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobRequisitionForm;