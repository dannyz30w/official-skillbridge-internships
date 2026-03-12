import { motion } from "framer-motion";
import { Users, Building2, DollarSign, Trophy } from "lucide-react";

const stats = [
  { icon: DollarSign, label: "Avg. Hourly Pay", value: "$22/hr", color: "text-success" },
  { icon: Building2, label: "Partner Companies", value: "450+", color: "text-foreground" },
  { icon: Users, label: "Interns Placed", value: "1,200+", color: "text-foreground" },
];

const StatsBar = () => {
  return (
    <section className="py-8 px-4 sm:px-6 border-y border-border bg-muted/40">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex flex-wrap items-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-accent">
                  <stat.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className={`text-lg font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-secondary-foreground">
            <Trophy className="h-3.5 w-3.5" />
            <span>WSI Impact League Finalist · Top 80 of 2,500+</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;