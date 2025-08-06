import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  className?: string;
}

export const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-critical text-critical-foreground border-critical";
      case "HIGH":
        return "bg-high text-high-foreground border-high";
      case "MEDIUM":
        return "bg-medium text-medium-foreground border-medium";
      case "LOW":
        return "bg-low text-low-foreground border-low";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium transition-smooth",
        getSeverityStyles(severity),
        className
      )}
    >
      {severity}
    </Badge>
  );
};