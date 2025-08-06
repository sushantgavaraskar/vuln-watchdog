import { MainLayout } from "@/components/layout/main-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Folder, 
  AlertTriangle, 
  TrendingUp, 
  Plus,
  Upload,
  Clock,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

// Mock data
const stats = [
  {
    title: "Total Projects",
    value: 12,
    description: "from last month",
    icon: Folder,
    trend: "up" as const,
    trendValue: "2"
  },
  {
    title: "Vulnerabilities Found",
    value: 47,
    description: "across all projects",
    icon: Shield,
    trend: "down" as const,
    trendValue: "8"
  },
  {
    title: "Critical Issues",
    value: 3,
    description: "requiring immediate attention",
    icon: AlertTriangle,
    trend: "down" as const,
    trendValue: "2"
  },
  {
    title: "Security Score",
    value: "85%",
    description: "average across projects",
    icon: TrendingUp,
    trend: "up" as const,
    trendValue: "5%"
  }
];

const recentProjects = [
  {
    id: 1,
    name: "React Dashboard",
    description: "Main frontend application",
    createdAt: "2024-01-15T10:30:00Z",
    vulnerabilityCount: 8,
    criticalCount: 1,
    collaboratorCount: 4,
    lastScan: "2024-01-20T14:20:00Z"
  },
  {
    id: 2,
    name: "API Gateway",
    description: "Backend service layer",
    createdAt: "2024-01-10T09:15:00Z",
    vulnerabilityCount: 15,
    criticalCount: 2,
    collaboratorCount: 3,
    lastScan: "2024-01-19T11:45:00Z"
  },
  {
    id: 3,
    name: "Mobile App",
    description: "React Native mobile application",
    createdAt: "2024-01-08T16:45:00Z",
    vulnerabilityCount: 3,
    criticalCount: 0,
    collaboratorCount: 2,
    lastScan: "2024-01-18T09:30:00Z"
  }
];

const recentActivity = [
  {
    id: 1,
    type: "scan",
    message: "Vulnerability scan completed for React Dashboard",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-success"
  },
  {
    id: 2,
    type: "critical",
    message: "Critical vulnerability found in API Gateway",
    time: "4 hours ago", 
    icon: AlertTriangle,
    color: "text-critical"
  },
  {
    id: 3,
    type: "upload",
    message: "New dependency file uploaded to Mobile App",
    time: "1 day ago",
    icon: Upload,
    color: "text-primary"
  }
];

export default function Dashboard() {
  const handleViewProject = (id: number) => {
    console.log("View project:", id);
  };

  const handleScanProject = (id: number) => {
    console.log("Scan project:", id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-hero border border-security">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Welcome back, John
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Monitor vulnerabilities across your projects and keep your applications secure.
                </p>
                <div className="flex gap-3">
                  <Button size="lg" className="shadow-security">
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                  <Button variant="outline" size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Scan Files
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <Badge variant="outline" className="mb-2 bg-success/10 text-success border-success">
                    System Healthy
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Recent Projects
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your most recently updated projects
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={handleViewProject}
                      onScan={handleScanProject}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Latest updates across your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}