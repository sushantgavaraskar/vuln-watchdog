import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ProjectDetailsModalProps {
  projectId: number;
  onClose: () => void;
}

export default function ProjectDetailsModal({ projectId, onClose }: ProjectDetailsModalProps) {
  const [project, setProject] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collabEmail, setCollabEmail] = useState('');
  const [addingCollab, setAddingCollab] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const projectData = await apiClient.getProject(projectId.toString());
        setProject(projectData);
        setCollaborators(projectData.collaborators || []);
        const history = await apiClient.getScanHistory(projectId.toString());
        setScanHistory(history.history || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch project details', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [projectId, toast]);

  const handleAddCollaborator = async () => {
    if (!collabEmail.trim()) return;
    setAddingCollab(true);
    try {
      await apiClient.addCollaborator(projectId.toString(), collabEmail);
      toast({ title: 'Success', description: 'Collaborator added' });
      setCollabEmail('');
      // Refresh collaborators
      const projectData = await apiClient.getProject(projectId.toString());
      setCollaborators(projectData.collaborators || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add collaborator', variant: 'destructive' });
    } finally {
      setAddingCollab(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await apiClient.exportProject(projectId.toString());
      // Assume backend returns a file URL or blob
      if (res && res.url) {
        window.open(res.url, '_blank');
      } else if (res && res.file) {
        // If backend returns a file blob
        const url = window.URL.createObjectURL(new Blob([res.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `project-${projectId}-export.json`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        toast({ title: 'Exported', description: 'Export completed (check downloads or new tab)' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export project', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card border-security">
        <DialogHeader>
          <DialogTitle className="text-foreground">Project Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View project info, collaborators, export, and scan history.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : project ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
              <p className="text-muted-foreground mb-2">{project.description}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Created: {new Date(project.createdAt).toLocaleString()}</span>
                {project.lastScan && <span>Last Scan: {new Date(project.lastScan).toLocaleString()}</span>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Collaborators</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {collaborators.length === 0 && <span className="text-muted-foreground">No collaborators</span>}
                {collaborators.map((c: any) => (
                  <Badge key={c.id || c.email}>{c.email}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add collaborator by email"
                  value={collabEmail}
                  onChange={e => setCollabEmail(e.target.value)}
                  disabled={addingCollab}
                />
                <Button onClick={handleAddCollaborator} disabled={addingCollab || !collabEmail.trim()}>
                  Add
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Export Project</h3>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? 'Exporting...' : 'Export Project'}
              </Button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Scan History</h3>
              {scanHistory.length === 0 ? (
                <div className="text-muted-foreground">No scan history</div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {scanHistory.map((scan: any) => (
                    <div key={scan.id} className="border border-security rounded p-2 flex flex-col gap-1 bg-background/50">
                      <div className="flex justify-between">
                        <span className="font-medium">{scan.fileName || scan.id}</span>
                        <span className="text-xs text-muted-foreground">{scan.status || 'completed'}</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span>Critical: {scan.critical || scan.vulnerabilities?.critical || 0}</span>
                        <span>High: {scan.high || scan.vulnerabilities?.high || 0}</span>
                        <span>Medium: {scan.medium || scan.vulnerabilities?.medium || 0}</span>
                        <span>Low: {scan.low || scan.vulnerabilities?.low || 0}</span>
                        <span>Total: {scan.total || scan.vulnerabilities?.total || 0}</span>
                        <span>Dependencies: {scan.dependencies || 0}</span>
                        <span>At: {scan.scanTime || scan.createdAt ? new Date(scan.createdAt).toLocaleString() : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">Project not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}