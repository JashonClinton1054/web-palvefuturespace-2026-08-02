import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

const drift = keyframes`
  0% { transform: translate3d(-2%, -1%, 0) scale(1.04); }
  50% { transform: translate3d(2%, 1%, 0) scale(1.08); }
  100% { transform: translate3d(-2%, -1%, 0) scale(1.04); }
`;

const LoaderWrap = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: #fff5df;
  background:
    radial-gradient(circle at 18% 18%, rgba(230, 197, 151, 0.16), transparent 34%),
    radial-gradient(circle at 76% 64%, rgba(125, 175, 211, 0.12), transparent 32%),
    #030307;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: -4%;
  background: url("/assets/loading-game-art.jpg") center / cover no-repeat;
  filter: saturate(0.92) contrast(1.08) brightness(0.7);
  animation: ${drift} 8s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(3, 3, 7, 0.92) 0%, rgba(3, 3, 7, 0.42) 45%, rgba(3, 3, 7, 0.82) 100%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 5px);
  }
`;

const Panel = styled(motion.div)`
  position: relative;
  width: min(1120px, calc(100% - 48px));
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 48px;
  align-items: end;

  @media (max-width: 760px) {
    width: min(100% - 32px, 520px);
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const BrandBlock = styled.div`
  text-align: left;
`;

const Eyebrow = styled(motion.p)`
  margin: 0 0 14px;
  color: rgba(255, 245, 223, 0.62);
  font-size: 12px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
`;

const TitleText = styled(motion.h1)`
  margin: 0;
  max-width: 760px;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: clamp(46px, 8vw, 112px);
  line-height: 0.92;
  letter-spacing: 0.04em;
  color: #f2d8a8;
  text-shadow: 0 0 22px rgba(230, 197, 151, 0.26), 0 6px 22px rgba(0, 0, 0, 0.72);
`;

const Status = styled(motion.div)`
  justify-self: end;
  width: 100%;
  max-width: 300px;
  padding: 18px 0 0;
  border-top: 1px solid rgba(242, 216, 168, 0.32);

  @media (max-width: 760px) {
    justify-self: start;
    max-width: none;
  }
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: rgba(255, 245, 223, 0.7);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const ProgressBarWrap = styled.div`
  height: 3px;
  margin-top: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.14);
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #f0c77a, #fff3cb, #8fb7d2);
  box-shadow: 0 0 18px rgba(240, 199, 122, 0.8);
`;

export default function LoadingScreen({ progress, loaded, onComplete }) {
  const [canClose, setCanClose] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const minDisplayTime = setTimeout(() => setCanClose(true), reduceMotion ? 250 : 700);
    const forceTimeout = setTimeout(() => setCanClose(true), 3000);

    return () => {
      clearTimeout(minDisplayTime);
      clearTimeout(forceTimeout);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if ((loaded || canClose) && canClose) {
      const closeTimer = setTimeout(onComplete, reduceMotion ? 80 : 420);
      return () => clearTimeout(closeTimer);
    }
  }, [loaded, canClose, onComplete, reduceMotion]);

  const leaving = (loaded || canClose) && canClose;

  return (
    <LoaderWrap
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: reduceMotion ? 0.08 : 0.72, ease: [0.76, 0, 0.24, 1] }}
    >
      <Backdrop />
      <Panel initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <BrandBlock>
          <Eyebrow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Ignoredone personal archive
          </Eyebrow>
          <TitleText initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.9 }}>
            PaL,ve.Future Space
          </TitleText>
        </BrandBlock>
        <Status initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}>
          <StatusRow>
            <span>Loading</span>
            <span>{progress}%</span>
          </StatusRow>
          <ProgressBarWrap>
            <ProgressFill animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.3 }} />
          </ProgressBarWrap>
        </Status>
      </Panel>
    </LoaderWrap>
  );
}
