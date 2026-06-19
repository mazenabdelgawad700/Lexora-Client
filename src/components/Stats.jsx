import { motion } from "framer-motion";
import { Card } from "./common";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
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
        {/* {trend !== undefined && trend !== null && (
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className={trend > 0 ? "text-emerald-500" : "text-slate-400"} />
            <p
              className={clsx(
                "text-sm font-semibold",
                trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500",
              )}
            >
              {trend > 0 ? `+${trend}` : trend} this week
            </p>
          </div>
        )} */}
      </Card>
    </motion.div>
  );
};

/**
 * Statistics section component
 */
export const StatsSection = ({ totalWords, wordsThisWeek, latestWord }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        label="Total Words"
        value={totalWords}
        icon={BookOpen}
        gradient="bg-gradient-to-br from-accent-500 to-accent-700"
        delay={0}
      />
      <StatsCard
        label="Added This Week"
        value={wordsThisWeek}
        trend={wordsThisWeek}
        icon={TrendingUp}
        gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        delay={0.1}
      />
      <StatsCard
        label="Latest Word"
        value={latestWord?.word || "—"}
        icon={Sparkles}
        gradient="bg-gradient-to-br from-purple-500 to-pink-600"
        delay={0.2}
      />
    </div>
  );
};
