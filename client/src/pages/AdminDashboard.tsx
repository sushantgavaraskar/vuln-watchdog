import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [usersData, projectsData, logsData] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getAdminProjects(),
          apiClient.getAuditLogs()
        ]);
        setUsers(usersData);
        setProjects(projectsData);
        setLogs(logsData);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch admin data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [toast]);

  // TODO: Add role check (e.g., from user profile or JWT)
  // If not admin, show unauthorized message

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="text-foreground">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-2">Users</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1">ID</th>
                          <th className="px-2 py-1">Name</th>
                          <th className="px-2 py-1">Email</th>
                          <th className="px-2 py-1">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u: any) => (
                          <tr key={u.id} className="border-b border-security">
                            <td className="px-2 py-1">{u.id}</td>
                            <td className="px-2 py-1">{u.name}</td>
                            <td className="px-2 py-1">{u.email}</td>
                            <td className="px-2 py-1">{u.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Projects</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1">ID</th>
                          <th className="px-2 py-1">Name</th>
                          <th className="px-2 py-1">Description</th>
                          <th className="px-2 py-1">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p: any) => (
                          <tr key={p.id} className="border-b border-security">
                            <td className="px-2 py-1">{p.id}</td>
                            <td className="px-2 py-1">{p.name}</td>
                            <td className="px-2 py-1">{p.description}</td>
                            <td className="px-2 py-1">{new Date(p.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Audit Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1">ID</th>
                          <th className="px-2 py-1">Action</th>
                          <th className="px-2 py-1">User</th>
                          <th className="px-2 py-1">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log: any) => (
                          <tr key={log.id} className="border-b border-security">
                            <td className="px-2 py-1">{log.id}</td>
                            <td className="px-2 py-1">{log.action}</td>
                            <td className="px-2 py-1">{log.userId}</td>
                            <td className="px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}