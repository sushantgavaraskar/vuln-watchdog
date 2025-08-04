import { useState } from "react";
import { Package, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, type RiskLevel } from "./RiskBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vulnerability {
  id: string;
  title: string;
  severity: RiskLevel;
  cveId?: string;
  description: string;
  fixedIn?: string;
}

interface Dependency {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  isOutdated: boolean;
  vulnerabilities: Vulnerability[];
  riskLevel: RiskLevel;
}

interface DependencyTableProps {
  dependencies: Dependency[];
  isLoading?: boolean;
}

export function DependencyTable({ dependencies, isLoading = false }: DependencyTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [showVulnOnly, setShowVulnOnly] = useState(false);

  const filteredDependencies = dependencies.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || dep.riskLevel === riskFilter;
    const matchesVuln = !showVulnOnly || dep.vulnerabilities.length > 0;
    
    return matchesSearch && matchesRisk && matchesVuln;
  });

  const stats = {
    total: dependencies.length,
    vulnerable: dependencies.filter(d => d.vulnerabilities.length > 0).length,
    outdated: dependencies.filter(d => d.isOutdated).length,
    critical: dependencies.filter(d => d.riskLevel === "critical").length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Scanning dependencies...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Dependencies ({filteredDependencies.length})
          </CardTitle>
          
          <div className="flex gap-2">
            <Badge variant="outline">{stats.total} total</Badge>
            <Badge variant="destructive">{stats.vulnerable} vulnerable</Badge>
            <Badge variant="secondary">{stats.outdated} outdated</Badge>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search dependencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="secure">Secure</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showVulnOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowVulnOnly(!showVulnOnly)}
          >
            Vulnerable Only
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Current Version</TableHead>
              <TableHead>Latest Version</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDependencies.map((dep) => (
              <TableRow key={dep.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {dep.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={dep.isOutdated ? "destructive" : "secondary"}>
                    {dep.currentVersion}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{dep.latestVersion}</Badge>
                </TableCell>
                <TableCell>
                  <RiskBadge level={dep.riskLevel} />
                </TableCell>
                <TableCell>
                  {dep.vulnerabilities.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {dep.vulnerabilities.slice(0, 2).map((vuln) => (
                        <div key={vuln.id} className="flex items-center gap-2 text-sm">
                          <RiskBadge level={vuln.severity} />
                          <span className="text-muted-foreground truncate max-w-xs">
                            {vuln.title}
                          </span>
                          {vuln.cveId && (
                            <Badge variant="outline" className="text-xs">
                              {vuln.cveId}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {dep.vulnerabilities.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{dep.vulnerabilities.length - 2} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-secure text-sm">No vulnerabilities</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDependencies.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No dependencies found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}