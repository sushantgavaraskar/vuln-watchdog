import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  Folder,
  TrendingUp,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const projects = [
  {
    id: 1,
    name: "React Dashboard",
    description: "Main frontend application with user interface components",
    createdAt: "2024-01-15T10:30:00Z",
    vulnerabilityCount: 8,
    criticalCount: 1,
    collaboratorCount: 4,
    lastScan: "2024-01-20T14:20:00Z"
  },
  {
    id: 2,
    name: "API Gateway",
    description: "Backend service layer handling authentication and routing",
    createdAt: "2024-01-10T09:15:00Z",
    vulnerabilityCount: 15,
    criticalCount: 2,
    collaboratorCount: 3,
    lastScan: "2024-01-19T11:45:00Z"
  },
  {
    id: 3,
    name: "Mobile App",
    description: "React Native mobile application for iOS and Android",
    createdAt: "2024-01-08T16:45:00Z",
    vulnerabilityCount: 3,
    criticalCount: 0,
    collaboratorCount: 2,
    lastScan: "2024-01-18T09:30:00Z"
  },
  {
    id: 4,
    name: "Data Processing Pipeline",
    description: "Python-based ETL pipeline for data analytics",
    createdAt: "2024-01-05T13:20:00Z",
    vulnerabilityCount: 12,
    criticalCount: 1,
    collaboratorCount: 5,
    lastScan: "2024-01-17T16:10:00Z"
  },
  {
    id: 5,
    name: "Microservice A",
    description: "User management microservice built with Node.js",
    createdAt: "2024-01-03T11:00:00Z",
    vulnerabilityCount: 6,
    criticalCount: 0,
    collaboratorCount: 2,
    lastScan: "2024-01-16T10:30:00Z"
  },
  {
    id: 6,
    name: "Legacy System",
    description: "Older Java application being gradually modernized",
    createdAt: "2023-12-20T14:45:00Z",
    vulnerabilityCount: 25,
    criticalCount: 4,
    collaboratorCount: 6,
    lastScan: "2024-01-15T08:20:00Z"
  }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  });
  const { toast } = useToast();

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }

    // API call would go here
    console.log("Creating project:", newProject);
    
    toast({
      title: "Success",
      description: "Project created successfully"
    });
    
    setIsCreateDialogOpen(false);
    setNewProject({ name: "", description: "" });
  };

  const handleViewProject = (id: number) => {
    console.log("View project:", id);
    toast({
      title: "Navigate",
      description: `Opening project ${id} details`
    });
  };

  const handleScanProject = (id: number) => {
    console.log("Scan project:", id);
    toast({
      title: "Scan Started",
      description: `Vulnerability scan initiated for project ${id}`
    });
  };

  // Calculate stats
  const totalVulnerabilities = projects.reduce((sum, p) => sum + p.vulnerabilityCount, 0);
  const totalCritical = projects.reduce((sum, p) => sum + p.criticalCount, 0);
  const averageVulns = Math.round(totalVulnerabilities / projects.length);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your application security projects
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-security mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-card border-security">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create New Project</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add a new project to start monitoring its dependencies for vulnerabilities.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Project Name</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                    className="bg-background border-security"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter project description (optional)"
                    className="bg-background border-security"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
              <Folder className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Vulnerabilities
              </CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalVulnerabilities}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-destructive">-8</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCritical}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-destructive">-2</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average per Project
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{averageVulns}</div>
              <p className="text-xs text-muted-foreground mt-1">
                vulnerabilities per project
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-security"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewProject}
              onScan={handleScanProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="bg-gradient-card border-security">
            <CardContent className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No projects match "${searchTerm}". Try a different search term.`
                  : "Get started by creating your first project."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}