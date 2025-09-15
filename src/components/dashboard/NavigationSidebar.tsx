import { Calendar, Pill, User, Bell, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  badge?: number;
}

interface NavigationSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems: NavigationItem[] = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: Calendar, label: "Appointments", id: "appointments", badge: 3 },
  { icon: Pill, label: "Medications", id: "medications", badge: 2 },
  { icon: User, label: "Patient Profile", id: "profile" },
  { icon: Bell, label: "Notifications", id: "notifications", badge: 5 },
  { icon: Settings, label: "Settings", id: "settings" },
];

const NavigationSidebar = ({ activeTab, onTabChange }: NavigationSidebarProps) => {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-xs px-2 py-1 rounded-full",
                    activeTab === item.id
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary text-primary-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default NavigationSidebar;