import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { 
  Folder, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  Users,
  MoreVertical 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    vulnerabilityCount: number;
    criticalCount: number;
    collaboratorCount: number;
    lastScan?: string;
  };
  onViewDetails: (id: number) => void;
  onScan: (id: number) => void;
}

export function ProjectCard({ project, onViewDetails, onScan }: ProjectCardProps) {
  const getRiskLevel = () => {
    if (project.criticalCount > 0) return { level: "Critical", color: "critical" };
    if (project.vulnerabilityCount > 10) return { level: "High", color: "high" };
    if (project.vulnerabilityCount > 5) return { level: "Medium", color: "medium" };
    if (project.vulnerabilityCount > 0) return { level: "Low", color: "low" };
    return { level: "Secure", color: "success" };
  };

  const risk = getRiskLevel();

  return (
    <Card className="bg-gradient-card border-security transition-smooth hover:shadow-glow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {project.name}
              </CardTitle>
              {project.description && (
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </CardDescription>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(project.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onScan(project.id)}>
                Scan Now
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Risk Level */}
        <div className="mb-4">
          <SeverityBadge 
            severity={risk.level as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"} 
            className="mb-2" 
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="h-4 w-4 text-primary mr-1" />
              <span className="text-lg font-semibold text-foreground">
                {project.vulnerabilityCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Vulnerabilities</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-critical mr-1" />
              <span className="text-lg font-semibold text-foreground">
                {project.criticalCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-primary mr-1" />
              <span className="text-lg font-semibold text-foreground">
                {project.collaboratorCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Team</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-security pt-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          {project.lastScan && (
            <div>
              Last scan: {new Date(project.lastScan).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(project.id)}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onScan(project.id)}
          >
            Scan Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}