import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Shield } from "lucide-react";

export type RiskLevel = "critical" | "high" | "medium" | "low" | "secure";

interface RiskBadgeProps {
  level: RiskLevel;
  count?: number;
  className?: string;
}

const riskConfig = {
  critical: {
    label: "Critical",
    color: "bg-critical text-critical-foreground",
    icon: XCircle,
  },
  high: {
    label: "High",
    color: "bg-high text-high-foreground",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium", 
    color: "bg-medium text-medium-foreground",
    icon: AlertCircle,
  },
  low: {
    label: "Low",
    color: "bg-low text-low-foreground",
    icon: AlertCircle,
  },
  secure: {
    label: "Secure",
    color: "bg-secure text-secure-foreground",
    icon: Shield,
  },
};

export function RiskBadge({ level, count, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.color,
        level === "critical" && "animate-pulse-glow",
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
      {count !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
          {count}
        </span>
      )}
    </div>
  );
}