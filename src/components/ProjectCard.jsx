import { Calendar, Package, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";


export function ProjectCard({ project, onView, onScan }) {
  const totalVulns = Object.values(project.vulnerabilities).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
          <RiskBadge level={project.overallRisk} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>{project.dependencyCount} dependencies</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Last scan: {project.lastScan}</span>
          </div>
        </div>

        {totalVulns > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="font-medium">{totalVulns} vulnerabilities found</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.vulnerabilities.critical > 0 && (
                <RiskBadge level="critical" count={project.vulnerabilities.critical} />
              )}
              {project.vulnerabilities.high > 0 && (
                <RiskBadge level="high" count={project.vulnerabilities.high} />
              )}
              {project.vulnerabilities.medium > 0 && (
                <RiskBadge level="medium" count={project.vulnerabilities.medium} />
              )}
              {project.vulnerabilities.low > 0 && (
                <RiskBadge level="low" count={project.vulnerabilities.low} />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-secure">
            <Shield className="w-4 h-4" />
            <span className="font-medium">No vulnerabilities detected</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button onClick={() => onView(project.id)} variant="outline" className="flex-1">
          View Details
        </Button>
        <Button onClick={() => onScan(project.id)} size="sm">
          Rescan
        </Button>
      </CardFooter>
    </Card>
  );
}