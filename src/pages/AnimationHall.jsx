import SubpageBackButton from "../components/SubpageBackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../lib/supabase";

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: #fff;
  background-color: #05050a;
  background-image:
    linear-gradient(180deg, rgba(5, 5, 10, 0.68), rgba(5, 5, 10, 0.93)),
    linear-gradient(90deg, rgba(239, 214, 162, 0.035) 1px, transparent 1px),
    linear-gradient(rgba(239, 214, 162, 0.025) 1px, transparent 1px),
    url("/assets/bg-banner.jpg");
  background-position: center, center, center, center top;
  background-size: auto, 72px 72px, 72px 72px, cover;
  background-attachment: fixed;
`;

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;
const LogoText = styled.h2`
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 2px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
const NavMenu = styled.div`
  display: flex;
  gap: 36px;
  @media (max-width: 768px) {
    gap: 20px;
  }
`;
const NavLink = styled.span`
  font-size: 15px;
  opacity: 0.8;
  cursor: pointer;
  transition: 0.25s;
  &:hover{opacity:1;}
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Container = styled.div`
  width: min(1700px,92%);
  margin: 0 auto;
  padding-top: 180px;
  padding-bottom: 120px;
`;
const PageTitle = styled(motion.h1)`
  font-family: "Cinzel Decorative",serif;
  font-size:48px;
  color:#e6c597;
  letter-spacing:4px;
  margin-bottom: 60px;
  @media (max-width:768px){
    font-size:32px;
    margin-bottom: 40px;
  }
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px,1fr));
  gap: 32px;
  @media (max-width:1024px){
    grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
    gap:24px;
  }
  @media (max-width:640px){
    grid-template-columns: repeat(auto-fill, minmax(100%,1fr));
  }
`;

// 和Gallery一模一样的卡片样式
const VideoCard = styled(motion.button)`
  position: relative;
  width: 100%;
  padding: 0;
  border-radius: 6px;
  background: #0b0b12;
  text-align: left;
  color: inherit;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  cursor: pointer;
  border: 1px solid rgba(230, 197, 151, 0.1);

  img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition: transform 0.6s ease;
  }

  &::after{
    content:"";
    position:absolute;
    inset:0;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 65%);
    opacity:0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover img{
    transform: scale(1.07);
  }
  &:hover::after{
    opacity:1;
  }
`;

const CardLabel = styled.div`
  position:absolute;
  left:24px;
  bottom:24px;
  z-index:2;
  transform: translateY(12px);
  opacity:0;
  transition: all 0.4s ease;
  pointer-events:none;

  h3{
    font-family: "Cinzel Decorative",serif;
    font-size:22px;
    color:#e6c597;
    letter-spacing:2px;
    margin:0;
  }
  span{
    font-size:13px;
    opacity:0.75;
  }

  ${VideoCard}:hover &,
  ${VideoCard}:focus-visible & {
    opacity:1;
    transform: translateY(0);
  }

  @media (hover: none) {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 视频弹窗遮罩
const VideoOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const VideoWrap = styled.div`
  width: min(90%, 1000px);
  position: relative;
`;

const PlayerVideo = styled.video`
  width: 100%;
  border-radius: 8px;
  outline: none;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  width:44px;
  height:44px;
  border:0;
  background:transparent;
  color:#fff;
  font-size:26px;
  cursor: pointer;
  opacity:0.7;
  transition:0.2s;
  &:hover{opacity:1;}
`;

// 动画变量
const staggerContainer = {
  hidden: {},
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};
const fadeUp = {
  hidden: {opacity:0, y:20},
  animate: {opacity:1, y:0, transition:{duration:0.5}}
};

// ===================== 视频资源配置区 =====================
// 格式：标题、简介、封面图路径、视频文件路径
const animationList = [
  {
    title: "Demo Animation 01",
    desc: "动态短片演示",
    poster: "/assets/AnimationHall/cover-01.jpg",
    videoSrc: "/assets/AnimationHall/anim-01.mp4"
  },
  {
    title: "Demo Animation 02",
    desc: "视觉特效动画",
    poster: "/assets/AnimationHall/cover-02.jpg",
    videoSrc: "/assets/AnimationHall/anim-02.mp4"
  }
];
// 新增视频直接复制上面对象追加数组末尾即可
// =========================================================

export default function AnimationHall() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);

  const closePlayer = () => {
    setActiveVideo(null);
  };

  const openPlayer = (item) => {
    setActiveVideo(item);
    void trackEvent("animation_play", { title: item.title });
  };

  return (
    <Wrapper>
      <NavBar>
        <LogoText>PaL,ve.Future Space</LogoText>
        <NavMenu>
  <NavLink onClick={()=>navigate("/")}>首页</NavLink>
  <NavLink onClick={()=>navigate("/gallery")}>图库</NavLink>
  <NavLink onClick={()=>navigate("/animation")}>动画展厅</NavLink>
</NavMenu>
      </NavBar>

      <Container>
        <motion.div variants={staggerContainer} initial="hidden" animate="animate">
          <PageTitle variants={fadeUp}>Animation · 动画展厅</PageTitle>
          <SubpageBackButton />

          <GridWrap>
            {animationList.map((item, idx) => (
              <VideoCard
                key={idx}
                variants={fadeUp}
                onClick={() => openPlayer(item)}
              >
                <img loading="lazy" decoding="async" src={item.poster} alt={item.title} />
                <CardLabel>
                  <h3>{item.title}</h3>
                  <span>{item.desc}</span>
                </CardLabel>
              </VideoCard>
            ))}
          </GridWrap>
        </motion.div>
      </Container>

      {/* 视频弹窗播放器 */}
      <AnimatePresence>
        {activeVideo && (
          <VideoOverlay
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={closePlayer}
          >
            <VideoWrap onClick={(e)=>e.stopPropagation()}>
              <CloseBtn type="button" onClick={closePlayer} aria-label="关闭视频">✕</CloseBtn>
              <PlayerVideo
                src={activeVideo.videoSrc}
                poster={activeVideo.poster}
                controls
                autoPlay
              />
            </VideoWrap>
          </VideoOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}
