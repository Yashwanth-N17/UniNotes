import { Star } from "lucide-react";
import { useState, forwardRef } from "react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  showValue?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(({ rating, onRate, size = "md", interactive = false, showValue = false }, ref) => {
  const [hovered, setHovered] = useState(0);
  const displayRating = hovered || rating;

  return (
    <div ref={ref} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-transform ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`${sizeMap[size]} transition-colors ${
              star <= displayRating
                ? "fill-secondary text-secondary"
                : "text-muted-foreground/20"
            } ${interactive && star <= hovered ? "text-secondary/80" : ""}`}
          />
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-foreground">{rating}/5</span>
      )}
    </div>
  );
});

StarRating.displayName = "StarRating";

export default StarRating;
