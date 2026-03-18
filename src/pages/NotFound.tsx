import { useLocation, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <SEOHead title="Page Not Found, SkillBridge" description="The page you are looking for does not exist." path={location.pathname} noIndex />
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-display font-bold mb-4" style={{ color: 'rgba(248,250,252,0.24)' }}>404</h1>
          <p className="text-h3 font-display font-bold mb-2 text-white">Page not found</p>
          <p className="text-body mb-8" style={{ color: 'rgba(226,232,240,0.72)' }}>The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="btn-glass-primary inline-flex items-center justify-center h-12 px-8">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
