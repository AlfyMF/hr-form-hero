import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Users,
  Building,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JobRequisitionListItem } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";

// Mock API function - replace with actual API calls
const fetchJobRequisitions = async (): Promise<JobRequisitionListItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      status: "pending",
      requestedBy: "John Smith",
      requestedDate: "2024-01-15",
      numberOfPositions: 2,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-16T14:30:00Z"
    },
    {
      id: "2",
      jobTitle: "Product Manager",
      department: "Product",
      status: "approved",
      requestedBy: "Sarah Johnson",
      requestedDate: "2024-01-10",
      numberOfPositions: 1,
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-12T16:45:00Z"
    },
    {
      id: "3",
      jobTitle: "UX Designer",
      department: "Design",
      status: "draft",
      requestedBy: "Mike Davis",
      requestedDate: "2024-01-20",
      numberOfPositions: 1,
      createdAt: "2024-01-20T11:15:00Z",
      updatedAt: "2024-01-20T11:15:00Z"
    },
    {
      id: "4",
      jobTitle: "Data Analyst",
      department: "Analytics",
      status: "rejected",
      requestedBy: "Emily Brown",
      requestedDate: "2024-01-05",
      numberOfPositions: 1,
      createdAt: "2024-01-05T14:20:00Z",
      updatedAt: "2024-01-08T10:00:00Z"
    },
    {
      id: "5",
      jobTitle: "DevOps Engineer",
      department: "Engineering",
      status: "closed",
      requestedBy: "Alex Wilson",
      requestedDate: "2023-12-15",
      numberOfPositions: 1,
      createdAt: "2023-12-15T08:30:00Z",
      updatedAt: "2024-01-02T17:00:00Z"
    }
  ];
};

interface DashboardProps {
  onCreateNew: () => void;
}

export const Dashboard = ({ onCreateNew }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: requisitions = [], isLoading, error } = useQuery({
    queryKey: ['job-requisitions'],
    queryFn: fetchJobRequisitions,
  });

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || req.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "closed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Requisition Deleted",
      description: "Job requisition has been successfully deleted.",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Requisition",
      description: "Edit functionality would open here.",
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "View Requisition",
      description: "Detailed view would open here.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Requisitions Dashboard</h1>
            <p className="text-muted-foreground">Manage and track all job requisition requests</p>
          </div>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Requisition
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {requisitions.filter(r => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {requisitions.filter(r => r.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Building className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold">
                    {requisitions.filter(r => r.status === "draft").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Positions</p>
                  <p className="text-2xl font-bold">
                    {requisitions.reduce((sum, r) => sum + r.numberOfPositions, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title or requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requisitions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Requisitions ({filteredRequisitions.length})</CardTitle>
            <CardDescription>
              {filteredRequisitions.length === 0 ? "No requisitions found" : `Showing ${filteredRequisitions.length} requisitions`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequisitions.map((requisition) => (
                    <TableRow key={requisition.id}>
                      <TableCell className="font-medium">{requisition.jobTitle}</TableCell>
                      <TableCell>{requisition.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(requisition.status)}>
                          {requisition.status.charAt(0).toUpperCase() + requisition.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{requisition.requestedBy}</TableCell>
                      <TableCell>{requisition.numberOfPositions}</TableCell>
                      <TableCell>
                        {new Date(requisition.requestedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(requisition.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(requisition.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(requisition.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRequisitions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No job requisitions found matching your filters.</p>
                <Button onClick={onCreateNew} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Requisition
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};