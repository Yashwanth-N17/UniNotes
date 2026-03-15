import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { IndexSkeleton } from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <IndexSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" role="main" aria-label="UniNotes homepage">
      <Navbar />
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <HeroSection />
      </motion.div>
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <StatsSection />
      </motion.div>
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <CategoriesSection />
      </motion.div>
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <HowItWorks />
      </motion.div>
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <CTASection />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Index;
