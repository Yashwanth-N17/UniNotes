import { BookOpen, Upload, Trophy, User, LogIn, LogOut, Search, X, FileText, Star, ArrowRight, Menu, Home, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const allResources = [
  { title: "Data Structures & Algorithms - Complete Notes", subject: "Computer Science", type: "Notes", rating: 4.8, id: 0 },
  { title: "Engineering Mathematics III - PYQ 2024", subject: "Mechanical Engineering", type: "PYQ", rating: 4.9, id: 1 },
  { title: "Digital Electronics - Handwritten Notes", subject: "Electronics & Comm.", type: "Notes", rating: 4.7, id: 2 },
  { title: "Operating Systems - Mid Sem Solutions", subject: "Computer Science", type: "Solutions", rating: 4.6, id: 3 },
  { title: "Thermodynamics - Formula Sheet", subject: "Mechanical Engineering", type: "Cheat Sheet", rating: 4.9, id: 4 },
  { title: "Power Systems - Chapter Summaries", subject: "Electrical Engineering", type: "Notes", rating: 4.5, id: 5 },
  { title: "Database Management Systems - Lab Manual", subject: "Information Technology", type: "Notes", rating: 4.7, id: 6 },
  { title: "Structural Analysis - Practice Problems", subject: "Civil Engineering", type: "PYQ", rating: 4.8, id: 7 },
  { title: "Chemical Process Design - Notes", subject: "Chemical Engineering", type: "Notes", rating: 4.6, id: 8 },
  { title: "Machine Learning - Complete Guide", subject: "Computer Science", type: "Notes", rating: 4.9, id: 9 },
  { title: "Fluid Mechanics - Solved Examples", subject: "Civil Engineering", type: "Solutions", rating: 4.5, id: 10 },
  { title: "VLSI Design - Lab Experiments", subject: "Electronics & Comm.", type: "Notes", rating: 4.7, id: 11 },
];

const baseMobileNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Browse", path: "/browse" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Trophy, label: "Scoreboard", path: "/scoreboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading: userLoading } = useUser();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      queryClient.clear();
    } catch (error) {
      console.error(error); 
      queryClient.clear(); 
    } finally {
      localStorage.removeItem("accessToken");
      toast({
        title: "Logged Out",
        description: "You have successfully signed out.",
      });
      navigate("/login");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim().length >= 2
    ? allResources.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subject.toLowerCase().includes(query.toLowerCase()) ||
        r.type.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  const handleSelect = (id: number) => {
    closeSearch();
    navigate(`/resource/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchAll = () => {
    closeSearch();
    navigate(`/browse?q=${encodeURIComponent(query)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter" && query.trim()) handleSearchAll();
  };

  const handleMobileNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen, openSearch, closeSearch]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen, closeSearch]);

  return (
    <nav className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl transition-all duration-300 ${scrolled ? "border-border shadow-card" : "border-transparent"}`} role="navigation" aria-label="Main navigation">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="UniNotes home">
          <motion.div
            whileHover={{ rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
            aria-hidden="true"
          >
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300">UniNotes</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={dropdownRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search resources... (⌘K)"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (!searchOpen) setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleKeyDown}
              className="h-9 pl-9 pr-8 text-sm rounded-xl bg-muted/50 border-border focus:bg-card transition-colors"
              aria-label="Search resources"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchOpen && query.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-elevated overflow-hidden z-50"
              >
                {results.length > 0 ? (
                  <>
                    <div className="p-1.5">
                      {results.map((r, idx) => (
                        <motion.button
                          key={r.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleSelect(r.id)}
                          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                            <p className="text-xs text-muted-foreground">{r.subject} • {r.type}</p>
                          </div>
                          <div className="flex items-center gap-0.5 text-secondary shrink-0">
                            <Star className="h-3 w-3 fill-secondary" />
                            <span className="text-xs font-semibold">{r.rating}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <button
                      onClick={handleSearchAll}
                      className="flex items-center justify-center gap-2 w-full border-t border-border px-3 py-2.5 text-sm font-medium text-secondary hover:bg-muted/40 transition-colors"
                    >
                      View all results for "{query}" <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                    <button
                      onClick={handleSearchAll}
                      className="mt-2 text-xs text-secondary hover:underline"
                    >
                      Browse all resources →
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex shrink-0">
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/scoreboard" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="View scoreboard">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Scoreboard</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Scoreboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/profile" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="View profile">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors p-0 overflow-hidden">
                  {isLoggedIn ? (
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                        {user.fullname.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
          {isLoggedIn ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" aria-label="Logout from your account">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Login to your account">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Login</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Login</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/upload" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Upload resources">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Upload</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Upload</TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile Nav - Hamburger Menu */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 hover:text-secondary hover:bg-secondary/10 transition-colors">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display text-xl font-bold text-foreground">UniNotes</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4">
                  <ul className="space-y-1">
                    {baseMobileNavItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <button
                            onClick={() => handleMobileNavClick(item.path)}
                            className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-left transition-colors ${
                              isActive
                                ? "bg-secondary/10 text-secondary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <item.icon className={`h-5 w-5 ${isActive ? "text-secondary" : ""}`} />
                            <span className="text-sm">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                    {/* Dynamic Auth Link for Mobile */}
                    <li>
                      {isLoggedIn ? (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-left transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="text-sm">Logout</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMobileNavClick("/login")}
                          className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-left transition-colors ${
                            location.pathname === "/login"
                              ? "bg-secondary/10 text-secondary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <LogIn className={`h-5 w-5 ${location.pathname === "/login" ? "text-secondary" : ""}`} />
                          <span className="text-sm">Login</span>
                        </button>
                      )}
                    </li>
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    © 2026 UniNotes
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-card px-4 py-3"
          >
            <div className="relative" ref={dropdownRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 pl-9 pr-16 text-sm rounded-xl"
                autoFocus
              />
              <button onClick={closeSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted">
                ESC
              </button>
            </div>

            {query.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 space-y-1"
              >
                {results.length > 0 ? (
                  <>
                    {results.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect(r.id)}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.subject}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearchAll}
                      className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-secondary"
                    >
                      View all results <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">No results for "{query}"</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
