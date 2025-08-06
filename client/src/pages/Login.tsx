import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      console.log("Login attempt:", formData);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left side - Hero */}
        <div className="hidden lg:flex lg:flex-1 relative">
          <div 
            className="absolute inset-0 bg-gradient-hero"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-hero/90" />
          
          <div className="relative flex flex-col justify-center px-12 text-center">
            <div className="mx-auto mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Secure Your Applications
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              VulnWatch helps you monitor and secure your dependencies with real-time vulnerability detection.
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Projects Secured</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <div className="flex items-center space-x-2 lg:hidden mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-security">VulnWatch</span>
              </div>
              
              <h2 className="text-3xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your account to continue monitoring your projects.
              </p>
            </div>

            <Card className="bg-gradient-card border-security shadow-security">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-foreground">Sign In</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="pl-10 bg-background border-security"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-background border-security"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-security hover:text-primary-glow transition-smooth"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full shadow-security" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link 
                      to="/register" 
                      className="text-security hover:text-primary-glow transition-smooth font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}