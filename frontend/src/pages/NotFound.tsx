import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" role="main" aria-label="Page not found">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="text-8xl font-bold text-gradient"
          >
            404
          </motion.h1>
          <h2 className="text-2xl font-bold text-foreground">Page not found</h2>
          <p className="text-muted-foreground">
            The page <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">{location.pathname}</code> doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button className="gap-2" aria-label="Go to homepage">
              <Home className="h-4 w-4" aria-hidden="true" /> Go Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" className="gap-2" aria-label="Browse resources">
              <Search className="h-4 w-4" aria-hidden="true" /> Browse Resources
            </Button>
          </Link>
          <Button variant="ghost" className="gap-2" onClick={() => window.history.back()} aria-label="Go back to previous page">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
