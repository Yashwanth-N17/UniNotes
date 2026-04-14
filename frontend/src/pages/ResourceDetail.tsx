import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { ResourceDetailSkeleton } from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Star, Clock, ArrowLeft, User, ThumbsUp, Flag, Bookmark, Share2, Eye, MessageSquare, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import axios, { AxiosError } from "axios";

interface ResourceData {
  id: string;
  title: string;
  subject: string;
  resourceType: string;
  description: string;
  fileLink: string;
  department: string;
  semester: number;
  createdAt: string;
  downloads: number;
  views: number;
  averageRating: number;
  totalReviews: number;
  fileSize?: number;
  pageCount?: number;
  user: {
    fullname: string;
    university: string;
  };
}

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
  const navigate = useNavigate();
  const { data: currentUser } = useUser();
  const [comment, setComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<ResourceData | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/resources/${id}`);
        setResource(res.data.data);
      } catch (error) {
        console.error("Error fetching resource:", error);
        toast({ title: "Error", description: "Failed to load resource details", variant: "destructive" });
        navigate("/browse");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResource();
  }, [id, navigate, toast]);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to download resources.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!resource) return;

    try {
      setDownloading(true);
      toast({ title: "⬇️ Download starting…", description: `Preparing "${resource.title}" for download.` });

      const response = await api.get(
        `/api/resources/${resource.id}/download`,
        { responseType: "blob" }
      );

      // Read whether backend counted this as a fresh download
      const isFirstDownload = response.headers["x-is-first-download"] === "true";

      // Build a filename from Content-Disposition or fallback to resource title
      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename[^;=\n]*=((['"])([^'"]*)\2|([^;\n]*))/i);
      const rawName = match ? (match[3] || match[4]) : null;
      const filename = rawName ? decodeURIComponent(rawName) : `${resource.title}.pdf`;

      // Trigger browser download without any navigation
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      if (isFirstDownload) {
        setResource((prev) => prev ? { ...prev, downloads: prev.downloads + 1 } : prev);
      }

      toast({ title: "✅ Download complete!", description: `"${resource.title}" saved to your downloads.` });
    } catch (err: unknown) {
      let status: number | undefined;
      let axiosError: AxiosError | undefined;

      if (axios.isAxiosError(err)) {
        axiosError = err;
        status = err.response?.status;
      }

      if (status === 401) {
        toast({ title: "Session expired", description: "Please log in again to download resources.", variant: "destructive" });
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }

      let message = "Something went wrong. Please try again.";
      try {
        if (axiosError && axiosError.response?.data instanceof Blob) {
          const errBlob = axiosError.response.data;
          const text = await errBlob.text();
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } else if (axiosError?.response?.data) {
          const data = axiosError.response.data as { message?: string };
          message = data.message || message;
        }
      } catch { /* ignore parse errors */ }
      toast({ title: "Download failed", description: message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };


  const handleBookmark = () => {
    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to save resources.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setBookmarked(!bookmarked);
    toast({ title: bookmarked ? "Removed from saved" : "Saved!", description: bookmarked ? "Resource removed from bookmarks" : "Resource added to your bookmarks" });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to comment.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (comment.trim()) {
      toast({ title: "Comment posted", description: "Your comment has been added (UI only)." });
      setComment("");
    }
  };

  const handleRate = (star: number) => {
    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to rate resources.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setUserRating(star);
    toast({ title: `Rated ${star} stars`, description: "Thanks for your feedback! (UI only)" });
  };

  if (loading || !resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ResourceDetailSkeleton />
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const metadata = [
    resource.pageCount ? `${resource.pageCount} pages` : null,
    resource.fileSize ? formatBytes(resource.fileSize) : null
  ].filter(Boolean).join(" • ");

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
                <Badge variant="outline" className={`text-xs font-medium ${typeColors[resource.resourceType] || typeColors["Notes"]}`}>{resource.resourceType}</Badge>
                <Badge variant="outline" className="text-xs">Semester {resource.semester}</Badge>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{resource.title}</h1>
              <p className="mt-2 text-muted-foreground">{resource.subject} • {resource.department}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {resource.user?.fullname || "Unknown"}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(resource.createdAt).toLocaleDateString()}</span>
                {/* Static/Mock fields for anything not in the current DB schema */}
                <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {resource.downloads.toLocaleString()} downloads</span>
                {resource.pageCount && (
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {resource.pageCount} pages</span>
                )}
                {resource.fileSize && (
                  <span className="flex items-center gap-1"><HardDrive className="h-3.5 w-3.5" /> {formatBytes(resource.fileSize)}</span>
                )}
                <span className="flex items-center gap-1 text-secondary">
                  <Star className="h-3.5 w-3.5 fill-secondary" /> {resource.averageRating.toFixed(1)} ({resource.totalReviews} ratings)
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold w-full"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <Download className={`h-4 w-4 ${downloading ? "animate-bounce" : ""}`} />
                  {downloading ? "Downloading…" : "Download PDF"}
                </Button>
              </motion.div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleBookmark} className={bookmarked ? "text-secondary border-secondary" : ""}>
                   <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-secondary" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-muted-foreground hover:text-destructive">
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
            <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                <span className="text-sm font-medium text-foreground">Preview</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {resource.subject} {metadata ? `• ${metadata}` : ''}
                </span>
              </div>
              <div className="flex h-[500px] w-full items-center justify-center bg-muted/10">
                {resource.fileLink ? (
                  <iframe
                    src={`${resource.fileLink}#toolbar=0&navpanes=0`}
                    className="h-full w-full border-none"
                    title="Resource Preview"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">Preview not available</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>

            </motion.div>

            {/* Static Rating Breakdown */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Ratings & Reviews</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-4xl font-bold text-foreground">4.8</span>
                  <StarRating rating={5} size="sm" />
                  <span className="text-xs text-muted-foreground mt-1">156 ratings</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const counts: Record<number, number> = { 5: 89, 4: 42, 3: 15, 2: 7, 1: 3 };
                    const total = 156;
                    const pct = Math.round((counts[star] / total) * 100);
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

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Rate this resource</p>
                {currentUser ? (
                  <StarRating rating={userRating} onRate={handleRate} size="lg" interactive showValue />
                ) : (
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground italic">Log in to rate this resource</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-secondary" onClick={() => navigate("/login", { state: { from: window.location.pathname } })}>Login</Button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-6">
               <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Comments ({mockComments.length})
              </h2>
              {currentUser ? (
                <form onSubmit={handleComment} className="mb-6 flex gap-2">
                  <Input placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} className="flex-1" />
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Post</Button>
                </form>
              ) : (
                <div className="mb-6 flex items-center justify-between rounded-xl bg-muted/40 p-4 border border-dashed border-border">
                  <p className="text-sm text-muted-foreground italic">Have something to say? Log in to join the discussion.</p>
                  <Button size="sm" variant="outline" className="text-secondary border-secondary/20 hover:bg-secondary/10" onClick={() => navigate("/login", { state: { from: window.location.pathname } })}>Login</Button>
                </div>
              )}
              <div className="space-y-4">
                {mockComments.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + (i % 5) * 0.08 }}
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

          <div className="space-y-6">
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Uploaded by</h3>
              <div className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{resource.user?.fullname || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">{resource.user?.university || "Student"}</p>
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
               <h3 className="font-display font-semibold text-foreground mb-3">Resource Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span className="text-foreground">{resource.subject}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="text-foreground">{resource.department}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Semester</span><span className="text-foreground">{resource.semester}</span></div>
              </div>
            </motion.div>

            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Related Resources</h3>
              <div className="space-y-3">
                {mockRelated.map((r) => (
                  <motion.div
                    key={r.id}
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  >
                    <Link to={`/resource/${r.id}`} className="block rounded-lg border border-border p-3 transition-all hover:shadow-card">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={`text-[10px] ${typeColors[r.type] || typeColors["Notes"]}`}>{r.type}</Badge>
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
