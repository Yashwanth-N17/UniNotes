import { Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 relative z-10" aria-label="Call to action">
      <div className="container">
        <ScrollReveal distance={60}>
          <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-elevated sm:px-16 lg:py-24 bg-primary dark:bg-card border border-border/20 dark:border-border">
            {/* Animated background blobs */}
            <motion.div
              className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-secondary blur-3xl opacity-20"
              animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary blur-3xl opacity-20"
              animate={{ scale: [1, 1.3, 1], x: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 space-y-6">
              <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl text-primary-foreground">
                Share Your Knowledge,<br />Help Others Succeed
              </h2>
              <p className="mx-auto max-w-xl text-lg text-primary-foreground/70">
                Upload your notes, previous year questions, and study materials to help thousands of students prepare better for their exams.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/upload" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <Button size="lg" className="h-13 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 text-base interactive-scale">
                    <Upload className="h-5 w-5" /> Upload Now
                  </Button>
                </Link>
                <Link to="/browse" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <Button size="lg" className="h-13 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 text-base interactive-scale">
                    Browse Resources <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
