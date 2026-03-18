import { useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import { PageNotFound } from "@/components/ui/page-not-found";

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <SEOHead title="Page Not Found, SkillBridge" description="The page you are looking for does not exist." path={location.pathname} noIndex />
      <Navbar />
      <div className="pt-24">
        <PageNotFound />
      </div>
    </div>
  );
};

export default NotFound;
