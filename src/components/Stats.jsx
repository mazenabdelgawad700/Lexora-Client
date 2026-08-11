import { motion } from "framer-motion";
import { Card } from "./common";
import { BookOpen } from "lucide-react";
import clsx from "clsx";

/**
 * Statistics card component with gradient icon
 */
export const StatsCard = ({
  icon: Icon,
  label,
  value,
  gradient,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight">
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={clsx(
                "p-3 rounded-xl shadow-sm",
                gradient || "bg-gradient-to-br from-accent-500 to-purple-600",
              )}
            >
              <Icon size={22} className="text-white" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export const StatsSection = ({ totalWords }) => {
  return (
    <div className="">
      <StatsCard
        label="Total Words"
        value={totalWords}
        icon={BookOpen}
        gradient="bg-gradient-to-br from-accent-500 to-accent-700"
        delay={0}
      />
    </div>
  );
};