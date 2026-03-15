import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 50000, suffix: "+", label: "Study Materials" },
  { value: 10000, suffix: "+", label: "Active Students" },
  { value: 200, suffix: "+", label: "Universities" },
  { value: 4.8, suffix: "", label: "Average Rating", decimal: true },
];

const AnimatedCounter = ({ target, suffix, decimal, isVisible }: { target: number; suffix: string; decimal?: boolean; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  const display = decimal
    ? count.toFixed(1)
    : count >= 1000
    ? `${Math.floor(count / 1000)}K`
    : Math.floor(count).toString();

  return <span>{display}{suffix}</span>;
};

const StatsSection = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 border-y border-border bg-card relative overflow-hidden" aria-label="Platform statistics">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="container relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <motion.div
                className="font-display text-3xl font-bold text-gradient sm:text-4xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} decimal={stat.decimal} isVisible={isVisible} />
              </motion.div>
              <div className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
