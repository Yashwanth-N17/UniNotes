import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { ResourceDetailSkeleton } from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";

import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Star, Clock, ArrowLeft, User, ThumbsUp, Flag, Bookmark, Share2, Eye, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const mockResource = {
  id: "1",
  title: "DSA - Complete Notes",
  subject: "Data Structures & Algorithms",
  department: "Computer Science",
  university: "IIT Delhi",
  author: "Priya S.",
  type: "Notes",
  rating: 4.8,
  totalRatings: 156,
  downloads: 1240,
  views: 3420,
  uploadedAt: "2 hours ago",
  description: "Comprehensive notes covering all major DSA topics including arrays, linked lists, trees, graphs, dynamic programming, greedy algorithms, and sorting techniques. Includes diagrams and complexity analysis for each algorithm.",
  tags: ["DSA", "algorithms", "data-structures", "midterm", "handwritten"],
  pages: 42,
  fileSize: "8.5 MB",
  semester: "3rd Semester",
};

const mockComments = [
  { id: "1", author: "Rahul K.", time: "1 day ago", text: "These notes are excellent! Helped me a lot during my end-sem preparation.", likes: 12 },
  { id: "2", author: "Sneha R.", time: "3 days ago", text: "Really well structured. The diagrams for tree traversals are super clear.", likes: 8 },
  { id: "3", author: "Vikram P.", time: "5 days ago", text: "Could you add more examples for DP problems? Otherwise, great work!", likes: 5 },
];

const mockRelated = [
  { id: "2", title: "DSA - PYQ 2024", type: "PYQ", author: "Rahul K.", rating: 4.7, downloads: 890 },
  { id: "3", title: "DSA - Mid Sem Solutions", type: "Solutions", author: "Vikram P.", rating: 4.6, downloads: 540 },
  { id: "4", title: "DSA - Quick Revision Sheet", type: "Cheat Sheet", author: "Sneha R.", rating: 4.9, downloads: 2100 },
];

const typeColors: Record<string, string> = {
  Notes: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  PYQ: "bg-secondary/10 text-secondary border-secondary/20",
  Solutions: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  "Cheat Sheet": "bg-secondary/10 text-secondary border-secondary/20",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const ResourceDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const resource = mockResource;

  const handleDownload = () => {
    toast({ title: "Download started", description: `${resource.title} is downloading...` });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({ title: bookmarked ? "Removed from saved" : "Saved!", description: bookmarked ? "Resource removed from bookmarks" : "Resource added to your bookmarks" });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      toast({ title: "Comment posted", description: "Your comment has been added (UI only)." });
      setComment("");
    }
  };

  const handleReport = () => {
    toast({ title: "Report submitted", description: "We'll review this resource. Thanks for the feedback." });
  };

  const handleRate = (star: number) => {
    setUserRating(star);
    toast({ title: `Rated ${star} stars`, description: "Thanks for your feedback! (UI only)" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ResourceDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section
        className="border-b border-border bg-card py-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container">
          <Link to="/browse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Browse
          </Link>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={`text-xs font-medium ${typeColors[resource.type]}`}>{resource.type}</Badge>
                <Badge variant="outline" className="text-xs">{resource.semester}</Badge>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{resource.title}</h1>
              <p className="mt-2 text-muted-foreground">{resource.subject} • {resource.department}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {resource.author}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {resource.uploadedAt}</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {resource.views.toLocaleString()} views</span>
                <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {resource.downloads.toLocaleString()} downloads</span>
                <span className="flex items-center gap-1 text-secondary">
                  <Star className="h-3.5 w-3.5 fill-secondary" /> {resource.rating} ({resource.totalRatings} ratings)
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold w-full" onClick={handleDownload}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </motion.div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleBookmark} className={bookmarked ? "text-secondary border-secondary" : ""}>
                  <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-secondary" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleReport} className="text-muted-foreground hover:text-destructive">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-8">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Preview placeholder */}
            <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                <span className="text-sm font-medium text-foreground">Preview</span>
                <span className="text-xs text-muted-foreground">{resource.pages} pages • {resource.fileSize}</span>
              </div>
              <div className="flex h-96 items-center justify-center bg-muted/30">
                <div className="text-center">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">PDF Preview</p>
                  <p className="text-xs text-muted-foreground/60">Preview will be available when backend is connected</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs bg-muted/50">{tag}</Badge>
                ))}
              </div>
            </motion.div>

            {/* Rating Breakdown */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Ratings & Reviews</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-4xl font-bold text-foreground">{resource.rating}</span>
                  <StarRating rating={Math.round(resource.rating)} size="sm" />
                  <span className="text-xs text-muted-foreground mt-1">{resource.totalRatings} ratings</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const counts: Record<number, number> = { 5: 89, 4: 42, 3: 15, 2: 7, 1: 3 };
                    const pct = Math.round((counts[star] / resource.totalRatings) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-muted-foreground text-xs">{star}</span>
                        <Star className="h-3 w-3 text-secondary fill-secondary" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + star * 0.05, ease: "easeOut" }}
                          />
                        </div>
                        <span className="w-8 text-xs text-muted-foreground text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Rating */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Rate this resource</p>
                <StarRating rating={userRating} onRate={handleRate} size="lg" interactive showValue />
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Comments ({mockComments.length})
              </h2>
              <form onSubmit={handleComment} className="mb-6 flex gap-2">
                <Input placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} className="flex-1" />
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Post</Button>
              </form>
              <div className="space-y-4">
                {mockComments.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.text}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-3 w-3" /> {c.likes}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Uploaded by</h3>
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">{resource.author}</p>
                  <p className="text-xs text-muted-foreground">{resource.university}</p>
                </div>
              </Link>
            </motion.div>

            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Resource Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span className="text-foreground">{resource.subject}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="text-foreground">{resource.department}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">University</span><span className="text-foreground">{resource.university}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pages</span><span className="text-foreground">{resource.pages}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">File Size</span><span className="text-foreground">{resource.fileSize}</span></div>
              </div>
            </motion.div>

            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Related Resources</h3>
              <div className="space-y-3">
                {mockRelated.map((r, i) => (
                  <motion.div
                    key={r.id}
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  >
                    <Link to={`/resource/${r.id}`} className="block rounded-lg border border-border p-3 transition-all hover:shadow-card">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={`text-[10px] ${typeColors[r.type]}`}>{r.type}</Badge>
                        <span className="flex items-center gap-0.5 text-xs text-secondary"><Star className="h-3 w-3 fill-secondary" />{r.rating}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">by {r.author} • {r.downloads} downloads</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetail;
