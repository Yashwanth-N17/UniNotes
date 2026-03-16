import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUser } from "@/hooks/use-user";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Download, Star, Clock, Upload, Award, TrendingUp, BookOpen, Edit, MapPin, GraduationCap, Calendar, Eye, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";


const mockStats = {
  initials: "PS",
  semester: 6,
  enrollmentNo: "2022CSE1045",
  joinDate: "Aug 2024",
  rank: 3,
  uploads: 24,
  totalDownloads: 18400,
  avgRating: 4.8,
  totalViews: 42300,
  bookmarks: 15,
};

const badges = [
  { name: "Top Contributor", icon: Award, color: "bg-secondary/10 text-secondary" },
  { name: "100+ Downloads", icon: Download, color: "bg-primary/10 text-primary" },
  { name: "Rising Star", icon: TrendingUp, color: "bg-secondary/10 text-secondary" },
  { name: "Study Guru", icon: BookOpen, color: "bg-primary/10 text-primary" },
];

const uploadHistory = [
  { title: "Data Structures & Algorithms - Complete Notes", type: "Notes", downloads: 1240, rating: 4.8, date: "2 hours ago" },
  { title: "Computer Networks - Formula Sheet", type: "Cheat Sheet", downloads: 2100, rating: 4.9, date: "1 day ago" },
  { title: "Machine Learning - Handwritten Notes", type: "Notes", downloads: 670, rating: 4.7, date: "3 days ago" },
  { title: "DBMS - PYQ Collection 2024", type: "PYQ", downloads: 780, rating: 4.7, date: "1 week ago" },
  { title: "Operating Systems - Mid Sem Solutions", type: "Solutions", downloads: 540, rating: 4.6, date: "2 weeks ago" },
  { title: "Discrete Mathematics - Notes", type: "Notes", downloads: 920, rating: 4.8, date: "3 weeks ago" },
];

const downloadHistory = [
  { title: "Advanced Algorithms - Complete Notes", type: "Notes", author: "Rahul K.", date: "1 hour ago", university: "NIT Trichy" },
  { title: "Linear Algebra - PYQ 2024", type: "PYQ", author: "Ananya M.", date: "5 hours ago", university: "BITS Pilani" },
  { title: "Computer Architecture - Cheat Sheet", type: "Cheat Sheet", author: "Vikram P.", date: "1 day ago", university: "IIT Bombay" },
  { title: "Software Engineering - Notes", type: "Notes", author: "Kavya L.", date: "2 days ago", university: "VIT Vellore" },
  { title: "Compiler Design - Mid Sem Solutions", type: "Solutions", author: "Sneha R.", date: "3 days ago", university: "IIT Madras" },
];

const activityTimeline = [
  { action: "Uploaded", item: "DSA - Complete Notes", time: "2 hours ago", icon: Upload, color: "text-secondary" },
  { action: "Downloaded", item: "Advanced Algorithms - Notes", time: "1 hour ago", icon: Download, color: "text-primary" },
  { action: "Rated 5 stars", item: "Linear Algebra - PYQ 2024", time: "5 hours ago", icon: Star, color: "text-secondary" },
  { action: "Bookmarked", item: "Compiler Design - Solutions", time: "1 day ago", icon: BookOpen, color: "text-primary" },
  { action: "Uploaded", item: "CN - Formula Sheet", time: "1 day ago", icon: Upload, color: "text-secondary" },
  { action: "Downloaded", item: "Computer Architecture - Sheet", time: "1 day ago", icon: Download, color: "text-primary" },
  { action: "Rated 4 stars", item: "Software Engineering - Notes", time: "2 days ago", icon: Star, color: "text-secondary" },
  { action: "Uploaded", item: "ML - Handwritten Notes", time: "3 days ago", icon: Upload, color: "text-secondary" },
];

const monthlyData = [
  { month: "Sep", uploads: 2, downloads: 1200 },
  { month: "Oct", uploads: 4, downloads: 3400 },
  { month: "Nov", uploads: 3, downloads: 2800 },
  { month: "Dec", uploads: 5, downloads: 4200 },
  { month: "Jan", uploads: 4, downloads: 3600 },
  { month: "Feb", uploads: 6, downloads: 3200 },
];

const typeDistribution = [
  { name: "Notes", value: 12, color: "hsl(220, 60%, 20%)" },
  { name: "PYQ", value: 6, color: "hsl(36, 90%, 55%)" },
  { name: "Solutions", value: 4, color: "hsl(220, 60%, 40%)" },
  { name: "Cheat Sheet", value: 2, color: "hsl(36, 90%, 70%)" },
];

const typeColors: Record<string, string> = {
  Notes: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  PYQ: "bg-secondary/10 text-secondary border-secondary/20",
  Solutions: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-primary/20 dark:border-primary/30",
  "Cheat Sheet": "bg-secondary/10 text-secondary border-secondary/20",
};

