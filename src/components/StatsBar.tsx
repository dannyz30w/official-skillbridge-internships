import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const StatsBar = () => {
  return (
    <section className="py-6 px-4 sm:px-6 border-y border-border bg-muted/40">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-secondary-foreground">
            <Trophy className="h-4 w-4 text-warning" />
            <span>WSI Impact League Finalist · Top 80 of 2,500+ participants</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
