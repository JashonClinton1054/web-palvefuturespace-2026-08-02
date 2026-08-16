import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import AppRouter from "./router";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import MouseParticles from "./components/MouseParticles";
import SpaceNavigator from "./components/SpaceNavigator";
import AnalyticsTracker from "./components/AnalyticsTracker";

const galleryAssets = [
  "/assets/work-01.jpg",
  "/assets/work-02.jpg",
  "/assets/work-03.jpg",
  "/assets/work-04.jpg",
  "/assets/work-05.jpg",
  "/assets/loading-game-art.jpg",
];

const RouteScrollHandler = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
};

const loadImage = (src) => new Promise((resolve) => {
  const image = new Image();
  const timeout = window.setTimeout(resolve, 1800);
  image.onload = image.onerror = () => {
    window.clearTimeout(timeout);
    resolve();
  };
  image.src = src;
});

function App() {
  const alreadyVisited = sessionStorage.getItem("palve-loader-seen") === "1";
  const [progress, setProgress] = useState(alreadyVisited ? 100 : 0);
  const [assetsLoaded, setAssetsLoaded] = useState(alreadyVisited);
  const [loaderVisible, setLoaderVisible] = useState(!alreadyVisited);

  useEffect(() => {
    const gatePaths = new Set(["/gallery", "/animation", "/game", "/mbti", "/guestbook", "/world"]);
    const criticalAssets = window.location.pathname === "/"
      ? ["/assets/loading-game-art.jpg", "/assets/video-cover.jpg"]
      : ["/assets/loading-game-art.jpg", gatePaths.has(window.location.pathname) ? "/assets/bg-banner2.jpg" : "/assets/bg-banner.jpg"];

    if (alreadyVisited) return;

    let completed = 0;
    Promise.all(criticalAssets.map((src) => loadImage(src).then(() => {
      completed += 1;
      setProgress(Math.round((completed / criticalAssets.length) * 100));
    }))).then(() => setAssetsLoaded(true));
  }, [alreadyVisited]);

  useEffect(() => {
    if (!assetsLoaded) return undefined;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData) return undefined;

    const preload = () => galleryAssets.forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
    const idleId = "requestIdleCallback" in window
      ? window.requestIdleCallback(preload, { timeout: 2500 })
      : window.setTimeout(preload, 900);

    return () => {
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [assetsLoaded]);

  const finishLoading = () => {
    sessionStorage.setItem("palve-loader-seen", "1");
    setLoaderVisible(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      {loaderVisible && <LoadingScreen progress={progress} loaded={assetsLoaded} onComplete={finishLoading} />}
      <CustomCursor />
      <MouseParticles />
      <BrowserRouter>
        <RouteScrollHandler />
        <AnalyticsTracker />
        <SpaceNavigator />
        <AppRouter />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
