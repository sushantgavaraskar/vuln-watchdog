import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Slack, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Settings as SettingsIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const { toast } = useToast();
  const [alertConfig, setAlertConfig] = useState({
    emailEnabled: true,
    slackEnabled: false,
    smsEnabled: false,
    criticalOnly: false,
    frequency: "immediate",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    }
  });

  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      type: "email",
      destination: "john.doe@example.com",
      enabled: true,
      verified: true
    },
    {
      id: 2,
      type: "slack",
      destination: "#security-alerts",
      enabled: false,
      verified: false
    }
  ]);

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Critical vulnerability in lodash",
      project: "E-commerce API",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "high",
      title: "High severity issue in express",
      project: "Web Dashboard",
      timestamp: "1 day ago",
      read: true
    },
    {
      id: 3,
      type: "medium",
      title: "Medium risk dependency outdated",
      project: "Mobile Backend",
      timestamp: "3 days ago",
      read: true
    }
  ]);

  const handleTestAlert = () => {
    toast({
      title: "Test alert sent",
      description: "Check your configured channels for the test notification.",
    });
  };

  const handleSaveConfig = () => {
    toast({
      title: "Alert configuration saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleAddIntegration = () => {
    // TODO: Implement add integration logic
    toast({
      title: "Add integration",
      description: "Integration setup modal would open here.",
    });
  };

  const handleRemoveIntegration = (id) => {
    setIntegrations(integrations.filter(int => int.id !== id));
    toast({
      title: "Integration removed",
      description: "The integration has been removed successfully.",
    });
  };

  const getRiskBadgeVariant = (type) => {
    switch (type) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <Header 
        user={{
          name: "John Doe",
          email: "john.doe@example.com",
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure how and when you receive vulnerability notifications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Alert Configuration
                </CardTitle>
                <CardDescription>
                  Set up your notification preferences and delivery methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.emailEnabled}
                      onCheckedChange={(checked) => 
                        setAlertConfig({...alertConfig, emailEnabled: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Slack Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts to Slack channels
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.slackEnabled}
                      onCheckedChange={(checked) => 
                        setAlertConfig({...alertConfig, slackEnabled: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.smsEnabled}
                      onCheckedChange={(checked) => 
                        setAlertConfig({...alertConfig, smsEnabled: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only send critical vulnerability alerts
                      </p>
                    </div>
                    <Switch
                      checked={alertConfig.criticalOnly}
                      onCheckedChange={(checked) => 
                        setAlertConfig({...alertConfig, criticalOnly: checked})
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Alert Frequency</Label>
                    <Select 
                      value={alertConfig.frequency}
                      onValueChange={(value) => 
                        setAlertConfig({...alertConfig, frequency: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Quiet Hours</Label>
                      <Switch
                        checked={alertConfig.quietHours.enabled}
                        onCheckedChange={(checked) => 
                          setAlertConfig({
                            ...alertConfig, 
                            quietHours: {...alertConfig.quietHours, enabled: checked}
                          })
                        }
                      />
                    </div>
                    {alertConfig.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">From</Label>
                          <Input
                            type="time"
                            value={alertConfig.quietHours.start}
                            onChange={(e) => 
                              setAlertConfig({
                                ...alertConfig,
                                quietHours: {...alertConfig.quietHours, start: e.target.value}
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">To</Label>
                          <Input
                            type="time"
                            value={alertConfig.quietHours.end}
                            onChange={(e) => 
                              setAlertConfig({
                                ...alertConfig,
                                quietHours: {...alertConfig.quietHours, end: e.target.value}
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveConfig}>Save Configuration</Button>
                  <Button variant="outline" onClick={handleTestAlert}>
                    Send Test Alert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Channels
                    </CardTitle>
                    <CardDescription>
                      Manage your notification delivery channels
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddIntegration} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Channel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {integration.type === "email" && <Mail className="w-5 h-5 text-muted-foreground" />}
                        {integration.type === "slack" && <Slack className="w-5 h-5 text-muted-foreground" />}
                        {integration.type === "sms" && <Smartphone className="w-5 h-5 text-muted-foreground" />}
                        
                        <div>
                          <p className="font-medium">{integration.destination}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={integration.enabled ? "default" : "secondary"}>
                              {integration.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <Badge variant={integration.verified ? "default" : "destructive"}>
                              {integration.verified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={(checked) => {
                            setIntegrations(integrations.map(int => 
                              int.id === integration.id 
                                ? {...int, enabled: checked}
                                : int
                            ));
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIntegration(integration.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  Latest notifications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 border rounded-lg ${!alert.read ? 'bg-muted/50' : ''}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          alert.type === "critical" ? "text-destructive" : 
                          alert.type === "high" ? "text-orange-500" : 
                          "text-yellow-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.project}</p>
                        </div>
                        {!alert.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={getRiskBadgeVariant(alert.type)}>
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <Badge variant="destructive">12 alerts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <Badge variant="secondary">45 alerts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Time</span>
                  <Badge variant="outline">2.3 hrs avg</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}