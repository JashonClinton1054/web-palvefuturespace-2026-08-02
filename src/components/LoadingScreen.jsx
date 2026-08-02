import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const FontInject = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap');
  position: absolute;
  width:0;height:0;
  pointer-events:none;
`;

const LoaderWrap = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000000;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// 图片外层容器，用来做相对定位
const ArtContainer = styled.div`
  position: relative;
  width: 82%;
  max-height: 68vh;

  @media (max-width: 768px) {
    width: 92%;
    max-height: 58vh;
  }
`;

const LoadArt = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TitleText = styled(motion.h1)`
  margin-top: 32px;
  font-size: 52px;
  font-weight: 700;
  letter-spacing: 6px;
  text-transform: uppercase;
  font-family: "Cinzel Decorative", serif;
  color: #e6c597;
  text-shadow:
    0 0 6px rgba(180, 110, 60, 0.65),
    0 0 14px rgba(145, 75, 40, 0.45),
    0 2px 3px #442212,
    0 4px 6px rgba(0,0,0,0.8);

  @media (max-width: 768px) {
    font-size: 30px;
    letter-spacing: 3px;
    margin-top: 20px;
  }
`;

// 进度容器：定位在插画右下角
const ProgressContainer = styled.div`
  position: absolute;
  right: 4%;
  bottom: 4%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

// 童话风圆角进度条外壳
const ProgressBarWrap = styled.div`
  width: 160px;
  height: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 999px;
  overflow:hidden;
`;

// 柔和童话填充色
const ProgressFill = styled(motion.div)`
  height:100%;
  width:0%;
  border-radius: 999px;
  background: linear-gradient(90deg,#ffc8b8,#ffe8c2);
  box-shadow: 0 0 6px rgba(255, 216, 175, 0.6);
`;

// 百分比文字
const ProgressText = styled.span`
  font-size:14px;
  letter-spacing:1px;
  color:#ffe9cc;
  font-family:system-ui, sans-serif;
`;

export default function LoadingScreen({ progress, loaded, onComplete }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    // 最低停留2200ms
    const minDisplayTime = setTimeout(() => {
      setCanClose(true);
    }, 2200);

    return () => clearTimeout(minDisplayTime);
  }, []);

  useEffect(() => {
    // 资源加载完成 + 最低等待时间结束，才允许退场
    if (loaded && canClose) {
      setTimeout(() => {
        onComplete();
      }, 1100);
    }
  }, [loaded, canClose, onComplete]);

  return (
    <LoaderWrap
      initial={{ y: 0 }}
      animate={loaded && canClose ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <FontInject />
      {/* 外层容器包裹图片，进度条放在容器内，不再嵌套img */}
      <ArtContainer>
        <LoadArt
          src="/assets/loading-game-art.jpg"
          alt="loading illustration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <ProgressContainer>
          <ProgressBarWrap>
            <ProgressFill animate={{ width:`${progress}%`}} transition={{ease:"easeOut"}}/>
          </ProgressBarWrap>
          <ProgressText>{progress} %</ProgressText>
        </ProgressContainer>
      </ArtContainer>
      <TitleText
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
      >
        The Fallen & The Virtuous
      </TitleText>
    </LoaderWrap>
  );
}