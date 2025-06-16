
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const StatsCard = ({ title, value, description, icon: Icon, gradient }: StatsCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
