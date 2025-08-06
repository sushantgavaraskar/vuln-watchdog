import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Clock,
  Download,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mock data - replace with real API calls
const vulnerabilityTrends = [
  { date: "2024-01-01", critical: 2, high: 5, medium: 12, low: 8 },
  { date: "2024-01-02", critical: 1, high: 7, medium: 10, low: 6 },
  { date: "2024-01-03", critical: 3, high: 4, medium: 15, low: 9 },
  { date: "2024-01-04", critical: 0, high: 6, medium: 11, low: 7 },
  { date: "2024-01-05", critical: 2, high: 3, medium: 8, low: 5 },
  { date: "2024-01-06", critical: 1, high: 8, medium: 13, low: 10 },
  { date: "2024-01-07", critical: 0, high: 5, medium: 9, low: 4 }
];

const severityDistribution = [
  { name: "Critical", value: 9, color: "hsl(var(--critical))" },
  { name: "High", value: 38, color: "hsl(var(--high))" },
  { name: "Medium", value: 78, color: "hsl(var(--medium))" },
  { name: "Low", value: 49, color: "hsl(var(--low))" }
];

const projectRiskData = [
  { name: "Project Alpha", risk: 85, vulnerabilities: 23 },
  { name: "Beta App", risk: 62, vulnerabilities: 15 },
  { name: "Gamma Service", risk: 91, vulnerabilities: 31 },
  { name: "Delta API", risk: 34, vulnerabilities: 8 },
  { name: "Epsilon Web", risk: 76, vulnerabilities: 19 }
];

const scanActivity = [
  { date: "Week 1", scans: 45, findings: 134 },
  { date: "Week 2", scans: 52, findings: 98 },
  { date: "Week 3", scans: 38, findings: 156 },
  { date: "Week 4", scans: 61, findings: 87 }
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Simulate export functionality
    const data = {
      vulnerabilityTrends,
      severityDistribution,
      projectRiskData,
      scanActivity,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnwatch-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive vulnerability and risk analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-security bg-card text-foreground"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Vulnerabilities"
            value="174"
            description="across all projects"
            icon={Shield}
            trend="down"
            trendValue="12%"
          />
          <StatsCard
            title="Critical Issues"
            value="9"
            description="requiring immediate action"
            icon={Activity}
            trend="down"
            trendValue="3"
          />
          <StatsCard
            title="Risk Score"
            value="73"
            description="out of 100"
            icon={Target}
            trend="up"
            trendValue="5 points"
          />
          <StatsCard
            title="Avg. Resolution Time"
            value="4.2d"
            description="for high severity issues"
            icon={Clock}
            trend="down"
            trendValue="0.8d"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vulnerability Trends */}
          <Card className="bg-gradient-card border-security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Vulnerability Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={vulnerabilityTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="critical" 
                    stackId="1" 
                    stroke="hsl(var(--critical))" 
                    fill="hsl(var(--critical))" 
                    name="Critical"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="high" 
                    stackId="1" 
                    stroke="hsl(var(--high))" 
                    fill="hsl(var(--high))" 
                    name="High"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="medium" 
                    stackId="1" 
                    stroke="hsl(var(--medium))" 
                    fill="hsl(var(--medium))" 
                    name="Medium"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="low" 
                    stackId="1" 
                    stroke="hsl(var(--low))" 
                    fill="hsl(var(--low))" 
                    name="Low"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card className="bg-gradient-card border-security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Severity Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Risk Analysis */}
          <Card className="bg-gradient-card border-security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Project Risk Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectRiskData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="risk" fill="hsl(var(--primary))" name="Risk Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scan Activity */}
          <Card className="bg-gradient-card border-security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Scan Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scanActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Scans Performed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="findings" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Vulnerabilities Found"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Vulnerabilities */}
          <Card className="lg:col-span-2 bg-gradient-card border-security">
            <CardHeader>
              <CardTitle>Top Vulnerabilities This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { cve: "CVE-2024-0001", severity: "CRITICAL", project: "Alpha", description: "Remote code execution vulnerability" },
                  { cve: "CVE-2024-0002", severity: "HIGH", project: "Beta", description: "SQL injection in user authentication" },
                  { cve: "CVE-2024-0003", severity: "HIGH", project: "Gamma", description: "Cross-site scripting vulnerability" },
                  { cve: "CVE-2024-0004", severity: "MEDIUM", project: "Delta", description: "Information disclosure" },
                  { cve: "CVE-2024-0005", severity: "MEDIUM", project: "Epsilon", description: "Privilege escalation" }
                ].map((vuln, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-security">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline"
                          className={`
                            ${vuln.severity === 'CRITICAL' ? 'bg-critical text-critical-foreground border-critical' : ''}
                            ${vuln.severity === 'HIGH' ? 'bg-high text-high-foreground border-high' : ''}
                            ${vuln.severity === 'MEDIUM' ? 'bg-medium text-medium-foreground border-medium' : ''}
                          `}
                        >
                          {vuln.severity}
                        </Badge>
                        <span className="font-mono text-sm">{vuln.cve}</span>
                        <span className="text-muted-foreground">in {vuln.project}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card border-security">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Run Security Scan
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View All Alerts
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}