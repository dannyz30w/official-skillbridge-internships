import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Briefcase } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const BrowseInternships = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Sign In
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
              Browse Internships
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real roles, real pay — from vetted companies.
            </p>

            <div className="mt-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by role, company, or location..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>

            <div className="mt-12 rounded-xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="text-base font-bold text-foreground">No internships listed yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                We're onboarding our first partner companies now. Check back soon — or{" "}
                <Link to="/post-internship" className="font-medium text-primary hover:text-primary/80 transition-smooth">
                  post one yourself
                </Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrowseInternships;
