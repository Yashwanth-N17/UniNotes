import { Upload, Search, Download, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, title: "Upload Your Notes", description: "Share your handwritten notes, PYQs, or study materials with the community.", link: "/upload" },
  { icon: Search, title: "Search & Discover", description: "Find exactly what you need with powerful search and smart categorization.", link: "/browse" },
  { icon: Download, title: "Download & Study", description: "Access high-quality resources for free and prepare for your exams with confidence.", link: "/browse" },
  { icon: Star, title: "Rate & Review", description: "Help the community by rating materials and leaving helpful reviews.", link: "/scoreboard" },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleClick = (link: string) => {
    navigate(link);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28" aria-label="How UniNotes works">
      <div className="container">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How <span className="text-gradient">UniNotes</span> Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Four simple steps to ace your exams
            </p>
          </div>
        </ScrollReveal>

        {/* Connecting line (desktop only) */}
        <div className="relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-border hidden lg:block" />
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.12} distance={50}>
                <motion.button
                  onClick={() => handleClick(step.link)}
                  className="group relative text-center block cursor-pointer w-full"
                  whileHover="hover"
                >
                  
                  <motion.div
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card relative"
                    variants={{
                      hover: { scale: 1.1, y: -4 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <step.icon className="h-7 w-7" />
                    {/* Glow ring on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow" />
                  </motion.div>
                  
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
