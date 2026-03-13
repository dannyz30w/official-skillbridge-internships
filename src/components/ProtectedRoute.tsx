import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user, loading, accountType } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (accountType && accountType !== role) {
    return <Navigate to={`/${accountType}`} replace />;
  }
  if (!accountType) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  return <>{children}</>;
};

export default ProtectedRoute;
