import { FileText, Download, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const uploads = [
  { title: "Data Structures & Algorithms - Complete Notes", subject: "Computer Science", author: "Priya S.", type: "Notes", rating: 4.8, downloads: 1240, time: "2 hours ago" },
  { title: "Engineering Mathematics III - PYQ 2024", subject: "Mechanical Engineering", author: "Rahul K.", type: "PYQ", rating: 4.9, downloads: 890, time: "5 hours ago" },
  { title: "Digital Electronics - Handwritten Notes", subject: "Electronics & Comm.", author: "Ananya M.", type: "Notes", rating: 4.7, downloads: 670, time: "8 hours ago" },
  { title: "Operating Systems - Mid Sem Solutions", subject: "Computer Science", author: "Vikram P.", type: "Solutions", rating: 4.6, downloads: 540, time: "12 hours ago" },
  { title: "Thermodynamics - Formula Sheet", subject: "Mechanical Engineering", author: "Sneha R.", type: "Cheat Sheet", rating: 4.9, downloads: 2100, time: "1 day ago" },
  { title: "Power Systems - Chapter Summaries", subject: "Electrical Engineering", author: "Arjun D.", type: "Notes", rating: 4.5, downloads: 430, time: "1 day ago" },
];

const typeColors: Record<string, string> = {
  Notes: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  PYQ: "bg-secondary/10 text-secondary border-secondary/20",
  Solutions: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  "Cheat Sheet": "bg-secondary/10 text-secondary border-secondary/20",
};

const RecentUploads = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <ScrollReveal>
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Recently <span className="text-gradient">Uploaded</span>
              </h2>
              <p className="mt-2 text-muted-foreground">Fresh engineering study materials from fellow students</p>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-secondary hover:underline">
              View all →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uploads.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.08} distance={30}>
              <div className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer">
                <div className="mb-3 flex items-start justify-between">
                  <Badge variant="outline" className={`text-xs font-medium ${typeColors[item.type] || ""}`}>
                    {item.type}
                  </Badge>
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
                    <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.subject}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">by {item.author}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{item.downloads}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentUploads;
