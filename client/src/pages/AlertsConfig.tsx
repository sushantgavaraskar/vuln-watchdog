import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

export default function AlertsConfig() {
  const [config, setConfig] = useState<any>({
    emailNotifications: false,
    dailyDigest: false,
    securityAlerts: false,
    alertFrequency: 'daily',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getUserProfile();
        setConfig({
          emailNotifications: data.emailNotifications,
          dailyDigest: data.dailyDigest,
          securityAlerts: data.securityAlerts,
          alertFrequency: data.alertFrequency || 'daily',
        });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch alert config', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.setAlertConfig(config);
      toast({ title: 'Success', description: 'Alert config updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update alert config', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto py-8">
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="text-foreground">Alerts Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Switch
                    checked={config.emailNotifications}
                    onCheckedChange={v => setConfig((c: any) => ({ ...c, emailNotifications: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily Digest</span>
                  <Switch
                    checked={config.dailyDigest}
                    onCheckedChange={v => setConfig((c: any) => ({ ...c, dailyDigest: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Alerts</span>
                  <Switch
                    checked={config.securityAlerts}
                    onCheckedChange={v => setConfig((c: any) => ({ ...c, securityAlerts: v }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alert Frequency</label>
                  <Input
                    value={config.alertFrequency}
                    onChange={e => setConfig((c: any) => ({ ...c, alertFrequency: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}