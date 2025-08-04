import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Bell, Shield, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    emailNotifications: true,
    dailyDigest: false,
    securityAlerts: true,
    alertFrequency: "immediate",
    autoScan: true,
    scanFrequency: "weekly"
  });

  const handleSave = () => {
    // TODO: Implement save logic
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    // TODO: Implement data export
    toast({
      title: "Export initiated",
      description: "Your data export will be sent to your email shortly.",
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been submitted.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <Header 
        user={{
          name: settings.name,
          email: settings.email,
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Get a daily summary of your projects
                    </p>
                  </div>
                  <Switch
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, dailyDigest: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Critical vulnerability notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, securityAlerts: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Frequency</Label>
                  <Select 
                    value={settings.alertFrequency}
                    onValueChange={(value) => 
                      setSettings({...settings, alertFrequency: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Scanning
              </CardTitle>
              <CardDescription>
                Configure automatic scanning and security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Scan</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically scan projects for vulnerabilities
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoScan}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, autoScan: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Scan Frequency</Label>
                  <Select 
                    value={settings.scanFrequency}
                    onValueChange={(value) => 
                      setSettings({...settings, scanFrequency: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Current Plan</Label>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade to Pro for advanced scanning features and priority support
                  </p>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Export Data</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download a copy of your account data and scan results
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-base text-destructive">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}