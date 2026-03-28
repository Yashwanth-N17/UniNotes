import Navbar from "@/components/Navbar";
import { SubjectPageSkeleton } from "@/components/LoadingSkeleton";

import { useParams, Link } from "react-router-dom";
import { FileText, BookOpen, TrendingUp, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

type SubjectInfo = { name: string; resources: number; popular: string; semester: number };



const SubjectPage = () => {
  const { slug } = useParams();
  const department = slug?.replace(/-/g, " ") || "";
  const displayName = department.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [loading, setLoading] = useState(true);
  const [dynamicSubjects, setDynamicSubjects] = useState<SubjectInfo[]>([]);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!displayName) return;
      try {
        setLoading(true);
        const res = await api.get("/api/resources/", {
          params: { department: displayName }
        });

        
        const resources = res.data.data || res.data.resources || [];
        
        const subjectMap = new Map<string, SubjectInfo>();
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources.forEach((r: any) => {
          const subjName = r.subject || "General";
          if (!subjectMap.has(subjName)) {
            subjectMap.set(subjName, {
              name: subjName,
              resources: 1,
              popular: r.resourceType || "Notes",
              semester: r.semester || 1
            });
          } else {
             const existing = subjectMap.get(subjName)!;
             existing.resources += 1;
          }
        });
        
        setDynamicSubjects(Array.from(subjectMap.values()));
        setTotalResources(resources.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [displayName]);

  const allSemesters = [...new Set(dynamicSubjects.map(s => s.semester))].sort((a, b) => a - b);
  const filteredSubjects = selectedSemester === "All"
    ? dynamicSubjects
    : dynamicSubjects.filter(s => s.semester === parseInt(selectedSemester));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <SubjectPageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-card py-10">
        <div className="container">
          <Link to="/browse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Browse
          </Link>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-gradient">{displayName}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Study materials and resources for {displayName} students.</p>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-secondary" />
              <span><strong className="text-foreground">{totalResources.toLocaleString()}</strong> resources</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span>Trending: <strong className="text-foreground">{dynamicSubjects.length > 0 ? dynamicSubjects[0].name : "General Notes"}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-foreground">Subjects in {displayName}</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSemester("All")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border ${
                  selectedSemester === "All"
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-card"
                    : "bg-card text-muted-foreground border-border hover:border-secondary/50 hover:text-foreground"
                }`}
              >
                All Semesters
              </button>
              {allSemesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(String(sem))}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border ${
                    selectedSemester === String(sem)
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-card"
                      : "bg-card text-muted-foreground border-border hover:border-secondary/50 hover:text-foreground"
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No subjects found for this semester.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {filteredSubjects.map((sub) => {
                const subSlug = sub.name.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
                return (
                  <Link
                    key={sub.name}
                    to={`/subject/${slug}/${subSlug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-secondary transition-colors">{sub.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{sub.resources} resources</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-secondary/10 text-secondary border-secondary/20 whitespace-nowrap">Sem {sub.semester}</Badge>
                          <span className="text-xs text-muted-foreground">Popular: {sub.popular}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
};

export default SubjectPage;
