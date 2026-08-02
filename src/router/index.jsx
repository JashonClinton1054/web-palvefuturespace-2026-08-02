import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

import Home from "../pages/Home";
import Gallery from "../pages/Gallery";
import AnimationHall from "../pages/AnimationHall";
import GamePage from "../pages/GamePage";
import MbtiPage from "../pages/MbtiPage";
import About from "../pages/About";
import Project from "../pages/Project";

const AppRouter = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        <Route path="/project" element={
          <PageTransition>
            <Project />
          </PageTransition>
        } />
        <Route path="/gallery" element={
          <PageTransition>
            <Gallery />
          </PageTransition>
        } />
        <Route path="/animation" element={
          <PageTransition>
            <AnimationHall />
          </PageTransition>
        } />
        <Route path="/game" element={
          <PageTransition>
            <GamePage />
          </PageTransition>
        } />
        <Route path="/mbti" element={
          <PageTransition>
            <MbtiPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;