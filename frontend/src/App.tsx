import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { useTrackLastVisited } from "@/hooks/use-last-visited";
import { lazy, Suspense } from "react";
import RouteProgressBar from "@/components/RouteProgressBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import MobileSplashScreen from "@/components/MobileSplashScreen";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  IndexSkeleton,
  BrowseSkeleton,
  ScoreboardSkeleton,
  ProfileSkeleton,
  EditProfileSkeleton,
  SubjectDetailSkeleton,
  SubjectPageSkeleton,
  ResourceDetailSkeleton,
  UploadPageSkeleton,
  LoginSkeleton,
  SignupSkeleton,
  AboutUsSkeleton,
  ContactSkeleton,
  LegalPageSkeleton,
} from "@/components/LoadingSkeleton";

// Lazy load all routes including Index for skeleton support
const Index = lazy(() => import("./pages/Index"));

// Lazy load non-critical routes
const Browse = lazy(() => import("./pages/Browse"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const Scoreboard = lazy(() => import("./pages/Scoreboard"));
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const SubjectDetail = lazy(() => import("./pages/SubjectDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useTrackLastVisited();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Suspense fallback={<IndexSkeleton />}><Index /></Suspense>} />
          <Route path="/browse" element={<Suspense fallback={<BrowseSkeleton />}><Browse /></Suspense>} />
          <Route path="/upload" element={<Suspense fallback={<UploadPageSkeleton />}><ProtectedRoute><UploadPage /></ProtectedRoute></Suspense>} />
          <Route path="/scoreboard" element={<Suspense fallback={<ScoreboardSkeleton />}><Scoreboard /></Suspense>} />
          <Route path="/subject/:slug" element={<Suspense fallback={<SubjectPageSkeleton />}><SubjectPage /></Suspense>} />
          <Route path="/subject/:slug/:subjectSlug" element={<Suspense fallback={<SubjectDetailSkeleton />}><SubjectDetail /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<ProfileSkeleton />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense>} />
          <Route path="/profile/edit" element={<Suspense fallback={<EditProfileSkeleton />}><ProtectedRoute><EditProfile /></ProtectedRoute></Suspense>} />
          <Route path="/bookmarks" element={<Suspense fallback={<BrowseSkeleton />}><ProtectedRoute><Bookmarks /></ProtectedRoute></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<LoginSkeleton />}><Login /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<SignupSkeleton />}><Signup /></Suspense>} />
          <Route path="/resource/:id" element={<Suspense fallback={<ResourceDetailSkeleton />}><ResourceDetail /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<AboutUsSkeleton />}><AboutUs /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<ContactSkeleton />}><Contact /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<LegalPageSkeleton />}><PrivacyPolicy /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={<LegalPageSkeleton />}><TermsOfService /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileSplashScreen>
              <div>
                <a href="#main-content" className="skip-to-content">Skip to main content</a>
                <RouteProgressBar />
                <div id="main-content">
                  <AnimatedRoutes />
                </div>
              </div>
            </MobileSplashScreen>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
