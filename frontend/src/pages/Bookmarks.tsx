import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import { ResourceGridSkeleton } from "@/components/LoadingSkeleton";
import PullToRefresh from "@/components/PullToRefresh";
import { motion } from "framer-motion";
import { FileText, Download, Star, Clock, Bookmark, Share2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import emptyBookmarksImg from "@/assets/empty-bookmarks.png";
import { useUser } from "@/hooks/use-user";

const bookmarks = [
  { title: "Data Structures & Algorithms - Complete Notes", subject: "Computer Science", author: "Priya S.", type: "Notes", rating: 4.8, downloads: 1240, time: "Saved 2 days ago", university: "IIT Delhi" },
  { title: "Thermodynamics - Formula Sheet", subject: "Mechanical Engineering", author: "Sneha R.", type: "Cheat Sheet", rating: 4.9, downloads: 2100, time: "Saved 1 week ago", university: "IIT Madras" },
  { title: "Circuit Theory - Complete Notes", subject: "Electrical Engineering", author: "Rahul K.", type: "Notes", rating: 4.9, downloads: 890, time: "Saved 2 weeks ago", university: "NIT Trichy" },
];

const typeColors: Record<string, string> = {
  Notes: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  PYQ: "bg-secondary/10 text-secondary border-secondary/20",
  Solutions: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  "Cheat Sheet": "bg-secondary/10 text-secondary border-secondary/20",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const Bookmarks = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-muted-foreground animate-pulse font-medium">Fetching your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <p className="mt-2 text-muted-foreground">You need to be logged in to access your saved resources.</p>
          <Button onClick={() => navigate("/login")} className="mt-4">Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleDownload = (title: string) => {
    toast({ title: "Download started", description: `${title} is downloading...` });
  };

  const handleRemoveBookmark = (title: string) => {
    toast({ title: "Removed 🔖", description: `${title} removed from bookmarks` });
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied! 🔗", description: `Share link for "${title}" copied to clipboard` });
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section
        className="border-b border-border bg-card py-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-gradient">Saved</span> Resources
          </h1>
          <p className="mt-2 text-muted-foreground">Your bookmarked notes, PYQs, and study materials</p>
        </div>
      </motion.section>

      <section className="py-10">
        <div className="container">
          {loading ? (
            <ResourceGridSkeleton count={3} />
          ) : bookmarks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover cursor-pointer h-full">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant="outline" className={`text-xs font-medium ${typeColors[item.type] || ""}`}>{item.type}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-secondary">
                          <Star className="h-3.5 w-3.5 fill-secondary" />
                          <span className="text-xs font-semibold">{item.rating}</span>
                        </div>
                        <button onClick={() => handleRemoveBookmark(item.title)} className="p-0.5 rounded text-secondary hover:text-destructive transition-colors" title="Remove bookmark">
                          <Bookmark className="h-4 w-4 fill-secondary" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-secondary transition-colors line-clamp-2">{item.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{item.subject} • {item.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">by {item.author}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleShare(item.title)} className="p-1 rounded-md text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Share">
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDownload(item.title)} className="p-1 rounded-md text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Download">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs text-muted-foreground ml-1 flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              illustration={emptyBookmarksImg}
              title="No saved resources yet"
              description="Browse and bookmark resources to save them here for quick access later."
              actionLabel="Browse Resources"
              actionHref="/browse"
            />
          )}
        </div>
      </section>
    </div>
    </PullToRefresh>
  );
};

export default Bookmarks;
