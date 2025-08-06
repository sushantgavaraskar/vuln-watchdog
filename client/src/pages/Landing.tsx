import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Bell, 
  Users, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Star,
  Github,
  Lock,
  Eye,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Shield,
    title: "Real-time Vulnerability Detection",
    description: "Automatically scan your dependencies and get instant alerts about security vulnerabilities."
  },
  {
    icon: Zap,
    title: "Lightning Fast Scanning",
    description: "Scan thousands of dependencies in seconds with our optimized vulnerability database."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get notified via email, Slack, or webhooks when new vulnerabilities are discovered."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share projects with your team and collaborate on vulnerability remediation."
  },
  {
    icon: TrendingUp,
    title: "Security Analytics",
    description: "Track your security posture over time with detailed analytics and reporting."
  },
  {
    icon: Eye,
    title: "Continuous Monitoring",
    description: "24/7 monitoring ensures you're always aware of new threats to your applications."
  }
];

const supportedFiles = [
  { name: "package.json", ecosystem: "Node.js" },
  { name: "requirements.txt", ecosystem: "Python" },
  { name: "pom.xml", ecosystem: "Java/Maven" },
  { name: "Gemfile", ecosystem: "Ruby" },
  { name: "composer.json", ecosystem: "PHP" },
  { name: "go.mod", ecosystem: "Go" }
];

const stats = [
  { value: "10K+", label: "Projects Secured" },
  { value: "1M+", label: "Vulnerabilities Detected" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Monitoring" }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-security bg-gradient-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-security">VulnWatch</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-smooth">
                Pricing
              </a>
              <a href="#docs" className="text-muted-foreground hover:text-primary transition-smooth">
                Docs
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="shadow-security">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary">
              🚀 Now with real-time monitoring
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Secure Your Applications
              <span className="block text-transparent bg-gradient-primary bg-clip-text">
                Before Threats Strike
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              VulnWatch monitors your dependencies 24/7, alerting you instantly about security vulnerabilities 
              so you can fix them before they become problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register">
                <Button size="lg" className="shadow-security text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Github className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Security Monitoring
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to keep your applications secure, from dependency scanning 
              to real-time threat intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-security transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Files Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Universal Language Support
            </h2>
            <p className="text-xl text-muted-foreground">
              Scan dependencies from any ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportedFiles.map((file, index) => (
              <Card key={index} className="bg-gradient-card border-security text-center p-6 transition-smooth hover:shadow-glow">
                <div className="text-lg font-semibold text-foreground mb-2">
                  {file.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {file.ecosystem}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 bg-success/10 text-success border-success">
                Enterprise Security
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built with Security in Mind
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Your code and data are protected with enterprise-grade security measures. 
                We never store your source code, only dependency metadata.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">SOC 2 Type II compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">Zero source code storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">Regular security audits</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-gradient-card border-security p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-foreground">Security Dashboard</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-critical/10 border border-critical/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-critical" />
                      <span className="text-sm text-foreground">CVE-2024-1234</span>
                    </div>
                    <Badge variant="outline" className="bg-critical text-critical-foreground border-critical">
                      CRITICAL
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-high/10 border border-high/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-high" />
                      <span className="text-sm text-foreground">CVE-2024-5678</span>
                    </div>
                    <Badge variant="outline" className="bg-high text-high-foreground border-high">
                      HIGH
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm text-foreground">No vulnerabilities found</span>
                    </div>
                    <Badge variant="outline" className="bg-success text-success-foreground border-success">
                      SECURE
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Start Securing Your Applications Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who trust VulnWatch to keep their applications secure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="shadow-security text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-security bg-gradient-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-security">VulnWatch</span>
              </div>
              <p className="text-muted-foreground">
                Keeping your applications secure with real-time vulnerability monitoring.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Features</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Pricing</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Security</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Documentation</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">API Reference</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">About</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">Careers</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-security mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VulnWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}