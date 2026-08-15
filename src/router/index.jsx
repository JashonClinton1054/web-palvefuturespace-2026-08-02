import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const Home = lazy(() => import("../pages/Home"));
const Gallery = lazy(() => import("../pages/Gallery"));
const AnimationHall = lazy(() => import("../pages/AnimationHall"));
const GamePage = lazy(() => import("../pages/GamePage"));
const MbtiPage = lazy(() => import("../pages/MbtiPage"));
const About = lazy(() => import("../pages/About"));
const Project = lazy(() => import("../pages/Project"));
const Guestbook = lazy(() => import("../pages/Guestbook"));
const WorldArchive = lazy(() => import("../pages/WorldArchive"));
const Admin = lazy(() => import("../pages/Admin"));

const RouteLoading = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      color: "#efd6a2",
      background: "#05050a",
      fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
      letterSpacing: "0.12em",
    }}
  >
    <motion.span
      initial={{ opacity: 0.25 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, repeat: Infinity, repeatType: "reverse" }}
    >
      CONNECTING TO SECTOR…
    </motion.span>
  </div>
);

const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/project" element={<PageTransition><Project /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/animation" element={<PageTransition><AnimationHall /></PageTransition>} />
          <Route path="/game" element={<PageTransition><GamePage /></PageTransition>} />
          <Route path="/guestbook" element={<PageTransition><Guestbook /></PageTransition>} />
          <Route path="/mbti" element={<PageTransition><MbtiPage /></PageTransition>} />
          <Route path="/world" element={<PageTransition><WorldArchive /></PageTransition>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRouter;
