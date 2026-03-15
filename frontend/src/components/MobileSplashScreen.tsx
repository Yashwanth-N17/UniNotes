import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { BookOpen } from "lucide-react";

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
          >
            {/* Logo */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-lg">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>

              <motion.h1
                className="mt-5 font-display text-2xl font-semibold text-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                UniNotes
              </motion.h1>

              <motion.p
                className="mt-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              >
                Study smarter, together.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default SplashScreen;
