import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary", className = "" }) => {
  const colorStyles = {
    primary: "from-primary/10 to-blue-100 text-primary border-primary/20",
    success: "from-success/10 to-green-100 text-success border-success/20",
    warning: "from-warning/10 to-amber-100 text-warning border-warning/20",
    error: "from-error/10 to-red-100 text-error border-error/20",
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-slate-500",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="h-full bg-gradient-to-br from-white to-slate-50/50 border-slate-200 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className={`p-2 rounded-lg bg-gradient-to-r border ${colorStyles[color]}`}>
              <ApperIcon name={icon} size={20} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            
            {trend && trendValue && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                  size={16} 
                  className={trendColors[trend]}
                />
                <span className={`text-sm font-medium ${trendColors[trend]}`}>
                  {trendValue}
                </span>
                <span className="text-xs text-slate-500">vs last semester</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;