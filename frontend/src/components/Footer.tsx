import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-16 relative overflow-hidden" role="contentinfo" aria-label="Site footer">
      {/* Dynamic Animated Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 mix-blend-screen animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] opacity-50 mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container relative z-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <button onClick={() => handleClick("/")} className="flex items-center gap-3 group outline-none">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
              >
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div className="flex flex-col items-start leading-none opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="font-display text-xl font-black tracking-tight text-foreground bg-clip-text">UniNotes</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary mt-1">Next-Gen Learning</span>
              </div>
            </button>
            <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
              Elevating the academic experience. The ultimate hub for brilliant minds to share, discover, and master their university journey together.
            </p>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold tracking-wide text-foreground uppercase text-xs">Explore Resources</h4>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li><button onClick={() => handleClick("/browse")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-2">Browse Notes</button></li>
              <li><button onClick={() => handleClick("/browse?type=pyq")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-2">Previous Papers</button></li>
              <li><button onClick={() => handleClick("/browse?type=materials")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-2">Study Materials</button></li>
              <li><button onClick={() => handleClick("/upload")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-2">Share Knowledge</button></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold tracking-wide text-foreground uppercase text-xs">Top Departments</h4>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li><button onClick={() => handleClick("/subject/computer-science")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Computer Science</button></li>
              <li><button onClick={() => handleClick("/subject/electrical-engineering")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Electrical Engineering</button></li>
              <li><button onClick={() => handleClick("/subject/mechanical-engineering")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Mechanical Engineering</button></li>
              <li><button onClick={() => handleClick("/subject/electronics-&-comm.")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Electronics & Comm.</button></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold tracking-wide text-foreground uppercase text-xs">Connect</h4>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li><button onClick={() => handleClick("/about")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">The Vision</button></li>
              <li><button onClick={() => handleClick("/contact")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Contact Us</button></li>
              <li><button onClick={() => handleClick("/privacy")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Privacy Focus</button></li>
              <li><button onClick={() => handleClick("/terms")} className="hover:text-primary hover:translate-x-1.5 transition-all duration-300 inline-block">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} UniNotes Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Empowering the students of tomorrow.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
