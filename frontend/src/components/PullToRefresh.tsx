import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

const THRESHOLD = 80;

const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const pullY = useMotionValue(0);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const opacity = useTransform(pullY, [0, THRESHOLD], [0, 1]);
  const scale = useTransform(pullY, [0, THRESHOLD], [0.5, 1]);
  const rotate = useTransform(pullY, [0, THRESHOLD * 2], [0, 360]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && !refreshing) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, [refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || refreshing) return;
    const diff = Math.max(0, (e.touches[0].clientY - startY.current) * 0.4);
    pullY.set(Math.min(diff, THRESHOLD * 1.5));
  }, [refreshing, pullY]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullY.get() >= THRESHOLD) {
      setRefreshing(true);
      pullY.set(THRESHOLD * 0.6);
      await onRefresh();
      setRefreshing(false);
    }
    pullY.set(0);
  }, [onRefresh, pullY]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: pullY }}
      >
        <motion.div
          style={{ opacity, scale, rotate: refreshing ? undefined : rotate }}
          animate={refreshing ? { rotate: 360 } : {}}
          transition={refreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : {}}
        >
          <RefreshCw className="h-6 w-6 text-secondary" />
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
};

export default PullToRefresh;
