import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface Skill {
  id: string;
  name: string;
  category?: string;
}

interface MultiSelectSkillsProps {
  selectedSkills: string[];
  onSelectionChange: (skills: string[]) => void;
  placeholder?: string;
  label?: string;
  availableSkills?: Skill[];
}

const defaultSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend" },
  { id: "2", name: "TypeScript", category: "Programming" },
  { id: "3", name: "Node.js", category: "Backend" },
  { id: "4", name: "Python", category: "Programming" },
  { id: "5", name: "Java", category: "Programming" },
  { id: "6", name: "AWS", category: "Cloud" },
  { id: "7", name: "Docker", category: "DevOps" },
  { id: "8", name: "Kubernetes", category: "DevOps" },
  { id: "9", name: "MongoDB", category: "Database" },
  { id: "10", name: "PostgreSQL", category: "Database" },
  { id: "11", name: "GraphQL", category: "API" },
  { id: "12", name: "REST API", category: "API" },
  { id: "13", name: "Machine Learning", category: "AI/ML" },
  { id: "14", name: "Data Analysis", category: "Analytics" },
  { id: "15", name: "Project Management", category: "Management" },
];

export const MultiSelectSkills = ({
  selectedSkills,
  onSelectionChange,
  placeholder = "Select skills...",
  label = "Skills",
  availableSkills = defaultSkills,
}: MultiSelectSkillsProps) => {
  const [open, setOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const addSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      onSelectionChange([...selectedSkills, skillName]);
    }
    setOpen(false);
  };

  const removeSkill = (skillName: string) => {
    onSelectionChange(selectedSkills.filter(skill => skill !== skillName));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      onSelectionChange([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandEmpty>No skills found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {availableSkills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    onSelect={() => addSkill(skill.name)}
                    disabled={selectedSkills.includes(skill.name)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{skill.name}</span>
                      {skill.category && (
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          
          {/* Add custom skill */}
          <div className="border-t p-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={addCustomSkill}
                disabled={!customSkill.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};