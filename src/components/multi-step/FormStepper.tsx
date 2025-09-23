import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
}

export const FormStepper = ({ steps, currentStep, completedSteps }: FormStepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  {
                    "bg-primary border-primary text-primary-foreground": 
                      step.id === currentStep || completedSteps.has(step.id),
                    "border-muted-foreground text-muted-foreground": 
                      step.id !== currentStep && !completedSteps.has(step.id),
                  }
                )}
              >
                {completedSteps.has(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              
              {/* Step Info */}
              <div className="ml-3 hidden md:block">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    {
                      "text-primary": step.id === currentStep || completedSteps.has(step.id),
                      "text-muted-foreground": step.id !== currentStep && !completedSteps.has(step.id),
                    }
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "ml-4 mr-4 h-0.5 w-full min-w-[40px] transition-colors md:ml-8 md:mr-8",
                  {
                    "bg-primary": completedSteps.has(step.id),
                    "bg-muted": !completedSteps.has(step.id),
                  }
                )}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile Step Info */}
      <div className="mt-4 block md:hidden">
        <p className="text-sm font-medium text-primary">
          {steps.find(step => step.id === currentStep)?.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {steps.find(step => step.id === currentStep)?.description}
        </p>
      </div>
    </div>
  );
};