import { useLocation } from "react-router-dom";
import { Boxes } from "@/components/ui/background-boxes";
import { EtherealShadow } from "@/components/ui/etheral-shadow";

const PUBLIC_BOX_ROUTES = [
  "/browse",
  "/mission",
  "/how-it-works",
  "/resources",
  "/contact",
  "/testimonials",
  "/terms",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const DASHBOARD_ROUTES = ["/intern", "/business", "/admin"];

const AppBackground = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicBoxes = PUBLIC_BOX_ROUTES.some((r) => pathname.startsWith(r));

  if (isLanding) return null;

  return (
    <div className="app-bg-root" aria-hidden="true" style={{ background: "#0a0a0f" }}>
      {isPublicBoxes ? (
        <>
          <Boxes className="app-bg-layer" />
          <div className="app-bg-layer z-10 pointer-events-none [mask-image:radial-gradient(transparent,white)] bg-[#0a0a0f]/50" />
        </>
      ) : null}

      {isDashboard ? (
        <EtherealShadow
          color="rgba(79, 70, 229, 0.15)"
          animation={{ scale: 60, speed: 70 }}
          noise={{ opacity: 0.3, scale: 1.5 }}
          sizing="fill"
          className="fixed inset-0 z-0 pointer-events-none"
        />
      ) : null}
    </div>
  );
};

export default AppBackground;
