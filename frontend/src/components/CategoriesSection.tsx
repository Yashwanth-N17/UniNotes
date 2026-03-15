import { Cpu, Zap, Cog, CircuitBoard, Droplets, Building2, Wrench, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const categories = [
  { name: "Computer Science", icon: Cpu, count: 2340, color: "bg-primary/10 text-primary dark:bg-muted dark:text-foreground" },
  { name: "Electrical Engineering", icon: Zap, count: 1890, color: "bg-secondary/10 text-secondary" },
  { name: "Mechanical Engineering", icon: Cog, count: 1560, color: "bg-primary/10 text-primary dark:bg-muted dark:text-foreground" },
  { name: "Electronics & Comm.", icon: CircuitBoard, count: 2100, color: "bg-secondary/10 text-secondary" },
  { name: "Civil Engineering", icon: Building2, count: 980, color: "bg-primary/10 text-primary dark:bg-muted dark:text-foreground" },
  { name: "Chemical Engineering", icon: Droplets, count: 1240, color: "bg-secondary/10 text-secondary" },
  { name: "Information Technology", icon: Wifi, count: 1780, color: "bg-primary/10 text-primary dark:bg-muted dark:text-foreground" },
  { name: "Industrial Engineering", icon: Wrench, count: 870, color: "bg-secondary/10 text-secondary" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-28" aria-label="Engineering branches">
      <div className="container">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Engineering <span className="text-gradient">Branches</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find resources across all major engineering disciplines
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.06} distance={30}>
              <Link
                to={`/subject/${encodeURIComponent(cat.name.toLowerCase().replace(/ /g, "-"))}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group rounded-xl border border-border bg-card p-6 shadow-card hover-lift block relative overflow-hidden h-full"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-card pointer-events-none" />
                
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${cat.color}`}
                  >
                    <cat.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.count.toLocaleString()} resources</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
