import Navbar from "@/components/Navbar";
import { SubjectPageSkeleton } from "@/components/LoadingSkeleton";

import { useParams, Link } from "react-router-dom";
import { FileText, BookOpen, Users, TrendingUp, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

type SubjectInfo = { name: string; resources: number; popular: string; semester: number };

const departmentData: Record<string, { description: string; students: number; resources: number; trending: string; subjects: SubjectInfo[] }> = {
  "computer science": {
    description: "Data Structures, Algorithms, OS, DBMS, Networking, AI/ML, and more.",
    students: 12400, resources: 2340, trending: "Machine Learning",
    subjects: [
      { name: "Engineering Mathematics I", resources: 200, popular: "Complete Notes", semester: 1 },
      { name: "Engineering Physics", resources: 180, popular: "PYQ 2024", semester: 1 },
      { name: "Engineering Mathematics II", resources: 190, popular: "Formula Sheet", semester: 2 },
      { name: "Engineering Chemistry", resources: 160, popular: "Lab Manual", semester: 2 },
      { name: "Data Structures & Algorithms", resources: 420, popular: "Complete Notes by Priya S.", semester: 3 },
      { name: "Object Oriented Programming", resources: 260, popular: "Lab Manual", semester: 3 },
      { name: "Database Management Systems", resources: 350, popular: "PYQ Collection 2024", semester: 4 },
      { name: "Computer Networks", resources: 310, popular: "Formula Sheet", semester: 4 },
      { name: "Operating Systems", resources: 380, popular: "Mid Sem Solutions", semester: 5 },
      { name: "Software Engineering", resources: 180, popular: "Case Studies", semester: 5 },
      { name: "Compiler Design", resources: 150, popular: "Gate PYQs", semester: 6 },
      { name: "Machine Learning", resources: 290, popular: "Handwritten Notes", semester: 7 },
      { name: "Deep Learning & AI", resources: 180, popular: "Project Notes", semester: 8 },
      { name: "Cloud Computing", resources: 160, popular: "AWS Guide", semester: 8 },
    ],
  },
  "electrical engineering": {
    description: "Circuit Theory, Power Systems, Control Systems, Electrical Machines.",
    students: 8900, resources: 1890, trending: "Power Electronics",
    subjects: [
      { name: "Engineering Mathematics I", resources: 200, popular: "Complete Notes", semester: 1 },
      { name: "Basic Electrical Engineering", resources: 220, popular: "Practice Problems", semester: 2 },
      { name: "Circuit Theory", resources: 340, popular: "Complete Notes", semester: 3 },
      { name: "Signals & Systems", resources: 220, popular: "Practice Problems", semester: 4 },
      { name: "Power Systems", resources: 310, popular: "PYQ 2024", semester: 5 },
      { name: "Control Systems", resources: 290, popular: "Solutions Manual", semester: 5 },
      { name: "Electrical Machines", resources: 270, popular: "Formula Sheet", semester: 6 },
      { name: "Power Electronics", resources: 250, popular: "Handwritten Notes", semester: 7 },
      { name: "High Voltage Engineering", resources: 140, popular: "PYQ 2024", semester: 8 },
      { name: "Smart Grid Technology", resources: 120, popular: "Complete Notes", semester: 8 },
    ],
  },
  "mechanical engineering": {
    description: "Thermodynamics, Fluid Mechanics, Manufacturing, Strength of Materials.",
    students: 9200, resources: 1560, trending: "Thermodynamics",
    subjects: [
      { name: "Engineering Mechanics", resources: 200, popular: "Complete Notes", semester: 1 },
      { name: "Engineering Drawing", resources: 180, popular: "Practice Sheets", semester: 2 },
      { name: "Thermodynamics", resources: 380, popular: "Formula Sheet", semester: 3 },
      { name: "Fluid Mechanics", resources: 320, popular: "Complete Notes", semester: 4 },
      { name: "Strength of Materials", resources: 290, popular: "PYQ 2024", semester: 5 },
      { name: "Manufacturing Processes", resources: 250, popular: "Lab Manual", semester: 5 },
      { name: "Heat Transfer", resources: 180, popular: "Solved Examples", semester: 6 },
      { name: "Machine Design", resources: 140, popular: "Design Problems", semester: 7 },
      { name: "Automobile Engineering", resources: 130, popular: "Complete Notes", semester: 8 },
      { name: "Industrial Engineering", resources: 110, popular: "Case Studies", semester: 8 },
    ],
  },
  "electronics & comm.": {
    description: "Digital Electronics, Signal Processing, VLSI, Communication Systems.",
    students: 10500, resources: 2100, trending: "Embedded Systems",
    subjects: [
      { name: "Basic Electronics", resources: 200, popular: "Complete Notes", semester: 1 },
      { name: "Network Theory", resources: 190, popular: "PYQ 2024", semester: 2 },
      { name: "Digital Electronics", resources: 390, popular: "Handwritten Notes", semester: 3 },
      { name: "Signal Processing", resources: 350, popular: "PYQ 2024", semester: 4 },
      { name: "Communication Systems", resources: 280, popular: "Formula Sheet", semester: 5 },
      { name: "VLSI Design", resources: 300, popular: "Lab Experiments", semester: 6 },
      { name: "Embedded Systems", resources: 260, popular: "Project Notes", semester: 7 },
      { name: "Microprocessors", resources: 220, popular: "Complete Notes", semester: 6 },
      { name: "Wireless Communication", resources: 170, popular: "PYQ 2024", semester: 8 },
      { name: "IoT Systems", resources: 150, popular: "Project Guide", semester: 8 },
    ],
  },
  "civil engineering": {
    description: "Structural Analysis, Geotechnical, Surveying, Construction Management.",
    students: 5600, resources: 980, trending: "Structural Analysis",
    subjects: [
      { name: "Engineering Mechanics", resources: 180, popular: "Complete Notes", semester: 1 },
      { name: "Surveying", resources: 180, popular: "Field Manual", semester: 3 },
      { name: "Fluid Mechanics", resources: 120, popular: "Formula Sheet", semester: 4 },
      { name: "Structural Analysis", resources: 240, popular: "Practice Problems", semester: 5 },
      { name: "Geotechnical Engineering", resources: 200, popular: "Complete Notes", semester: 6 },
      { name: "Construction Management", resources: 160, popular: "Case Studies", semester: 7 },
      { name: "Environmental Engineering", resources: 140, popular: "Complete Notes", semester: 8 },
      { name: "Transportation Engineering", resources: 120, popular: "PYQ 2024", semester: 8 },
    ],
  },
  "chemical engineering": {
    description: "Process Design, Reaction Engineering, Mass Transfer, Thermodynamics.",
    students: 4800, resources: 1240, trending: "Process Control",
    subjects: [
      { name: "Engineering Chemistry", resources: 180, popular: "Lab Manual", semester: 1 },
      { name: "Chemical Thermodynamics", resources: 200, popular: "Formula Sheet", semester: 3 },
      { name: "Mass Transfer", resources: 230, popular: "Complete Notes", semester: 4 },
      { name: "Reaction Engineering", resources: 250, popular: "Solved Problems", semester: 5 },
      { name: "Chemical Process Design", resources: 280, popular: "Design Notes", semester: 6 },
      { name: "Process Control", resources: 180, popular: "PYQ Collection", semester: 7 },
      { name: "Polymer Engineering", resources: 130, popular: "Complete Notes", semester: 8 },
      { name: "Biochemical Engineering", resources: 110, popular: "Lab Manual", semester: 8 },
    ],
  },
  "information technology": {
    description: "Web Development, Cloud Computing, Cybersecurity, Software Engineering.",
    students: 11200, resources: 1780, trending: "Cloud Computing",
    subjects: [
      { name: "Programming Fundamentals", resources: 220, popular: "Lab Manual", semester: 1 },
      { name: "Data Structures", resources: 300, popular: "Complete Notes", semester: 3 },
      { name: "Web Technologies", resources: 340, popular: "Full Stack Notes", semester: 4 },
      { name: "Cloud Computing", resources: 300, popular: "AWS Guide", semester: 5 },
      { name: "Cybersecurity", resources: 280, popular: "Lab Manual", semester: 6 },
      { name: "Data Mining", resources: 240, popular: "Algorithm Notes", semester: 7 },
      { name: "Software Engineering", resources: 220, popular: "Case Studies", semester: 5 },
      { name: "Mobile App Development", resources: 200, popular: "Project Guide", semester: 7 },
      { name: "Big Data Analytics", resources: 170, popular: "Complete Notes", semester: 8 },
      { name: "DevOps & Automation", resources: 150, popular: "Lab Manual", semester: 8 },
    ],
  },
  "industrial engineering": {
    description: "Operations Research, Quality Control, Supply Chain, Ergonomics.",
    students: 3800, resources: 870, trending: "Supply Chain",
    subjects: [
      { name: "Engineering Mathematics", resources: 180, popular: "Complete Notes", semester: 1 },
      { name: "Operations Research", resources: 220, popular: "Solutions Manual", semester: 4 },
      { name: "Quality Control", resources: 200, popular: "Complete Notes", semester: 5 },
      { name: "Supply Chain Management", resources: 180, popular: "Case Studies", semester: 6 },
      { name: "Ergonomics", resources: 150, popular: "Lab Manual", semester: 6 },
      { name: "Production Planning", resources: 120, popular: "PYQ Collection", semester: 7 },
      { name: "Facility Design", resources: 100, popular: "Case Studies", semester: 8 },
      { name: "Project Management", resources: 130, popular: "Complete Notes", semester: 8 },
    ],
  },
};

const SubjectPage = () => {
  const { slug } = useParams();
  const department = slug?.replace(/-/g, " ") || "";
  const data = departmentData[department];
  const displayName = department.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [loading, setLoading] = useState(true);
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!displayName) return;
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/resources/getAllResources", {
          params: { department: displayName }
        });
        
        const counts: Record<string, number> = {};
        const resources = res.data.resources || [];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources.forEach((r: any) => {
          const subj = r.subject;
          if (subj) {
            // Try to match the exact name, or case-insensitive
            const matchingSubject = data?.subjects.find(s => s.name.toLowerCase() === subj.toLowerCase());
            const keyName = matchingSubject ? matchingSubject.name : subj;
            counts[keyName] = (counts[keyName] || 0) + 1;
          }
        });
        
        setResourceCounts(counts);
        setTotalResources(resources.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [displayName, data]);
  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h2 className="mt-4 font-display text-lg font-semibold text-foreground">Department not found</h2>
          <Link to="/browse"><Button className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">Browse All</Button></Link>
        </div>
      </div>
    );
  }

  const allSemesters = [...new Set(data.subjects.map(s => s.semester))].sort((a, b) => a - b);
  const filteredSubjects = selectedSemester === "All"
    ? data.subjects
    : data.subjects.filter(s => s.semester === parseInt(selectedSemester));

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
          <p className="mt-2 max-w-2xl text-muted-foreground">{data.description}</p>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-secondary" />
              <span><strong className="text-foreground">{(totalResources > 0 ? totalResources : data.resources).toLocaleString()}</strong> resources</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-secondary" />
              <span><strong className="text-foreground">{data.students.toLocaleString()}</strong> students</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span>Trending: <strong className="text-foreground">{data.trending}</strong></span>
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
                        <p className="mt-1 text-xs text-muted-foreground">{totalResources > 0 ? (resourceCounts[sub.name] || 0) : sub.resources} resources</p>
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
