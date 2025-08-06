import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp, Clock } from "lucide-react";

export default function Vulnerabilities() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
            <p className="text-muted-foreground">
              Monitor and manage security vulnerabilities across your projects
            </p>
          </div>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-high" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high">12</div>
              <p className="text-xs text-muted-foreground">
                Should be addressed soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medium">25</div>
              <p className="text-xs text-muted-foreground">
                Monitor and plan fixes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-low" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-low">8</div>
              <p className="text-xs text-muted-foreground">
                Low priority issues
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vulnerabilities</CardTitle>
            <CardDescription>
              Latest security issues detected across your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="font-medium">CVE-2024-1234: SQL Injection in Database Layer</h4>
                    <p className="text-sm text-muted-foreground">React Dashboard • 2 hours ago</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-high" />
                  <div>
                    <h4 className="font-medium">CVE-2024-5678: XSS in User Input</h4>
                    <p className="text-sm text-muted-foreground">API Gateway • 1 day ago</p>
                  </div>
                </div>
                <Badge className="bg-high text-high-foreground">High</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-medium" />
                  <div>
                    <h4 className="font-medium">CVE-2024-9012: Outdated SSL Certificate</h4>
                    <p className="text-sm text-muted-foreground">Mobile App • 3 days ago</p>
                  </div>
                </div>
                <Badge className="bg-medium text-medium-foreground">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
