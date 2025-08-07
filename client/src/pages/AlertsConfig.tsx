import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  Mail, 
  Shield, 
  Settings, 
  TestTube, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSetAlertConfig, useSendTestAlert, useCreateTestNotification } from '@/hooks/use-api';
import { useNotificationsRealtime } from '@/hooks/use-notifications-realtime';
import type { AlertConfigFormData } from '@/types';

export default function AlertsConfig() {
  const { user } = useAuth();
  const { isConnected } = useNotificationsRealtime();
  
  const setAlertConfigMutation = useSetAlertConfig();
  const sendTestAlertMutation = useSendTestAlert();
  const createTestNotificationMutation = useCreateTestNotification();

  const [alertConfig, setAlertConfig] = useState<AlertConfigFormData>({
    emailNotifications: user?.emailNotifications || false,
    dailyDigest: user?.dailyDigest || false,
    securityAlerts: user?.securityAlerts || false,
    alertFrequency: user?.alertFrequency || 'immediate'
  });

  const [testNotification, setTestNotification] = useState({
    message: 'This is a test notification from VulnWatchdog',
    type: 'system'
  });

  const [customEmail, setCustomEmail] = useState(user?.email || '');

  const handleAlertConfigUpdate = async () => {
    try {
      await setAlertConfigMutation.mutateAsync(alertConfig);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleSendTestAlert = async () => {
    try {
      await sendTestAlertMutation.mutateAsync();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCreateTestNotification = async () => {
    try {
      await createTestNotificationMutation.mutateAsync({
        message: testNotification.message,
        type: testNotification.type
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4 text-destructive" />;
      case 'scan':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'collaboration':
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getFrequencyDescription = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return 'Receive notifications as soon as they occur';
      case 'daily':
        return 'Get a daily summary of all notifications';
      case 'weekly':
        return 'Receive a weekly digest of notifications';
      default:
        return '';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alert Configuration</h1>
            <p className="text-muted-foreground">
              Configure how you receive security notifications and alerts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure email-based security alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Enable Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive security alerts and updates via email
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.emailNotifications}
                      onCheckedChange={(checked) => {
                        setAlertConfig(prev => ({ ...prev, emailNotifications: checked }));
                        handleAlertConfigUpdate();
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Daily Security Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Get a daily summary of all vulnerabilities and security events
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.dailyDigest}
                      onCheckedChange={(checked) => {
                        setAlertConfig(prev => ({ ...prev, dailyDigest: checked }));
                        handleAlertConfigUpdate();
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Critical Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Immediate notifications for critical vulnerabilities
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.securityAlerts}
                      onCheckedChange={(checked) => {
                        setAlertConfig(prev => ({ ...prev, securityAlerts: checked }));
                        handleAlertConfigUpdate();
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Notification Email</Label>
                    <Input
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter email address for notifications"
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to use your account email: {user?.email}
                    </p>
                  </div>

                  <div>
                    <Label>Alert Frequency</Label>
                    <Select
                      value={alertConfig.alertFrequency}
                      onValueChange={(value: 'immediate' | 'daily' | 'weekly') => {
                        setAlertConfig(prev => ({ ...prev, alertFrequency: value }));
                        handleAlertConfigUpdate();
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getFrequencyDescription(alertConfig.alertFrequency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Alert Rules</span>
                </CardTitle>
                <CardDescription>
                  Define custom rules for when to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Critical Vulnerabilities</Label>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Always notify</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>High Severity</Label>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Always notify</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Medium Severity</Label>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Daily digest only</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Low Severity</Label>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <span className="text-sm">Weekly digest only</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Custom Alert Conditions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <span className="text-sm">New project created</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Scan completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <span className="text-sm">Collaborator added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <span className="text-sm">System maintenance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Test Notifications</span>
                </CardTitle>
                <CardDescription>
                  Test your notification settings to ensure they work correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Test Email Alert</Label>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={handleSendTestAlert}
                      disabled={sendTestAlertMutation.isPending}
                    >
                      {sendTestAlertMutation.isPending ? 'Sending...' : 'Send Test Email'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send a test email to verify your email notifications are working
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label>Test In-App Notification</Label>
                      <div className="space-y-2">
                        <Select
                          value={testNotification.type}
                          onValueChange={(value) => setTestNotification(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="scan">Scan</SelectItem>
                            <SelectItem value="collaboration">Collaboration</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          value={testNotification.message}
                          onChange={(e) => setTestNotification(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Enter test notification message"
                          rows={2}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleCreateTestNotification}
                          disabled={createTestNotificationMutation.isPending}
                        >
                          {createTestNotificationMutation.isPending ? 'Creating...' : 'Create Test Notification'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Badge variant={alertConfig.emailNotifications ? "default" : "secondary"}>
                    {alertConfig.emailNotifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Digest</span>
                  <Badge variant={alertConfig.dailyDigest ? "default" : "secondary"}>
                    {alertConfig.dailyDigest ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Alerts</span>
                  <Badge variant={alertConfig.securityAlerts ? "default" : "secondary"}>
                    {alertConfig.securityAlerts ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert Frequency</span>
                  <Badge variant="outline">
                    {alertConfig.alertFrequency}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  {getNotificationTypeIcon('security')}
                  <div>
                    <div className="font-medium text-sm">Security</div>
                    <div className="text-xs text-muted-foreground">Vulnerability alerts</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  {getNotificationTypeIcon('scan')}
                  <div>
                    <div className="font-medium text-sm">Scan</div>
                    <div className="text-xs text-muted-foreground">Scan completion</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  {getNotificationTypeIcon('system')}
                  <div>
                    <div className="font-medium text-sm">System</div>
                    <div className="text-xs text-muted-foreground">System updates</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded-lg">
                  {getNotificationTypeIcon('collaboration')}
                  <div>
                    <div className="font-medium text-sm">Collaboration</div>
                    <div className="text-xs text-muted-foreground">Team updates</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TestTube className="mr-2 h-4 w-4" />
                  Test All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Critical vulnerabilities are always notified immediately regardless of frequency settings.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Daily digest includes all non-critical notifications from the past 24 hours.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    You can customize notification rules for different severity levels.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}