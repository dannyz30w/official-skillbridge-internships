import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  pay: string;
  tags: string[];
  applicants: number;
}

const listings: Listing[] = [
  {
    id: 1,
    title: "Marketing Intern",
    company: "Brightwave Media",
    location: "Remote",
    type: "Part-time",
    pay: "$21.50/hr",
    tags: ["Marketing", "Social Media"],
    applicants: 14,
  },
  {
    id: 2,
    title: "Junior Software Developer",
    company: "CodePath Labs",
    location: "Austin, TX",
    type: "Full-time",
    pay: "$25.00/hr",
    tags: ["Engineering", "React"],
    applicants: 32,
  },
  {
    id: 3,
    title: "Graphic Design Assistant",
    company: "Studio Forma",
    location: "Brooklyn, NY",
    type: "Part-time",
    pay: "$19.00/hr",
    tags: ["Design", "Figma"],
    applicants: 8,
  },
  {
    id: 4,
    title: "Data Analysis Intern",
    company: "InsightIQ",
    location: "Remote",
    type: "Full-time",
    pay: "$23.00/hr",
    tags: ["Data", "Python"],
    applicants: 21,
  },
];

const springTransition = { type: "spring" as const, duration: 0.4, bounce: 0 };

const FeaturedListings = () => {
  return (
    <section id="internships" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
                Featured Internships
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real roles, real pay, vetted companies.
              </p>
            </div>
            <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-smooth">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-4">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-smooth">
              View all internships <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <div className="group bg-card rounded-xl border border-border shadow-card transition-card hover:shadow-card-hover hover:border-ring p-6 will-change-transform">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted text-xs font-bold text-muted-foreground uppercase shrink-0">
              {listing.company.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-foreground truncate">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">{listing.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {listing.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {listing.type}
            </span>
            <span className="text-xs">{listing.applicants} applicants</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <p className="text-lg font-bold tabular-nums text-success">{listing.pay}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springTransition}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth will-change-transform"
          >
            Apply Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;