import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import { ResourceGridSkeleton, BrowseSkeleton } from "@/components/LoadingSkeleton";
import PullToRefresh from "@/components/PullToRefresh";
import { motion, AnimatePresence } from "framer-motion";
import emptySearchImg from "@/assets/empty-search.png";

import { Search, FileText, Download, Star, Clock, SlidersHorizontal, BookOpen, GraduationCap, TrendingUp, Bookmark, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

const allResources = [
  { title: "Data Structures & Algorithms - Complete Notes", subject: "Computer Science", author: "Priya S.", type: "Notes", rating: 4.8, downloads: 1240, time: "2 hours ago", university: "IIT Delhi", semester: 3 },
  { title: "Engineering Mathematics III - PYQ 2024", subject: "Mechanical Engineering", author: "Rahul K.", type: "PYQ", rating: 4.9, downloads: 890, time: "5 hours ago", university: "NIT Trichy", semester: 3 },
  { title: "Digital Electronics - Handwritten Notes", subject: "Electronics & Comm.", author: "Ananya M.", type: "Notes", rating: 4.7, downloads: 670, time: "8 hours ago", university: "BITS Pilani", semester: 3 },
  { title: "Operating Systems - Mid Sem Solutions", subject: "Computer Science", author: "Vikram P.", type: "Solutions", rating: 4.6, downloads: 540, time: "12 hours ago", university: "IIT Bombay", semester: 5 },
  { title: "Thermodynamics - Formula Sheet", subject: "Mechanical Engineering", author: "Sneha R.", type: "Cheat Sheet", rating: 4.9, downloads: 2100, time: "1 day ago", university: "IIT Madras", semester: 3 },
  { title: "Power Systems - Chapter Summaries", subject: "Electrical Engineering", author: "Arjun D.", type: "Notes", rating: 4.5, downloads: 430, time: "1 day ago", university: "Delhi University", semester: 5 },
  { title: "Database Management Systems - Lab Manual", subject: "Information Technology", author: "Kavya L.", type: "Notes", rating: 4.7, downloads: 780, time: "2 days ago", university: "VIT Vellore", semester: 4 },
  { title: "Structural Analysis - Practice Problems", subject: "Civil Engineering", author: "Rohan T.", type: "PYQ", rating: 4.8, downloads: 950, time: "2 days ago", university: "IIT Kanpur", semester: 5 },
  { title: "Chemical Process Design - Notes", subject: "Chemical Engineering", author: "Meera J.", type: "Notes", rating: 4.6, downloads: 620, time: "3 days ago", university: "IIT Kharagpur", semester: 6 },
  { title: "Machine Learning - Complete Guide", subject: "Computer Science", author: "Amit S.", type: "Notes", rating: 4.9, downloads: 1850, time: "3 days ago", university: "IIT Delhi", semester: 7 },
  { title: "Fluid Mechanics - Solved Examples", subject: "Civil Engineering", author: "Neha P.", type: "Solutions", rating: 4.5, downloads: 380, time: "4 days ago", university: "NIT Warangal", semester: 4 },
  { title: "VLSI Design - Lab Experiments", subject: "Electronics & Comm.", author: "Karan M.", type: "Notes", rating: 4.7, downloads: 510, time: "4 days ago", university: "BITS Pilani", semester: 6 },
];

const departments = [
  { name: "Computer Science", slug: "computer-science", resources: 2340, icon: "💻" },
  { name: "Electrical Engineering", slug: "electrical-engineering", resources: 1890, icon: "⚡" },
  { name: "Mechanical Engineering", slug: "mechanical-engineering", resources: 1560, icon: "⚙️" },
  { name: "Electronics & Comm.", slug: "electronics-&-comm.", resources: 2100, icon: "📡" },
  { name: "Civil Engineering", slug: "civil-engineering", resources: 980, icon: "🏗️" },
  { name: "Chemical Engineering", slug: "chemical-engineering", resources: 1240, icon: "🧪" },
  { name: "Information Technology", slug: "information-technology", resources: 1780, icon: "🌐" },
  { name: "Industrial Engineering", slug: "industrial-engineering", resources: 870, icon: "🏭" },
];

const trendingTopics = [
  "Machine Learning", "Data Structures", "Thermodynamics", "VLSI Design", "Cloud Computing", "Power Electronics",
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
      delay: i * 0.06,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const ITEMS_PER_PAGE = 6;

const Browse = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [debouncedSearch, typeFilter, departmentFilter, semesterFilter, sortBy]);

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Login required", description: "Please log in to download resources.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    toast({ title: "Download started", description: `${title} is downloading...` });
  };

  const handleBookmark = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Login required", description: "Please log in to save resources.", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    toast({ title: "Saved! 🔖", description: `${title} added to bookmarks` });
  };

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied! 🔗", description: `Share link for "${title}" copied to clipboard` });
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
  };

  const filtered = allResources
    .filter((r) => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.university.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || r.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesDept = departmentFilter === "all" || r.subject.toLowerCase() === departmentFilter.toLowerCase();
      const matchesSem = semesterFilter === "all" || r.semester === parseInt(semesterFilter);
      return matchesSearch && matchesType && matchesDept && matchesSem;
    })
    .sort((a, b) => {
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasActiveFilters = debouncedSearch || typeFilter !== "all" || departmentFilter !== "all" || semesterFilter !== "all";

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore]);

  // Intersection observer for auto-loading
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <BrowseSkeleton />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Search Section */}
      <motion.section
        className="border-b border-border gradient-hero py-12 lg:py-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Browse <span className="text-gradient">Resources</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-lg mx-auto">
            Search across all departments, subjects, and study materials
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes, PYQs, subjects, universities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 pl-12 pr-4 text-base rounded-2xl bg-card border-border shadow-card focus:shadow-card-hover transition-shadow"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Trending:
            </span>
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSearch(topic)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:border-secondary/50 hover:text-secondary transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Filters Bar */}
      <section className="border-b border-border bg-card/50 py-4 md:sticky md:top-0 z-20 md:backdrop-blur-sm">
        <div className="container flex flex-wrap items-center gap-3">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-52 bg-background">
              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.slug} value={d.name.toLowerCase()}>{d.icon} {d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="pyq">PYQ</SelectItem>
              <SelectItem value="solutions">Solutions</SelectItem>
              <SelectItem value="cheat sheet">Cheat Sheet</SelectItem>
            </SelectContent>
          </Select>

          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(""); setTypeFilter("all"); setDepartmentFilter("all"); setSemesterFilter("all"); }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </section>

      {/* Quick Department Links */}
      {!hasActiveFilters && (
        <section className="py-8 border-b border-border">
          <div className="container">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-secondary" /> Browse by Department
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {departments.map((dept, i) => (
                <motion.div
                  key={dept.slug}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/subject/${dept.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
                  >
                    <span className="text-2xl">{dept.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-secondary transition-colors truncate">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground">{dept.resources.toLocaleString()} resources</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-10">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {visibleItems.length} of {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters && <span className="text-secondary font-medium"> (filtered)</span>}
            </p>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visibleItems.map((item, i) => (
                    <motion.div
                      key={`${item.title}-${i}`}
                      custom={i % ITEMS_PER_PAGE}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <Link to={`/resource/${i}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover block h-full">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs font-medium ${typeColors[item.type] || ""}`}>{item.type}</Badge>
                            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">Sem {item.semester}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-secondary">
                            <Star className="h-3.5 w-3.5 fill-secondary" />
                            <span className="text-xs font-semibold">{item.rating}</span>
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
                            <button onClick={(e) => handleBookmark(e, item.title)} className="p-1 rounded-md text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Bookmark">
                              <Bookmark className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={(e) => handleShare(e, item.title)} className="p-1 rounded-md text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Share">
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={(e) => handleDownload(e, item.title)} className="p-1 rounded-md text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Download">
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs text-muted-foreground ml-1 flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More / Sentinel */}
              {hasMore && (
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="gap-2 px-8"
                  >
                    {loadingMore ? (
                      <motion.div
                        className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                    ) : null}
                    {loadingMore ? "Loading..." : `Load More (${filtered.length - visibleCount} remaining)`}
                  </Button>
                </div>
              )}

              {!hasMore && filtered.length > ITEMS_PER_PAGE && (
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  You've reached the end — {filtered.length} resources shown
                </p>
              )}
            </>
          ) : (
              <EmptyState
                illustration={emptySearchImg}
                title="No resources found"
                description="Try adjusting your search terms or filters to find what you're looking for."
                actionLabel="Clear all filters"
                onAction={() => { setSearch(""); setTypeFilter("all"); setDepartmentFilter("all"); setSemesterFilter("all"); }}
              />
          )}
        </div>
      </section>
    </div>
    </PullToRefresh>
  );
};

export default Browse;
