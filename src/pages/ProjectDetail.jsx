import { useState } from "react";
import { ArrowLeft, RefreshCcw, Settings, Download, Upload, AlertTriangle, Shield, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { DependencyTable } from "@/components/DependencyTable";
import { FileUploader } from "@/components/FileUploader";
import { RiskBadge } from "@/components/RiskBadge";

const mockUser = {
  name: "Sarah Johnson", 
  email: "sarah@company.com",
};

const mockProject = {
  id: "1",
  name: "E-commerce Frontend",
  description: "React-based storefront application with TypeScript",
  lastScan: "2 hours ago",
  createdAt: "2024-01-15",
  repository: "https://github.com/company/ecommerce-frontend",
};

const mockDependencies = [
  {
    id: "1",
    name: "react",
    currentVersion: "17.0.2",
    latestVersion: "18.2.0",
    isOutdated: true,
    riskLevel: "medium",
    vulnerabilities: [
      {
        id: "v1",
        title: "Cross-site Scripting (XSS) vulnerability",
        severity: "medium",
        cveId: "CVE-2023-1234",
        description: "A potential XSS vulnerability in React components",
        fixedIn: "18.0.0",
      },
    ],
  },
  {
    id: "2", 
    name: "lodash",
    currentVersion: "4.17.20",
    latestVersion: "4.17.21",
    isOutdated: true,
    riskLevel: "critical",
    vulnerabilities: [
      {
        id: "v2",
        title: "Prototype Pollution in lodash",
        severity: "critical",
        cveId: "CVE-2023-5678",
        description: "Prototype pollution vulnerability in lodash merge function",
        fixedIn: "4.17.21",
      },
      {
        id: "v3",
        title: "Command Injection vulnerability",
        severity: "high",
        cveId: "CVE-2023-9101",
        description: "Potential command injection in template function",
        fixedIn: "4.17.21",
      },
    ],
  },
  {
    id: "3",
    name: "typescript",
    currentVersion: "4.9.5",
    latestVersion: "5.3.2",
    isOutdated: true,
    riskLevel: "secure",
    vulnerabilities: [],
  },
];

export default function ProjectDetail() {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalDeps: mockDependencies.length,
    vulnerable: mockDependencies.filter(d => d.vulnerabilities.length > 0).length,
    outdated: mockDependencies.filter(d => d.isOutdated).length,
    critical: mockDependencies.filter(d => d.riskLevel === "critical").length,
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file.name);
    handleScan();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onLogout={() => console.log("Logout")} />
      
      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" className="p-0" onClick={() => window.location.href = '/dashboard'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Project Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{mockProject.name}</h1>
              <RiskBadge level={stats.critical > 0 ? "critical" : stats.vulnerable > 0 ? "medium" : "secure"} />
            </div>
            <p className="text-muted-foreground mb-4">{mockProject.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last scan: {mockProject.lastScan}
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {stats.totalDeps} dependencies
              </div>
              <Badge variant="outline">Created {mockProject.createdAt}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleScan} disabled={isScanning}>
              <RefreshCcw className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning..." : "Rescan"}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Dependencies</p>
                  <p className="text-2xl font-bold">{stats.totalDeps}</p>
                </div>
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vulnerable</p>
                  <p className="text-2xl font-bold text-destructive">{stats.vulnerable}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outdated</p>
                  <p className="text-2xl font-bold text-medium">{stats.outdated}</p>
                </div>
                <RefreshCcw className="w-8 h-8 text-medium" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-critical">{stats.critical}</p>
                </div>
                <Shield className="w-8 h-8 text-critical" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DependencyTable dependencies={mockDependencies} isLoading={isScanning} />
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-6">
            <DependencyTable dependencies={mockDependencies} isLoading={isScanning} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Dependency File
                </CardTitle>
                <p className="text-muted-foreground">
                  Upload your package.json, requirements.txt, or other dependency files to scan for vulnerabilities.
                </p>
              </CardHeader>
              <CardContent>
                <FileUploader onFileSelect={handleFileUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <p className="text-muted-foreground">
                  Configure how and when you want to be notified about vulnerabilities.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Alert Settings</h3>
                    <p className="text-muted-foreground">
                      Alert configuration features coming soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}