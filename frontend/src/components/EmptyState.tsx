import { forwardRef } from "react";
import { LucideIcon, ArrowRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getLastVisited, getLastVisitedLabel } from "@/hooks/use-last-visited";

interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  showLastVisited?: boolean;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({
  icon: Icon,
  illustration,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  showLastVisited = true,
}, ref) => {
  const lastVisited = showLastVisited ? getLastVisited() : null;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
    >
      {illustration ? (
        <motion.img
          src={illustration}
          alt={title}
          className="h-40 w-40 object-contain mb-5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      ) : Icon ? (
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Icon className="h-10 w-10 text-muted-foreground/40" />
        </motion.div>
      ) : null}
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>

      <div className="mt-6 flex flex-col items-center gap-3">
        {actionLabel && (actionHref ? (
          <Link to={actionHref}>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2">
              {actionLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : onAction ? (
          <Button onClick={onAction} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2">
            {actionLabel} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : null)}

        {lastVisited && (
          <Link to={lastVisited.path}>
            <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground">
              <History className="h-4 w-4" />
              {getLastVisitedLabel(lastVisited.path)}
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
