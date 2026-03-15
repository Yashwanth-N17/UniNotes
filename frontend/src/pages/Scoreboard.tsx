import Navbar from "@/components/Navbar";
import { ScoreboardSkeleton } from "@/components/LoadingSkeleton";

import { Trophy, Medal, Upload, Star, TrendingUp, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const leaderboard = [
  { rank: 1, name: "Priya Sharma", university: "IIT Delhi", uploads: 87, downloads: 12400, rating: 4.9, branch: "Computer Science", semester: 6 },
  { rank: 2, name: "Rahul Kumar", university: "NIT Trichy", uploads: 72, downloads: 9800, rating: 4.8, branch: "Electrical Engineering", semester: 5 },
  { rank: 3, name: "Ananya Menon", university: "BITS Pilani", uploads: 65, downloads: 8900, rating: 4.8, branch: "Electronics & Comm.", semester: 7 },
  { rank: 4, name: "Vikram Patel", university: "IIT Bombay", uploads: 58, downloads: 7600, rating: 4.7, branch: "Mechanical Engineering", semester: 6 },
  { rank: 5, name: "Sneha Reddy", university: "IIT Madras", uploads: 52, downloads: 6300, rating: 4.9, branch: "Civil Engineering", semester: 4 },
  { rank: 6, name: "Arjun Das", university: "Delhi University", uploads: 48, downloads: 5100, rating: 4.6, branch: "Information Technology", semester: 5 },
  { rank: 7, name: "Kavya Lakshmi", university: "VIT Vellore", uploads: 44, downloads: 4800, rating: 4.7, branch: "Chemical Engineering", semester: 3 },
  { rank: 8, name: "Rohan Tripathi", university: "IIT Kanpur", uploads: 41, downloads: 4200, rating: 4.8, branch: "Computer Science", semester: 8 },
  { rank: 9, name: "Meera Joshi", university: "IIT Kharagpur", uploads: 38, downloads: 3900, rating: 4.6, branch: "Electrical Engineering", semester: 6 },
  { rank: 10, name: "Siddharth Nair", university: "NIT Surathkal", uploads: 35, downloads: 3500, rating: 4.5, branch: "Mechanical Engineering", semester: 4 },
];

const semesters = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];

const getRankStyle = (rank: number) => {
  if (rank === 1) return "border-[hsl(45,93%,47%)] shadow-[0_0_20px_hsl(45,93%,47%,0.3)] bg-[hsl(45,93%,47%,0.08)]"; // Gold
  if (rank === 2) return "border-[hsl(210,11%,71%)] shadow-[0_0_15px_hsl(210,11%,71%,0.2)] bg-[hsl(210,11%,71%,0.08)]"; // Silver
  if (rank === 3) return "border-[hsl(25,67%,52%)] shadow-[0_0_15px_hsl(25,67%,52%,0.2)] bg-[hsl(25,67%,52%,0.08)]"; // Bronze
  return "border-border bg-card";
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-[hsl(45,93%,47%)] fill-[hsl(45,93%,47%)]" />; // Gold
  if (rank === 2) return <Medal className="h-6 w-6 text-[hsl(210,11%,71%)] fill-[hsl(210,11%,71%)]" />; // Silver
  if (rank === 3) return <Medal className="h-6 w-6 text-[hsl(25,67%,52%)] fill-[hsl(25,67%,52%)]" />; // Bronze
  return <span className="font-display text-lg font-bold text-muted-foreground">#{rank}</span>;
};

const Scoreboard = () => {
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = selectedSemester === "All"
    ? leaderboard
    : leaderboard.filter(u => u.semester === parseInt(selectedSemester));

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ScoreboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border gradient-hero py-12">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-card mb-4">
            <Trophy className="h-4 w-4 text-secondary" />
            Community Leaderboard
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Top <span className="text-gradient">Contributors</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-lg mx-auto">
            Celebrating students who share the most and help others succeed in their exams
          </p>

          {/* Semester Filter */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border ${
                  selectedSemester === sem
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-card"
                    : "bg-card text-muted-foreground border-border hover:border-secondary/50 hover:text-foreground"
                }`}
              >
                {sem === "All" ? "All Semesters" : `Sem ${sem}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top 3 Podium - 2nd, 1st (center+elevated), 3rd */}
      <section className="py-12">
        <div className="container">
          {podiumOrder.length >= 3 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto mb-12 items-end">
              {podiumOrder.map((user) => (
                <div
                  key={user.rank}
                  className={`relative rounded-2xl border-2 p-3 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover ${getRankStyle(user.rank)} ${user.rank === 1 ? "-mt-4 sm:-mt-6 scale-[1.02] sm:scale-105 order-2" : user.rank === 2 ? "order-1" : "order-3"}`}
                >
                  {/* Rank badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-card border border-border shadow-card">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="mt-4 mb-1 font-display text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {user.rank === 1 ? "1st Place" : user.rank === 2 ? "2nd Place" : "3rd Place"}
                  </div>

                  <Avatar className="mx-auto mt-3 h-10 w-10 sm:h-14 sm:w-14 border-2 border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-display font-bold text-[10px] sm:text-base">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="mt-2 font-display font-bold text-foreground text-[11px] sm:text-base leading-tight truncate">{user.name}</h3>
                  <p className="text-[9px] sm:text-xs text-muted-foreground truncate mt-0.5">{user.university}</p>

                  <div className="mt-2 sm:mt-3 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Upload className="h-3 w-3 text-secondary" />
                      <span className="font-display text-sm sm:text-lg font-bold text-foreground">{user.uploads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="font-display text-xs sm:text-sm font-semibold text-foreground">{user.rating}</span>
                    </div>
                    <div className="text-[9px] sm:text-xs text-muted-foreground">
                      {user.downloads.toLocaleString()} downloads
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : podiumOrder.length > 0 ? (
            <div className="flex justify-center gap-6 mb-12">
              {podiumOrder.map((user) => (
                <div key={user.rank} className={`relative rounded-2xl border-2 p-6 text-center shadow-card max-w-xs ${getRankStyle(user.rank)}`}>
                  <Avatar className="mx-auto h-16 w-16 border-2 border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-display font-bold text-lg">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-3 font-display font-bold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.university} • Sem {user.semester}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No contributors found for this semester.</div>
          )}

          {/* Full List */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Full Rankings</h2>
            <div className="space-y-3">
              {rest.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No more contributors found.</p>
              )}
              {rest.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 ${getRankStyle(user.rank)}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-display font-semibold text-sm">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground truncate">{user.name}</h3>
                    <p className="text-xs text-muted-foreground">{user.university} • {user.branch} • Sem {user.semester}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-display font-bold text-foreground flex items-center gap-1"><Upload className="h-3.5 w-3.5 text-secondary" />{user.uploads}</div>
                      <div className="text-xs text-muted-foreground">uploads</div>
                    </div>
                    <div className="text-center">
                      <div className="font-display font-bold text-foreground flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-secondary text-secondary" />{user.rating}</div>
                      <div className="text-xs text-muted-foreground">rating</div>
                    </div>
                    <div className="text-center">
                      <div className="font-display font-bold text-foreground">{user.downloads.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">downloads</div>
                    </div>
                  </div>
                  <div className="sm:hidden text-right">
                    <div className="font-display font-bold text-foreground text-sm">{user.uploads}</div>
                    <div className="text-xs text-muted-foreground">uploads</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Scoreboard;
