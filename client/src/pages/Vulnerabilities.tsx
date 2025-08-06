import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Shield, 
  ExternalLink,
  Clock,
  Package,
  Eye
} from "lucide-react";

interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  dependency: string;
  version: string;
  project: string;
  discoveredAt: string;
  fixedVersion?: string;
  cvssScore?: number;
}

const mockVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    cveId: "CVE-2024-1234",
    title: "Remote Code Execution in React",
    description: "A vulnerability in React allows remote code execution through malicious JSX input.",
    severity: "CRITICAL",
    dependency: "react",
    version: "17.0.1",
    project: "React Dashboard",
    discoveredAt: "2024-01-20T14:20:00Z",
    fixedVersion: "18.2.0",
    cvssScore: 9.8
  },
  {
    id: "2",
    cveId: "CVE-2024-5678",
    title: "SQL Injection in Express.js",
    description: "Express.js middleware vulnerable to SQL injection attacks via query parameters.",
    severity: "HIGH",
    dependency: "express",
    version: "4.16.4",
    project: "API Gateway",
    discoveredAt: "2024-01-19T11:45:00Z",
    fixedVersion: "4.18.2",
    cvssScore: 8.1
  },
  {
    id: "3",
    cveId: "CVE-2024-9012",
    title: "Cross-Site Scripting in Lodash",
    description: "Lodash template function vulnerable to XSS attacks through user input.",
    severity: "MEDIUM",
    dependency: "lodash",
    version: "4.17.15",
    project: "Mobile App",
    discoveredAt: "2024-01-18T09:30:00Z",
    fixedVersion: "4.17.21",
    cvssScore: 6.5
  },
  {
    id: "4",
    cveId: "CVE-2024-3456",
    title: "Prototype Pollution in Moment.js",
    description: "Moment.js library susceptible to prototype pollution attacks.",
    severity: "LOW",
    dependency: "moment",
    version: "2.24.0",
    project: "Data Pipeline",
    discoveredAt: "2024-01-17T16:10:00Z",
    fixedVersion: "2.29.4",
    cvssScore: 3.7
  },
  {
    id: "5",
    cveId: "CVE-2024-7890",
    title: "Buffer Overflow in Node.js",
    description: "Buffer overflow vulnerability in Node.js HTTP parser affecting server stability.",
    severity: "HIGH",
    dependency: "node",
    version: "14.18.1",
    project: "Microservice A",
    discoveredAt: "2024-01-16T10:30:00Z",
    fixedVersion: "18.19.0",
    cvssScore: 7.8
  },
  {
    id: "6",
    cveId: "CVE-2024-1111",
    title: "Authentication Bypass in JWT",
    description: "JWT library allows authentication bypass through algorithm confusion attacks.",
    severity: "CRITICAL",
    dependency: "jsonwebtoken",
    version: "8.5.1",
    project: "Legacy System",
    discoveredAt: "2024-01-15T08:20:00Z",
    fixedVersion: "9.0.0",
    cvssScore: 9.1
  }
];

export default function Vulnerabilities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  const filteredVulnerabilities = mockVulnerabilities.filter((vuln) => {
    const matchesSearch = 
      vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.dependency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter;
    const matchesProject = projectFilter === "all" || vuln.project === projectFilter;

    return matchesSearch && matchesSeverity && matchesProject;
  });

  const severityCounts = {
    critical: mockVulnerabilities.filter(v => v.severity === "CRITICAL").length,
    high: mockVulnerabilities.filter(v => v.severity === "HIGH").length,
    medium: mockVulnerabilities.filter(v => v.severity === "MEDIUM").length,
    low: mockVulnerabilities.filter(v => v.severity === "LOW").length
  };

  const projects = [...new Set(mockVulnerabilities.map(v => v.project))];

  const getCvssColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 9) return "text-critical";
    if (score >= 7) return "text-high";
    if (score >= 4) return "text-medium";
    return "text-low";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage security vulnerabilities across your projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">{severityCounts.critical}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Immediate attention required
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-high" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high">{severityCounts.high}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Fix within 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium
              </CardTitle>
              <Shield className="h-4 w-4 text-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medium">{severityCounts.medium}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Monitor and plan fixes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low
              </CardTitle>
              <Shield className="h-4 w-4 text-low" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-low">{severityCounts.low}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Address when possible
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-security">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vulnerabilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-security"
                />
              </div>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-security">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-security">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-security">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-security">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities Table */}
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="text-foreground">Security Vulnerabilities</CardTitle>
            <CardDescription className="text-muted-foreground">
              {filteredVulnerabilities.length} vulnerabilities found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-security">
              <Table>
                <TableHeader>
                  <TableRow className="border-security hover:bg-muted/50">
                    <TableHead className="text-foreground">CVE ID</TableHead>
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Severity</TableHead>
                    <TableHead className="text-foreground">Dependency</TableHead>
                    <TableHead className="text-foreground">Project</TableHead>
                    <TableHead className="text-foreground">CVSS</TableHead>
                    <TableHead className="text-foreground">Discovered</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id} className="border-security hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-security">
                        {vuln.cveId}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-foreground truncate">
                            {vuln.title}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {vuln.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={vuln.severity} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium text-foreground">{vuln.dependency}</div>
                            <div className="text-sm text-muted-foreground">v{vuln.version}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {vuln.project}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {vuln.cvssScore && (
                          <span className={`font-medium ${getCvssColor(vuln.cvssScore)}`}>
                            {vuln.cvssScore}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(vuln.discoveredAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedVuln(vuln)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gradient-card border-security max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-foreground flex items-center space-x-2">
                                <span>{selectedVuln?.cveId}</span>
                                <SeverityBadge severity={selectedVuln?.severity || "LOW"} />
                              </DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                {selectedVuln?.title}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedVuln && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                                  <p className="text-muted-foreground">{selectedVuln.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-1">Affected Package</h4>
                                    <p className="text-muted-foreground">{selectedVuln.dependency} v{selectedVuln.version}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-1">Fixed Version</h4>
                                    <p className="text-muted-foreground">
                                      {selectedVuln.fixedVersion || "Not available"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-1">CVSS Score</h4>
                                    <p className={`font-medium ${getCvssColor(selectedVuln.cvssScore)}`}>
                                      {selectedVuln.cvssScore || "Not scored"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-1">Project</h4>
                                    <p className="text-muted-foreground">{selectedVuln.project}</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 pt-4">
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View CVE Details
                                  </Button>
                                  {selectedVuln.fixedVersion && (
                                    <Button size="sm">
                                      Upgrade to v{selectedVuln.fixedVersion}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}