const Profile = () => {
  const { data: userData, isLoading } = useUser();

  const user = {
    ...mockStats,
    name: userData?.fullname || "Loading...",
    university: userData?.university || "...",
    branch: userData?.department || "...",
    year: userData?.year ? `${userData?.year}${userData?.year === 1 ? 'st' : userData?.year === 2 ? 'nd' : userData?.year === 3 ? 'rd' : 'th'} Year` : "...",
    bio: userData?.bio || "No bio yet.",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Profile Header */}
      <section className="border-b border-border bg-card py-10">
        <div className="container">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex justify-center sm:justify-start">
              <Avatar className="h-24 w-24 border-4 border-secondary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{user.name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" />{user.branch}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{user.university}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />Sem {user.semester} • {user.year}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {user.joinDate}</span>
                  </div>
                </div>
                <Link to="/profile/edit">
                  <Button variant="outline" className="gap-2 self-start">
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              </div>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">{user.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Rank", value: `#${user.rank}`, icon: Award, accent: true },
              { label: "Uploads", value: user.uploads, icon: Upload, accent: false },
              { label: "Downloads", value: user.totalDownloads.toLocaleString(), icon: Download, accent: false },
              { label: "Views", value: user.totalViews.toLocaleString(), icon: Eye, accent: false },
              { label: "Avg Rating", value: user.avgRating, icon: Star, accent: true },
              { label: "Bookmarks", value: user.bookmarks, icon: BookOpen, accent: false },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-background p-4 text-center">
                <stat.icon className={`mx-auto h-5 w-5 ${stat.accent ? "text-secondary" : "text-muted-foreground"}`} />
                <p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="border-b border-border py-6">
        <div className="container">
          <h3 className="mb-3 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div key={b.name} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${b.color}`}>
                <b.icon className="h-4 w-4" /> {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-6 sm:py-10">
        <div className="container">
          <Tabs defaultValue="uploads" className="w-full">
            <TabsList className="mb-4 sm:mb-6 bg-muted w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
              <TabsTrigger value="uploads" className="text-xs sm:text-sm">Uploads</TabsTrigger>
              <TabsTrigger value="downloads" className="text-xs sm:text-sm">Downloads</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            </TabsList>

            {/* Uploads Tab */}
            <TabsContent value="uploads">
              <div className="space-y-2 sm:space-y-3">
                {uploadHistory.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-4 transition-all hover:shadow-card cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-foreground text-xs sm:text-sm truncate">{item.title}</h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                          <Badge variant="outline" className={`text-[10px] sm:text-xs ${typeColors[item.type] || ""}`}>{item.type}</Badge>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
                          <span className="flex items-center gap-1"><Download className="h-3 w-3" />{item.downloads}</span>
                          <span className="flex items-center gap-1 text-secondary"><Star className="h-3 w-3 fill-secondary" />{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads">
              <div className="space-y-2 sm:space-y-3">
                {downloadHistory.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-4 transition-all hover:shadow-card cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-foreground text-xs sm:text-sm truncate">{item.title}</h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                          <Badge variant="outline" className={`text-[10px] sm:text-xs ${typeColors[item.type] || ""}`}>{item.type}</Badge>
                          <span>by {item.author}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="relative">
                <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-0">
                  {activityTimeline.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-3 sm:gap-4 pb-5 sm:pb-6 last:pb-0">
                      <div className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card ${item.color}`}>
                        <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-xs sm:text-sm text-foreground">
                          <span className="font-medium">{item.action}</span>{" "}
                          <span className="text-muted-foreground">{item.item}</span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              {/* Quick Stats - compact cards */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 mb-4 sm:mb-6">
                {[
                  { label: "This Month", value: "6 uploads", change: "+50%" },
                  { label: "Avg Downloads", value: "767/res", change: "+12%" },
                  { label: "Best Resource", value: "CN Sheet", change: "2.1K dl" },
                  { label: "Response Rate", value: "92%", change: "comments" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-card p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="mt-0.5 sm:mt-1 text-sm sm:text-base font-bold text-foreground">{stat.value}</p>
                    <p className="text-[9px] sm:text-[10px] text-secondary">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                  <h4 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-foreground">Uploads</h4>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 46%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(220 10% 46%)", fontSize: 9 }} axisLine={false} tickLine={false} width={16} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid hsl(40 15% 88%)", background: "hsl(0 0% 100%)" }} />
                      <Bar dataKey="uploads" fill="hsl(220 60% 20%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                  <h4 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-foreground">Downloads</h4>
                  <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 46%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(220 10% 46%)", fontSize: 9 }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid hsl(40 15% 88%)", background: "hsl(0 0% 100%)" }} />
                      <defs>
                        <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(36 90% 55%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(36 90% 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="downloads" stroke="hsl(36 90% 55%)" fill="url(#dlGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 rounded-xl border border-border bg-card p-3 sm:p-4">
                <h4 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-foreground">Upload Distribution</h4>
                <div className="flex items-center gap-3 sm:gap-4">
                  <ResponsiveContainer width={100} height={100}>
                    <PieChart>
                      <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" paddingAngle={3}>
                        {typeDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {typeDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-1 text-[10px] sm:text-xs">
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Profile;
