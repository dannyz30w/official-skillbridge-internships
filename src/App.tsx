import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import AppBackground from "@/components/AppBackground";

const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BusinessDashboard = lazy(() => import("./pages/BusinessDashboard"));
const InternDashboard = lazy(() => import("./pages/InternDashboard"));
const Mission = lazy(() => import("./pages/Mission"));
const Terms = lazy(() => import("./pages/Terms"));
const ForBusinesses = lazy(() => import("./pages/ForBusinessesPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BrowseInternships = lazy(() => import("./pages/BrowseInternships"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'rgba(60,60,67,0.6)' }} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppBackground />
          <div className="relative z-10">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/for-businesses" element={<ForBusinesses />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/business" element={<ProtectedRoute role="business"><BusinessDashboard /></ProtectedRoute>} />
              <Route path="/intern" element={<ProtectedRoute role="intern"><InternDashboard /></ProtectedRoute>} />
              <Route path="/browse" element={<BrowseInternships />} />
              <Route path="/post-internship" element={<Navigate to="/business" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </div>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
