import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ExternalLink,
  Clock,
  Info,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Calendar,
  Package,
  GitBranch
} from 'lucide-react';
import { useProjects } from '@/hooks/use-api';
import { useNotificationsRealtime } from '@/hooks/use-notifications-realtime';
import type { Project, Issue, Dependency, SeverityLevel } from '@/types';

export default function Vulnerabilities() {
  const { isConnected } = useNotificationsRealtime();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [expandedVulnerabilities, setExpandedVulnerabilities] = useState<Set<number>>(new Set());
  
  const { data: projects = [], isLoading } = useProjects();

  // Collect all vulnerabilities from all projects
  const allVulnerabilities: Array<{
    issue: Issue;
    dependency: Dependency;
    project: Project;
  }> = [];

  projects.forEach(project => {
    project.dependencies?.forEach(dependency => {
      dependency.issues?.forEach(issue => {
        allVulnerabilities.push({ issue, dependency, project });
      });
    });
  });

  // Filter vulnerabilities
  const filteredVulnerabilities = allVulnerabilities.filter(({ issue, project }) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.cveId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesProject = selectedProject === 'all' || project.id.toString() === selectedProject;
    
    return matchesSearch && matchesSeverity && matchesProject;
  });

  // Calculate statistics
  const totalVulnerabilities = allVulnerabilities.length;
  const criticalVulnerabilities = allVulnerabilities.filter(v => v.issue.severity === 'CRITICAL').length;
  const highVulnerabilities = allVulnerabilities.filter(v => v.issue.severity === 'HIGH').length;
  const mediumVulnerabilities = allVulnerabilities.filter(v => v.issue.severity === 'MEDIUM').length;
  const lowVulnerabilities = allVulnerabilities.filter(v => v.issue.severity === 'LOW').length;

  const toggleVulnerabilityExpansion = (issueId: number) => {
    const newExpanded = new Set(expandedVulnerabilities);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedVulnerabilities(newExpanded);
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSeverityIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'LOW':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRemediationAdvice = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'Update immediately to prevent potential security breaches.';
      case 'HIGH':
        return 'Update as soon as possible to mitigate security risks.';
      case 'MEDIUM':
        return 'Update when convenient, but prioritize over low severity issues.';
      case 'LOW':
        return 'Update during regular maintenance cycles.';
      default:
        return 'Review and update as needed.';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
            <p className="text-muted-foreground">
              Comprehensive vulnerability analysis and management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {criticalVulnerabilities > 0 && (
              <Badge variant="destructive">
                {criticalVulnerabilities} Critical
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{totalVulnerabilities}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <div>
                  <div className="text-2xl font-bold text-destructive">{criticalVulnerabilities}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <div className="text-2xl font-bold text-destructive">{highVulnerabilities}</div>
                  <div className="text-sm text-muted-foreground">High</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-500">{mediumVulnerabilities}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{lowVulnerabilities}</div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vulnerabilities, CVE IDs, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities List */}
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Details</CardTitle>
            <CardDescription>
              {filteredVulnerabilities.length} vulnerability{filteredVulnerabilities.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredVulnerabilities.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vulnerabilities found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedSeverity !== 'all' || selectedProject !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'Great! No vulnerabilities detected in your projects.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVulnerabilities.map(({ issue, dependency, project }) => {
                  const isExpanded = expandedVulnerabilities.has(issue.id);
                  return (
                    <div key={`${issue.id}-${dependency.id}-${project.id}`} className="border rounded-lg">
                      {/* Vulnerability Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleVulnerabilityExpansion(issue.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {getSeverityIcon(issue.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium truncate">{issue.title}</h3>
                                <Badge variant={getSeverityColor(issue.severity)}>
                                  {issue.severity}
                                </Badge>
                                {issue.cveId && (
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {issue.cveId}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Package className="h-3 w-3" />
                                  <span>{dependency.name}@{dependency.version}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="h-3 w-3" />
                                  <span>{project.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(issue.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-4">
                          <Separator />
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {issue.description || 'No description available.'}
                              </p>
                            </div>
                  
                            <div>
                              <h4 className="font-medium mb-2">Remediation</h4>
                              <p className="text-sm text-muted-foreground">
                                {getRemediationAdvice(issue.severity)}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <h4 className="font-medium mb-2">Affected Package</h4>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{dependency.name}</p>
                                <p className="text-sm text-muted-foreground">Version: {dependency.version}</p>
                              </div>
                            </div>
                  
                            <div>
                              <h4 className="font-medium mb-2">Project</h4>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{project.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {project.totalDependencies || 0} dependencies
                                </p>
                              </div>
                            </div>
                  
                            <div>
                              <h4 className="font-medium mb-2">Discovery Date</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(issue.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              CVE Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Resolved
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Recommendations */}
        {criticalVulnerabilities > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{criticalVulnerabilities} critical vulnerabilities</strong> require immediate attention. 
              Please update affected dependencies as soon as possible to prevent potential security breaches.
            </AlertDescription>
          </Alert>
        )}

        {/* Vulnerability Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Trends</CardTitle>
            <CardDescription>
              Security posture over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="text-2xl font-bold text-destructive">{criticalVulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
                <div className="text-xs text-muted-foreground mt-1">Immediate action required</div>
              </div>
              
              <div className="text-center p-4 bg-orange-100 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{highVulnerabilities}</div>
                <div className="text-sm text-muted-foreground">High</div>
                <div className="text-xs text-muted-foreground mt-1">Update soon</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{mediumVulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Medium</div>
                <div className="text-xs text-muted-foreground mt-1">Monitor closely</div>
              </div>
              
              <div className="text-center p-4 bg-green-100 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{lowVulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Low</div>
                <div className="text-xs text-muted-foreground mt-1">Low priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
