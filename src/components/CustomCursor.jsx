import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const CursorContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  @media (max-width: 768px) {
    display: none;
  }
`;

const OuterRing = styled(motion.div)`
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
`;

const InnerDot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
  transform: translate(-50%, -50%);
`;

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // 监听hover元素
    const hoverTargets = document.querySelectorAll("span,div[role='button']");
    const enter = () => setIsHover(true);
    const leave = () => setIsHover(false);

    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      hoverTargets.forEach(el => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <CursorContainer>
      <OuterRing
        animate={{
          left: mousePos.x,
          top: mousePos.y,
          scale: isHover ? 1.6 : 1
        }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
      />
      <InnerDot style={{ left: mousePos.x, top: mousePos.y }} />
    </CursorContainer>
  );
}