import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const CursorContainer = styled.div`
  pointer-events:none;position:fixed;inset:0 auto auto 0;z-index:99999;
  @media(max-width:768px),(pointer:coarse),(prefers-reduced-motion:reduce){display:none;}
`;
const OuterRing = styled(motion.div)`position:absolute;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.6);transform:translate(-50%,-50%);`;
const InnerDot = styled.div`position:absolute;width:6px;height:6px;border-radius:50%;background:#fff;transform:translate(-50%,-50%);`;

export default function CustomCursor(){
  const [enabled,setEnabled]=useState(false);
  const [mousePos,setMousePos]=useState({x:-40,y:-40});
  const [isHover,setIsHover]=useState(false);

  useEffect(()=>{
    const canUseCursor=window.matchMedia("(pointer: fine)").matches
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      && window.innerWidth>768;
    setEnabled(canUseCursor);
    if(!canUseCursor)return undefined;

    const mouseMove=(event)=>setMousePos({x:event.clientX,y:event.clientY});
    const pointerOver=(event)=>setIsHover(Boolean(event.target.closest("button,a,[role=''button''],input,select,textarea")));
    window.addEventListener("mousemove",mouseMove,{passive:true});
    document.addEventListener("pointerover",pointerOver,{passive:true});
    return()=>{
      window.removeEventListener("mousemove",mouseMove);
      document.removeEventListener("pointerover",pointerOver);
    };
  },[]);

  if(!enabled)return null;
  return <CursorContainer aria-hidden="true"><OuterRing animate={{left:mousePos.x,top:mousePos.y,scale:isHover?1.55:1}} transition={{type:"spring",damping:24,stiffness:190}}/><InnerDot style={{left:mousePos.x,top:mousePos.y}}/></CursorContainer>;
}
