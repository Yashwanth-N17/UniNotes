import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import Navbar from "./Navbar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-muted-foreground animate-pulse font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with the current location as state so we can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
