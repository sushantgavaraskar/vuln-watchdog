import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FolderOpen, 
  Activity, 
  AlertTriangle,
  Eye,
  Trash2,
  UserX
} from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  projectCount: number;
}

interface AdminProject {
  id: number;
  name: string;
  description: string;
  owner: string;
  vulnerabilities: number;
  lastScan: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersData, projectsData] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getAdminProjects()
        ]);
        setUsers(usersData as AdminUser[]);
        setProjects(projectsData as AdminProject[]);
      } catch (error) {
        toast({
          title: "Failed to load admin data",
          description: "Please check your permissions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-card border-security">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalVulnerabilities = projects.reduce((sum, project) => sum + project.vulnerabilities, 0);
  const activeUsers = users.filter(user => new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={users.length.toString()}
          description="registered users"
          icon={Users}
          trend="up"
          trendValue={activeUsers.toString()}
        />
        <StatsCard
          title="Total Projects"
          value={projects.length.toString()}
          description="across all users"
          icon={FolderOpen}
        />
        <StatsCard
          title="Total Vulnerabilities"
          value={totalVulnerabilities.toString()}
          description="system-wide"
          icon={AlertTriangle}
          trend="down"
          trendValue="12%"
        />
        <StatsCard
          title="Active Scans"
          value="23"
          description="in progress"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Management */}
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Users Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-security">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.projectCount} projects • Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <span>Projects Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <div key={project.id} className="p-3 rounded-lg border border-security">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        {project.vulnerabilities > 0 && (
                          <Badge variant="destructive">
                            {project.vulnerabilities} vulnerabilities
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Owner: {project.owner}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last scan: {new Date(project.lastScan).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-gradient-card border-security">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Database Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm text-foreground">Healthy</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">API Response Time</p>
              <p className="text-lg font-bold text-foreground">145ms</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
              <p className="text-lg font-bold text-foreground">42</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}