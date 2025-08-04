import { Shield, Search, Upload, Bell, ArrowRight, CheckCircle, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold">VulnGuard</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" variant="outline">
              🚀 New: AI-powered vulnerability analysis
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-hero bg-clip-text text-transparent animate-slide-up">
              Secure Your Dependencies,
              <br />
              Protect Your Code
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Advanced vulnerability scanning for your Node.js and Python projects. 
              Get real-time security insights, automated alerts, and actionable remediation guidance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="xl" variant="hero" className="animate-pulse-glow" onClick={() => navigate('/dashboard')}>
                Start Free Scan
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/dashboard')}>
                <Upload className="mr-2 w-4 h-4" />
                Upload File
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose VulnGuard?</h2>
            <p className="mt-4 text-muted-foreground">
              Comprehensive security analysis with enterprise-grade protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Advanced Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Deep dependency analysis using multiple vulnerability databases including CVE, NVD, and OSV.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intelligent notifications with customizable frequency and severity filters to reduce noise.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Auto Remediation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get specific fix recommendations and automated dependency updates for faster resolution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Dependencies Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Vulnerabilities Found</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Enterprise-Grade Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secure mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Real-time Vulnerability Database</h3>
                    <p className="text-muted-foreground text-sm">
                      Always up-to-date with the latest security advisories
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secure mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Multi-Language Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Support for Node.js, Python, Java, and more coming soon
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secure mt-0.5" />
                  <div>
                    <h3 className="font-semibold">GDPR Compliant</h3>
                    <p className="text-muted-foreground text-sm">
                      Your code and data remain private and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-6">
                <Lock className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Secure Your Projects?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start scanning your dependencies for free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="hero">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="xl" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-primary mb-4 md:mb-0">
              <Shield className="w-6 h-6" />
              <span className="font-bold">VulnGuard</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Documentation</a>
              <a href="#" className="hover:text-foreground">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
