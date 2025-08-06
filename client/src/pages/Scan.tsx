import { useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/ui/severity-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Download,
  Eye,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supportedFiles = [
  { type: "package.json", ecosystem: "Node.js", icon: "📦" },
  { type: "requirements.txt", ecosystem: "Python", icon: "🐍" },
  { type: "pom.xml", ecosystem: "Java/Maven", icon: "☕" },
  { type: "Gemfile", ecosystem: "Ruby", icon: "💎" },
  { type: "composer.json", ecosystem: "PHP", icon: "🐘" },
  { type: "go.mod", ecosystem: "Go", icon: "🐹" }
];

const mockProjects = [
  { id: 1, name: "React Dashboard" },
  { id: 2, name: "API Gateway" },
  { id: 3, name: "Mobile App" },
  { id: 4, name: "Data Pipeline" }
];

interface ScanResult {
  id: string;
  fileName: string;
  status: "scanning" | "completed" | "error";
  progress: number;
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  dependencies?: number;
  scanTime?: string;
}

export default function Scan() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach((file) => {
      const scanResult: ScanResult = {
        id: Date.now() + Math.random().toString(),
        fileName: file.name,
        status: "scanning",
        progress: 0
      };

      setScanResults(prev => [scanResult, ...prev]);

      // Simulate scan progress
      const interval = setInterval(() => {
        setScanResults(prev => prev.map(result => {
          if (result.id === scanResult.id) {
            const newProgress = Math.min(result.progress + Math.random() * 20, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...result,
                status: "completed",
                progress: 100,
                vulnerabilities: {
                  critical: Math.floor(Math.random() * 3),
                  high: Math.floor(Math.random() * 8),
                  medium: Math.floor(Math.random() * 15),
                  low: Math.floor(Math.random() * 10),
                  total: Math.floor(Math.random() * 30)
                },
                dependencies: Math.floor(Math.random() * 200) + 50,
                scanTime: new Date().toLocaleString()
              };
            }
            
            return { ...result, progress: newProgress };
          }
          return result;
        }));
      }, 500);
    });

    toast({
      title: "Scan Started",
      description: `Started scanning ${files.length} file(s)`
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const getRiskLevel = (vulns?: ScanResult['vulnerabilities']) => {
    if (!vulns) return { level: "Unknown", color: "muted" };
    if (vulns.critical > 0) return { level: "Critical", color: "critical" };
    if (vulns.high > 5) return { level: "High", color: "high" };
    if (vulns.total > 10) return { level: "Medium", color: "medium" };
    if (vulns.total > 0) return { level: "Low", color: "low" };
    return { level: "Secure", color: "success" };
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vulnerability Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Upload dependency files to scan for security vulnerabilities
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Selection */}
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground">Select Project</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose which project to associate the scan results with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="bg-background border-security">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-card border-security">
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground">Upload Dependency Files</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Drag and drop your dependency files or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
                    dragActive 
                      ? "border-primary bg-primary/10" 
                      : "border-security hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Maximum file size: 5MB
                  </p>
                  
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    accept=".json,.txt,.xml,.lock"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={!selectedProject}
                  />
                  
                  <Button 
                    variant="outline" 
                    disabled={!selectedProject}
                    className="pointer-events-none"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  
                  {!selectedProject && (
                    <p className="text-sm text-destructive mt-2">
                      Please select a project first
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scan Results */}
            {scanResults.length > 0 && (
              <Card className="bg-gradient-card border-security">
                <CardHeader>
                  <CardTitle className="text-foreground">Scan Results</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Real-time scanning progress and vulnerability reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scanResults.map((result) => {
                    const risk = getRiskLevel(result.vulnerabilities);
                    
                    return (
                      <div key={result.id} className="border border-security rounded-lg p-4 bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{result.fileName}</span>
                            {result.status === "completed" && (
                              <SeverityBadge severity={risk.level as any} />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {result.status === "scanning" && (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            )}
                            {result.status === "completed" && (
                              <>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {result.status === "scanning" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Scanning...</span>
                              <span className="text-foreground">{Math.round(result.progress)}%</span>
                            </div>
                            <Progress value={result.progress} className="h-2" />
                          </div>
                        )}

                        {result.status === "completed" && result.vulnerabilities && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="text-center p-2 bg-critical/10 rounded border border-critical/20">
                                <div className="font-semibold text-critical">{result.vulnerabilities.critical}</div>
                                <div className="text-muted-foreground">Critical</div>
                              </div>
                              <div className="text-center p-2 bg-high/10 rounded border border-high/20">
                                <div className="font-semibold text-high">{result.vulnerabilities.high}</div>
                                <div className="text-muted-foreground">High</div>
                              </div>
                              <div className="text-center p-2 bg-medium/10 rounded border border-medium/20">
                                <div className="font-semibold text-medium">{result.vulnerabilities.medium}</div>
                                <div className="text-muted-foreground">Medium</div>
                              </div>
                              <div className="text-center p-2 bg-low/10 rounded border border-low/20">
                                <div className="font-semibold text-low">{result.vulnerabilities.low}</div>
                                <div className="text-muted-foreground">Low</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{result.dependencies} dependencies scanned</span>
                              <span>Completed at {result.scanTime}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supported Files */}
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground">Supported Files</CardTitle>
                <CardDescription className="text-muted-foreground">
                  File types we can scan for vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background/50 transition-smooth">
                    <span className="text-lg">{file.icon}</span>
                    <div>
                      <div className="font-medium text-foreground">{file.type}</div>
                      <div className="text-sm text-muted-foreground">{file.ecosystem}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rescan All Projects
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  View Scan History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}