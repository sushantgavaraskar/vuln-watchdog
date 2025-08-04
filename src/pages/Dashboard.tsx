import { useState } from "react";
import { Plus, Search, Filter, BarChart3, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { Header } from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Frontend",
    description: "React-based storefront application",
    lastScan: "2 hours ago",
    dependencyCount: 245,
    vulnerabilities: { critical: 2, high: 5, medium: 8, low: 3 },
    overallRisk: "critical" as const,
  },
  {
    id: "2", 
    name: "Payment API",
    description: "Node.js microservice for payments",
    lastScan: "1 day ago",
    dependencyCount: 89,
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 2 },
    overallRisk: "medium" as const,
  },
  {
    id: "3",
    name: "Admin Dashboard",
    description: "Internal management interface", 
    lastScan: "3 days ago",
    dependencyCount: 156,
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
    overallRisk: "secure" as const,
  },
];

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah@company.com",
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || project.overallRisk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const stats = {
    totalProjects: mockProjects.length,
    criticalVulns: mockProjects.reduce((sum, p) => sum + p.vulnerabilities.critical, 0),
    totalVulns: mockProjects.reduce((sum, p) => 
      sum + Object.values(p.vulnerabilities).reduce((total, count) => total + count, 0), 0
    ),
    secureProjects: mockProjects.filter(p => p.overallRisk === "secure").length,
  };

  const handleViewProject = (id: string) => {
    window.location.href = `/project/${id}`;
  };

  const handleScanProject = (id: string) => {
    console.log("Scan project:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onLogout={() => console.log("Logout")} />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage vulnerabilities across all your projects
            </p>
          </div>
          <Button size="lg" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Vulnerabilities</CardTitle>
              <AlertTriangle className="w-4 h-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">{stats.criticalVulns}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vulnerabilities</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVulns}</div>
              <p className="text-xs text-muted-foreground">
                -12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secure Projects</CardTitle>
              <Shield className="w-4 h-4 text-secure" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secure">{stats.secureProjects}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.secureProjects / stats.totalProjects) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="secure">Secure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleViewProject}
              onScan={handleScanProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new project.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}