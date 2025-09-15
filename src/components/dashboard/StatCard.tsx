import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "primary" | "secondary" | "success" | "warning";
}

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
  const colorClasses = {
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-secondary-blue text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white"
  };

  return (
    <Card className="shadow-card hover:shadow-soft transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;