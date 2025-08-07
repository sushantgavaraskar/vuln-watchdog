import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock, 
  Plus,
  Eye,
  Download,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useNotifications, useUnreadCount } from '@/hooks/use-api';
import { useNotificationsRealtime } from '@/hooks/use-notifications-realtime';
import { useAuth } from '@/hooks/use-auth';
import type { Project } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: notificationsResponse = { notifications: [] }, isLoading: notificationsLoading } = useNotifications({ limit: 5 });
  const notifications = notificationsResponse.notifications;
  const { data: unreadCount = 0 } = useUnreadCount();
  const { isConnected } = useNotificationsRealtime();

  // Calculate dashboard stats
  const totalProjects = projects.length;
  const totalVulnerabilities = projects.reduce((sum, project) => sum + (project.totalVulnerabilities || 0), 0);
  const criticalVulnerabilities = projects.reduce((sum, project) => {
    return sum + (project.dependencies?.reduce((depSum, dep) => 
      depSum + (dep.issues?.filter(issue => issue.severity === 'CRITICAL').length || 0), 0
    ) || 0);
  }, 0);
  
  const securityScore = totalProjects > 0 
    ? Math.max(0, 100 - (totalVulnerabilities * 5) - (criticalVulnerabilities * 20))
    : 100;

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getSecurityStatus = (project: Project) => {
    const criticalCount = project.dependencies?.reduce((total, dep) => 
      total + (dep.issues?.filter(issue => issue.severity === 'CRITICAL').length || 0), 0
    ) || 0;
    
    const highCount = project.dependencies?.reduce((total, dep) => 
      total + (dep.issues?.filter(issue => issue.severity === 'HIGH').length || 0), 0
    ) || 0;

    if (criticalCount > 0) return { status: 'Critical', color: 'destructive' as const };
    if (highCount > 0) return { status: 'High Risk', color: 'destructive' as const };
    if ((project.totalVulnerabilities || 0) > 0) return { status: 'Medium Risk', color: 'default' as const };
    return { status: 'Secure', color: 'secondary' as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'LOW':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your security projects
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button onClick={() => navigate('/scan')}>
              <Plus className="mr-2 h-4 w-4" />
              New Scan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Active security projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vulnerabilities</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalVulnerabilities}</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalVulnerabilities}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityScore}</div>
              <Progress value={securityScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Overall security health
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Projects */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Your latest security projects and their status
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="h-10 w-10 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first project to start monitoring dependencies
                    </p>
                    <Button onClick={() => navigate('/projects')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProjects.map((project) => {
                      const securityStatus = getSecurityStatus(project);
                      return (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {project.totalDependencies || 0} dependencies • {project.totalVulnerabilities || 0} vulnerabilities
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={securityStatus.color}>
                              {securityStatus.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/projects/${project.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to keep your projects secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={() => navigate('/scan')}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">New Vulnerability Scan</div>
                      <div className="text-sm text-muted-foreground">Upload dependency files for analysis</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={() => navigate('/projects')}
                  >
                    <Plus className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Create New Project</div>
                      <div className="text-sm text-muted-foreground">Set up a new security project</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">View Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={() => navigate('/alerts-config')}
                  >
                    <Download className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Export Reports</div>
                      <div className="text-sm text-muted-foreground">Generate security reports</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Notifications</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {getSeverityIcon(notification.type as any)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Alerts */}
            {criticalVulnerabilities > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{criticalVulnerabilities} critical vulnerabilities</strong> detected across your projects. 
                  <Button
                    variant="link"
                    className="p-0 h-auto text-destructive-foreground underline"
                    onClick={() => navigate('/vulnerabilities')}
                  >
                    Review now
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Connection</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Updates</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Scan</span>
                    <span className="text-sm text-muted-foreground">
                      {projects.length > 0 ? formatDate(projects[0].createdAt) : 'Never'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}