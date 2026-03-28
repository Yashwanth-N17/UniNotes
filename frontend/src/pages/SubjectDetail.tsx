import Navbar from "@/components/Navbar";
import { SubjectDetailSkeleton } from "@/components/LoadingSkeleton";

import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Star, Clock, ArrowLeft, BookOpen, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface ResourceItem {
  id: string;
  title: string;
  subjectSlug: string;
  dept: string;
  author: string;
  type: string;
  rating: number;
  downloads: number;
  time: string;
  university: string;
  semester: number;
  year: number;
  difficulty: "Easy" | "Medium" | "Hard" | string;
}


const typeColors: Record<string, string> = {
  Notes: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  PYQ: "bg-secondary/10 text-secondary border-secondary/20",
  Solutions: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  "Cheat Sheet": "bg-secondary/10 text-secondary border-secondary/20",
};

const ResourceCard = ({ item, index }: { item: ResourceItem; index: number }) => (
  <Link
    to={`/resource/${item.id}`}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full flex flex-col"
  >
    <div className="mb-3 flex items-start justify-between">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant="outline" className={`text-xs font-medium ${typeColors[item.type] || ""}`}>{item.type}</Badge>
        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border whitespace-nowrap">Sem {item.semester}</Badge>
      </div>
      <div className="flex items-center gap-1 text-secondary">
        <Star className="h-3.5 w-3.5 fill-secondary" />
        <span className="text-xs font-semibold">{item.rating}</span>
      </div>
    </div>
    <div className="mb-3 flex items-start gap-3 flex-1">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-secondary transition-colors line-clamp-2">{item.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{item.university} • {item.year}</p>
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
      <span className="text-xs text-muted-foreground">by {item.author}</span>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Download className="h-3 w-3" />{item.downloads}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
      </div>
    </div>
  </Link>
);

const SubjectDetail = () => {
  const { slug, subjectSlug } = useParams();
  const subjectName = (subjectSlug || "").replace(/-/g, " ").replace(/and/g, "&").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const deptName = (slug || "").replace(/-/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const [semesterFilter, setSemesterFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);

  const [baseResources, setBaseResources] = useState<ResourceItem[]>([]);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/resources/", {
        params: {
          department: deptName,
          subject: subjectName
        }
      });
      const resourcesData = res.data.data || res.data.resources || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: ResourceItem[] = resourcesData.map((r: any) => ({
        id: r.id,
        title: r.title || "Untitled",
        subjectSlug: subjectSlug || "",
        dept: slug || "",
        author: r.user?.fullname || "Unknown",
        type: r.resourceType || "Notes",
        rating: 4.5,
        downloads: Math.floor(Math.random() * 500) + 100,
        time: new Date(r.createdAt).toLocaleDateString(),
        university: r.user?.university || "Unknown",
        semester: 1,
        year: new Date(r.createdAt).getFullYear(),
        difficulty: "Medium"
      }));
      setBaseResources(mapped);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  }, [deptName, subjectName, subjectSlug, slug]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const resources = baseResources
    .filter((r) => {
      const matchSem = semesterFilter === "all" || r.semester === parseInt(semesterFilter);
      const matchYear = yearFilter === "all" || r.year === parseInt(yearFilter);
      const matchDiff = difficultyFilter === "all" || r.difficulty === difficultyFilter;
      return matchSem && matchYear && matchDiff;
    })
    .sort((a, b) => {
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const notes = resources.filter((r) => r.type === "Notes");
  const pyqs = resources.filter((r) => r.type === "PYQ");
  const solutions = resources.filter((r) => r.type === "Solutions");
  const cheatSheets = resources.filter((r) => r.type === "Cheat Sheet");

  const hasActiveFilters = semesterFilter !== "all" || yearFilter !== "all" || difficultyFilter !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <SubjectDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-card py-10">
        <div className="container">
          <Link to={`/subject/${slug}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to {deptName}
          </Link>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-gradient">{subjectName}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">{deptName} • {resources.length} resources available</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-secondary" />
            <span><strong className="text-foreground">{resources.length}</strong> study materials uploaded by students</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card/50 py-4">
        <div className="container flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />

          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-full sm:w-36 bg-background">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full sm:w-32 bg-background">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {[2024, 2023, 2022, 2021].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-36 bg-background">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
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
              onClick={() => { setSemesterFilter("all"); setYearFilter("all"); setDifficultyFilter("all"); }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-muted">
              <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
              <TabsTrigger value="pyq">PYQs ({pyqs.length})</TabsTrigger>
              <TabsTrigger value="solutions">Solutions ({solutions.length})</TabsTrigger>
              <TabsTrigger value="cheatsheet">Cheat Sheets ({cheatSheets.length})</TabsTrigger>
            </TabsList>

            {[
              { value: "all", items: resources },
              { value: "notes", items: notes },
              { value: "pyq", items: pyqs },
              { value: "solutions", items: solutions },
              { value: "cheatsheet", items: cheatSheets },
            ].map(({ value, items }) => (
              <TabsContent key={value} value={value}>
                {items.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => <ResourceCard key={i} item={item} index={i} />)}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">No {value === "all" ? "resources" : value} found{hasActiveFilters ? " with selected filters" : " for this subject"}</p>
                    {hasActiveFilters ? (
                      <Button variant="outline" className="mt-3" size="sm" onClick={() => { setSemesterFilter("all"); setYearFilter("all"); setDifficultyFilter("all"); }}>
                        Clear filters
                      </Button>
                    ) : (
                      <Link to="/upload"><Button className="mt-3 bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">Upload</Button></Link>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default SubjectDetail;
