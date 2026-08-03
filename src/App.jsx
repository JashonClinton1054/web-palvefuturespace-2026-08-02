import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import CustomCursor from "./components/CustomCursor";
import MouseParticles from "./components/MouseParticles";
import LoadingScreen from "./components/LoadingScreen";

// ✅严格对应你项目真实文件名！
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import AnimationHall from './pages/AnimationHall'
import About from './pages/About'
import Project from './pages/Project'
import GamePage from './pages/GamePage'
import MbtiPage from './pages/MbtiPage'

// 需要预加载的全部静态资源清单
const assetList = [
  //"/assets/bg-video.mp4", //视频永久移出预加载，首页延迟加载
  "/assets/video-cover.jpg",
  "/assets/loading-game-art.jpg",
  "/assets/work-01.jpg",
  "/assets/work-02.jpg",
  "/assets/work-03.jpg",
  "/assets/work-04.jpg",
];

// 新建内部组件，把useLocation放进Router内部
const RouteScrollHandler = () => {
  const location = useLocation();
  useEffect(()=>{
    window.scrollTo({top:0, behavior:"instant"});
  },[location.pathname])
  return null;
}

function App() {
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const total = assetList.length;

    const loadAsset = (src) => {
      return new Promise((resolve) => {
        // 单资源1.5秒超时兜底，防止单张图片卡死全部进度
        const timeout = setTimeout(() => resolve(), 1500);

        if(src.endsWith(".mp4")){
          const video = document.createElement("video");
          video.src = src;
          video.onloadeddata = ()=>{
            clearTimeout(timeout);
            resolve();
          };
          video.onerror = ()=>{
            clearTimeout(timeout);
            resolve();
          };
        }else{
          const img = new Image();
          img.src = src;
          img.onload = ()=>{
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = ()=>{
            clearTimeout(timeout);
            resolve();
          };
        }
      }).then(()=>{
        loadedCount++;
        setProgress(Math.floor((loadedCount/total)*100));
      })
    }

    Promise.all(assetList.map(loadAsset)).then(()=>{
      setAssetsLoaded(true);
    })
  },[])

  return (
    <>
      {loaderVisible && (
        <LoadingScreen
          progress={progress}
          loaded={assetsLoaded}
          onComplete={() => setLoaderVisible(false)}
        />
      )}
      <CustomCursor />
      <MouseParticles />
      <BrowserRouter>
        <RouteScrollHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/animation" element={<AnimationHall />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/mbti" element={<MbtiPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;