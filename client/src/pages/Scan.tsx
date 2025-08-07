import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { FileUpload } from '@/components/scanning/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useProjects, useUploadAndScan } from '@/hooks/use-api';
import { useNotificationsRealtime } from '@/hooks/use-notifications-realtime';
import type { ScanResult } from '@/types';

export default function Scan() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const uploadMutation = useUploadAndScan();
  const { isConnected } = useNotificationsRealtime();

  const handleUpload = async (file: File) => {
    if (!selectedProjectId) {
      throw new Error('Please select a project first');
    }

    const result = await uploadMutation.mutateAsync({ file, projectId: selectedProjectId });
    setScanResult(result);
    setShowResults(true);
  };

  const handleViewResults = () => {
    if (selectedProjectId) {
      navigate(`/scan/${selectedProjectId}`);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setShowResults(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vulnerability Scan</h1>
            <p className="text-muted-foreground">
              Upload dependency files to scan for security vulnerabilities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Select Project</span>
            </CardTitle>
            <CardDescription>
              Choose a project to associate with this scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedProjectId?.toString() || ''}
                onValueChange={(value) => setSelectedProjectId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {projects.length === 0 && !projectsLoading && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No projects found. Please create a project first.
                  </AlertDescription>
                </Alert>
              )}

              {projectsLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        {selectedProjectId && (
          <FileUpload onUpload={handleUpload} projectId={selectedProjectId} />
        )}

        {/* Scan Results */}
        {showResults && scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Scan Results</span>
              </CardTitle>
              <CardDescription>
                Vulnerability scan completed successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{scanResult.totalDependencies}</div>
                    <div className="text-sm text-muted-foreground">Dependencies</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {scanResult.totalVulnerabilities}
                    </div>
                    <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {scanResult.criticalVulnerabilities}
                    </div>
                    <div className="text-sm text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">
                      {scanResult.highVulnerabilities || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">High</div>
                  </div>
                </div>

                {/* Vulnerability Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vulnerability Details</h3>
                  {scanResult.results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{result.dependency.name}</h4>
                        <Badge variant="outline">{result.dependency.version}</Badge>
                      </div>
                      
                      {result.vulnerabilities.length > 0 ? (
                        <div className="space-y-2">
                          {result.vulnerabilities.map((vuln, vulnIndex) => (
                            <div key={vulnIndex} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{vuln.title}</div>
                                {vuln.cveId && (
                                  <div className="text-xs text-muted-foreground">{vuln.cveId}</div>
                                )}
                              </div>
                              <Badge variant={getSeverityColor(vuln.severity) as any}>
                                {vuln.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">No vulnerabilities found</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button onClick={handleViewResults} className="flex-1">
                    <Shield className="mr-2 h-4 w-4" />
                    View Detailed Results
                  </Button>
                  <Button onClick={handleNewScan} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    New Scan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!selectedProjectId && (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Follow these steps to scan your dependencies for vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Select a Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose an existing project or create a new one to organize your scans
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Upload Dependency File</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload your package.json, requirements.txt, or other dependency files
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Review Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Get detailed vulnerability reports and remediation suggestions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}