import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Mail,
  Smartphone,
  Clock,
  MoreVertical,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "security" | "scan" | "system" | "collaboration";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    projectId?: number;
    severity?: string;
    cveId?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "security",
    title: "Critical Vulnerability Detected",
    message: "CVE-2024-1234 found in React Dashboard project affecting react package v17.0.1",
    read: false,
    createdAt: "2024-01-20T14:20:00Z",
    metadata: { projectId: 1, severity: "CRITICAL", cveId: "CVE-2024-1234" }
  },
  {
    id: "2",
    type: "scan",
    title: "Scan Completed",
    message: "Vulnerability scan completed for API Gateway project. 15 vulnerabilities found.",
    read: false,
    createdAt: "2024-01-19T11:45:00Z",
    metadata: { projectId: 2 }
  },
  {
    id: "3",
    type: "collaboration",
    title: "New Team Member Added",
    message: "Sarah Johnson has been added to the React Dashboard project",
    read: true,
    createdAt: "2024-01-18T09:30:00Z",
    metadata: { projectId: 1 }
  },
  {
    id: "4",
    type: "security",
    title: "High Severity Vulnerability",
    message: "CVE-2024-5678 detected in express package affecting API Gateway",
    read: true,
    createdAt: "2024-01-17T16:10:00Z",
    metadata: { projectId: 2, severity: "HIGH", cveId: "CVE-2024-5678" }
  },
  {
    id: "5",
    type: "system",
    title: "Scheduled Maintenance",
    message: "System maintenance completed successfully. All services are operational.",
    read: true,
    createdAt: "2024-01-16T10:30:00Z"
  }
];

const notificationSettings = {
  emailNotifications: true,
  dailyDigest: false,
  securityAlerts: true,
  scanUpdates: true,
  teamUpdates: false,
  alertFrequency: "immediate"
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [settings, setSettings] = useState(notificationSettings);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Success",
      description: "All notifications marked as read"
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Success",
      description: "Notification deleted"
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4 text-destructive" />;
      case "scan":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "collaboration":
        return <Users className="h-4 w-4 text-primary" />;
      case "system":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const colors = {
      CRITICAL: "bg-critical text-critical-foreground",
      HIGH: "bg-high text-high-foreground",
      MEDIUM: "bg-medium text-medium-foreground",
      LOW: "bg-low text-low-foreground"
    };

    return (
      <Badge className={colors[severity as keyof typeof colors] || "bg-muted"}>
        {severity}
      </Badge>
    );
  };

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: "Notification preferences saved"
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on security alerts and project activities
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {unreadCount} unread
            </Badge>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card className="bg-gradient-card border-security">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                  >
                    Unread ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === "security" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("security")}
                  >
                    Security
                  </Button>
                  <Button
                    variant={filter === "scan" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("scan")}
                  >
                    Scans
                  </Button>
                  <Button
                    variant={filter === "collaboration" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("collaboration")}
                  >
                    Team
                  </Button>
                  <Button
                    variant={filter === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("system")}
                  >
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`bg-gradient-card border-security transition-smooth hover:shadow-glow ${
                    !notification.read ? "ring-1 ring-primary/30" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-sm font-medium ${
                                !notification.read ? "text-foreground" : "text-muted-foreground"
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                              {notification.metadata?.severity && 
                                getSeverityBadge(notification.metadata.severity)
                              }
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gradient-card border-security">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredNotifications.length === 0 && (
                <Card className="bg-gradient-card border-security">
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No notifications
                    </h3>
                    <p className="text-muted-foreground">
                      {filter === "all" 
                        ? "You're all caught up!"
                        : `No ${filter} notifications found.`
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <Label htmlFor="email" className="text-sm text-foreground">
                      Email Notifications
                    </Label>
                  </div>
                  <Switch
                    id="email"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    <Label htmlFor="security" className="text-sm text-foreground">
                      Security Alerts
                    </Label>
                  </div>
                  <Switch
                    id="security"
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => updateSetting("securityAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <Label htmlFor="scans" className="text-sm text-foreground">
                      Scan Updates
                    </Label>
                  </div>
                  <Switch
                    id="scans"
                    checked={settings.scanUpdates}
                    onCheckedChange={(checked) => updateSetting("scanUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <Label htmlFor="team" className="text-sm text-foreground">
                      Team Updates
                    </Label>
                  </div>
                  <Switch
                    id="team"
                    checked={settings.teamUpdates}
                    onCheckedChange={(checked) => updateSetting("teamUpdates", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Alert Frequency</Label>
                  <Select 
                    value={settings.alertFrequency} 
                    onValueChange={(value) => updateSetting("alertFrequency", value)}
                  >
                    <SelectTrigger className="bg-background border-security">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card border-security">
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <Label htmlFor="digest" className="text-sm text-foreground">
                      Daily Digest
                    </Label>
                  </div>
                  <Switch
                    id="digest"
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) => updateSetting("dailyDigest", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card border-security">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Notifications</span>
                  <span className="font-medium text-foreground">{notifications.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unread</span>
                  <span className="font-medium text-foreground">{unreadCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security Alerts</span>
                  <span className="font-medium text-foreground">
                    {notifications.filter(n => n.type === "security").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium text-foreground">
                    {notifications.filter(n => 
                      new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}