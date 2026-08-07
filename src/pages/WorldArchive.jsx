import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import SubpageBackButton from "../components/SubpageBackButton";

const concepts = [
  { code: "01", name: "漂移档案", en: "DRIFT ARCHIVE", image: "/assets/work-01.jpg", status: "SYNCED", text: "收纳无法被单一日期定义的图像记忆。它们沿着年份与月份缓慢漂移，在被再次观看时获得新的注释。", tags: ["IMAGE", "MEMORY", "INDEX"] },
  { code: "02", name: "回声剧场", en: "ECHO THEATER", image: "/assets/work-02.jpg", status: "ON AIR", text: "动态影像在这里被视作有长度的信号。每一次播放、暂停与回看，都会构成观看者自己的时间切片。", tags: ["MOTION", "VOICE", "FRAME"] },
  { code: "03", name: "共感协议", en: "RESONANCE", image: "/assets/work-04.jpg", status: "CALIBRATED", text: "用选择与反馈描绘访客的性格坐标。结果不是判决，而是一份可以反复校准的临时航图。", tags: ["PERSONA", "CHOICE", "MAP"] },
  { code: "04", name: "微型轨道", en: "PLAY ORBIT", image: "/assets/work-03.jpg", status: "ACTIVE", text: "轻量互动在独立轨道中持续运转。规则保持简单，细微的反馈和偶然性让每次进入都稍有不同。", tags: ["PLAY", "LOOP", "EVENT"] },
  { code: "05", name: "雨夜通讯", en: "RAIN SIGNAL", image: "/assets/work-05.jpg", status: "RECEIVING", text: "来自访客的短讯经过雨声中继抵达空间站。它们不必宏大，一句问候也足以成为长期保存的坐标。", tags: ["MESSAGE", "MOOD", "RAIN"] },
  { code: "06", name: "未来空域", en: "FUTURE FIELD", image: "/assets/loading-game-art.jpg", status: "EXPANDING", text: "所有尚未完成的设想在这里登记：新展厅、实验界面与未命名的作品，组成 PaL,ve 下一阶段的开放边界。", tags: ["IDEA", "BUILD", "FUTURE"] },
];

const dispatches = [
  { type: "空间公告", date: "08.07", title: "世界档案完成首次联机", text: "六个概念区已接入全局导航，等待访客校阅。" },
  { type: "制作日志", date: "08.05", title: "展馆信号层完成校准", text: "统一子页面背景、返回路径与信息密度。" },
  { type: "访客通讯", date: "08.02", title: "雨夜频道保持开放", text: "新的问候、灵感和心情仍在持续抵达。" },
];

const Wrapper = styled.main`
  min-height: 100vh; overflow: hidden; color: #fff7e8; background: #05050a;
`;
const Hero = styled.section`
  position: relative; min-height: 76svh; padding: 150px max(32px, 5vw) 70px; display: flex; align-items: end;
  background: url("/assets/bg-banner.jpg") center 22% / cover no-repeat;
  &::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(3,3,8,.94) 0%, rgba(3,3,8,.42) 62%, rgba(3,3,8,.78)), linear-gradient(0deg, #05050a 0%, transparent 58%); }
  &::after { content: ""; position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(239,214,162,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(239,214,162,.1) 1px, transparent 1px); background-size: 72px 72px; }
  @media (max-width: 700px) { min-height: 68svh; padding: 128px 20px 46px; }
`;
const HeroInner = styled.div`
  position: relative; z-index: 1; width: min(1500px, 100%); margin: 0 auto; display: grid;
  grid-template-columns: minmax(0, 780px) minmax(220px, 320px); justify-content: space-between; gap: 48px; align-items: end;
  @media (max-width: 800px) { grid-template-columns: 1fr; gap: 28px; }
`;
const Kicker = styled.p`margin: 0 0 14px; color: #d7b36c; font-size: 11px; letter-spacing: .24em;`;
const Title = styled.h1`margin: 0; max-width: 760px; font: 500 clamp(42px, 7vw, 96px)/1 "Cinzel Decorative", serif; letter-spacing: 0; color: #f3dbab;`;
const Intro = styled.p`max-width: 650px; margin: 24px 0 28px; color: rgba(255,247,232,.72); font-size: 15px; line-height: 1.9;`;
const Signal = styled.aside`
  padding: 22px 0 22px 24px; border-left: 1px solid rgba(239,214,162,.34);
  small { color: #d7b36c; letter-spacing: .18em; } strong { display: block; margin: 14px 0 8px; font-size: 18px; font-weight: 500; }
  p { margin: 0; color: rgba(255,247,232,.57); line-height: 1.7; font-size: 12px; }
`;
const Content = styled.div`width: min(1500px, calc(100% - 64px)); margin: 0 auto; @media(max-width:700px){width:calc(100% - 32px);}`;
const Telemetry = styled.section`
  margin: 0 0 110px; border-top: 1px solid rgba(239,214,162,.2); border-bottom: 1px solid rgba(239,214,162,.2);
  display: grid; grid-template-columns: repeat(4,1fr);
  @media(max-width:700px){grid-template-columns:repeat(2,1fr);margin-bottom:80px;}
`;
const Metric = styled.div`
  padding: 26px 24px; border-right: 1px solid rgba(239,214,162,.14); &:last-child{border-right:0;}
  strong{display:block;color:#f3dbab;font:500 28px "Cinzel Decorative",serif;} span{display:block;margin-top:8px;color:rgba(255,247,232,.48);font-size:10px;letter-spacing:.14em;}
  @media(max-width:700px){padding:20px 14px;&:nth-child(2){border-right:0;}&:nth-child(-n+2){border-bottom:1px solid rgba(239,214,162,.14);}}
`;
const SectionHead = styled.div`
  display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:34px;
  h2{margin:0;color:#f3dbab;font:500 clamp(28px,4vw,48px) "Cinzel Decorative",serif;letter-spacing:0;} p{max-width:520px;margin:0;color:rgba(255,247,232,.54);line-height:1.7;font-size:13px;}
  @media(max-width:700px){display:block;p{margin-top:14px;}}
`;
const Archive = styled.section`margin-bottom:120px;`;
const ArchiveGrid = styled.div`display:grid;grid-template-columns:290px minmax(0,1fr);min-height:580px;border:1px solid rgba(239,214,162,.18);@media(max-width:800px){grid-template-columns:1fr;}`;
const Index = styled.div`border-right:1px solid rgba(239,214,162,.18);background:rgba(9,9,14,.8);@media(max-width:800px){display:flex;overflow-x:auto;border-right:0;border-bottom:1px solid rgba(239,214,162,.18);}`;
const IndexButton = styled.button`
  width:100%;min-height:84px;padding:16px 20px;display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;border:0;
  border-bottom:1px solid rgba(239,214,162,.11);background:${p=>p.$active?"rgba(239,214,162,.11)":"transparent"};
  color:${p=>p.$active?"#f3dbab":"rgba(255,247,232,.55)"};text-align:left;cursor:pointer;transition:.2s;
  span{font-size:10px;color:#d7b36c;} strong{font-size:13px;font-weight:500;letter-spacing:.08em;} &:hover{background:rgba(239,214,162,.07);color:#fff7e8;}
  @media(max-width:800px){flex:0 0 158px;min-height:70px;grid-template-columns:24px 1fr;border-bottom:0;border-right:1px solid rgba(239,214,162,.11);}
`;
const Dossier = styled(motion.article)`position:relative;min-height:580px;display:flex;align-items:end;overflow:hidden;`;
const DossierImage = styled.img`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.62) brightness(.57);`;
const DossierMask = styled.div`position:absolute;inset:0;background:linear-gradient(0deg,rgba(5,5,10,.97),rgba(5,5,10,.08) 72%),linear-gradient(90deg,rgba(5,5,10,.65),transparent);`;
const DossierCopy = styled.div`
  position:relative;z-index:1;max-width:720px;padding:48px;
  small{color:#d7b36c;letter-spacing:.18em;} h3{margin:12px 0 6px;color:#f3dbab;font:500 clamp(30px,4vw,58px) "Cinzel Decorative",serif;letter-spacing:0;}
  h4{margin:0;color:rgba(255,247,232,.58);font-size:12px;letter-spacing:.2em;} p{max-width:610px;margin:22px 0;color:rgba(255,247,232,.73);line-height:1.9;font-size:14px;}
  @media(max-width:600px){padding:28px 22px;}
`;
const Tags = styled.div`display:flex;flex-wrap:wrap;gap:8px;span{padding:6px 9px;border:1px solid rgba(239,214,162,.25);color:rgba(255,247,232,.6);font-size:9px;letter-spacing:.14em;}`;
const Dispatch = styled.section`padding-bottom:130px;`;
const Filters = styled.div`display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;`;
const Filter = styled.button`border:0;border-bottom:1px solid ${p=>p.$active?"#d7b36c":"rgba(255,255,255,.15)"};padding:8px 4px;background:transparent;color:${p=>p.$active?"#f3dbab":"rgba(255,247,232,.48)"};cursor:pointer;font-size:11px;letter-spacing:.1em;`;
const DispatchRow = styled(motion.article)`
  display:grid;grid-template-columns:100px 100px minmax(180px,1fr) minmax(220px,1.2fr);gap:24px;align-items:center;padding:22px 12px;border-top:1px solid rgba(239,214,162,.13);
  &:last-child{border-bottom:1px solid rgba(239,214,162,.13);} small{color:#d7b36c;font-size:10px;letter-spacing:.1em;} time{color:rgba(255,247,232,.38);font-size:12px;}
  strong{font-weight:500;} p{margin:0;color:rgba(255,247,232,.52);font-size:12px;line-height:1.7;}
  @media(max-width:700px){grid-template-columns:80px 1fr;gap:10px 16px;padding:18px 4px;p{grid-column:2;}time{grid-row:2;}}
`;

export default function WorldArchive(){
  const [active,setActive]=useState(0);
  const [filter,setFilter]=useState("全部");
  const [clock,setClock]=useState(new Date());
  useEffect(()=>{const timer=window.setInterval(()=>setClock(new Date()),1000);return()=>window.clearInterval(timer)},[]);
  const visible=useMemo(()=>filter==="全部"?dispatches:dispatches.filter(item=>item.type===filter),[filter]);
  const item=concepts[active];
  return <Wrapper>
    <Hero><HeroInner><div><Kicker>WORLD SIGNAL / SECTOR 06</Kicker><Title>PaL,ve World Archive</Title><Intro>这里不是一份静止的设定集，而是空间站仍在生长的记录层。作品、互动与访客通讯被重新组织成六个可检索的世界概念。</Intro><SubpageBackButton/></div><Signal><small>BREAKING SIGNAL</small><strong>世界档案首次开放</strong><p>系统时间 {clock.toLocaleTimeString("zh-CN",{hour12:false})}<br/>全部扇区连接稳定</p></Signal></HeroInner></Hero>
    <Content>
      <Telemetry>{[["06","概念扇区"],["03","开放频道"],["97.8%","信号完整度"],["LIVE","档案状态"]].map(([value,label])=><Metric key={label}><strong>{value}</strong><span>{label}</span></Metric>)}</Telemetry>
      <Archive><SectionHead><h2>World Concepts</h2><p>选择索引，读取组成 Future Space 的概念档案。每个区域对应一类作品，也保留继续生长的接口。</p></SectionHead><ArchiveGrid><Index>{concepts.map((entry,index)=><IndexButton key={entry.code} $active={active===index} onClick={()=>setActive(index)} aria-pressed={active===index}><span>{entry.code}</span><strong>{entry.name}</strong></IndexButton>)}</Index><AnimatePresence mode="wait"><Dossier key={item.code} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.35}}><DossierImage src={item.image} alt=""/><DossierMask/><DossierCopy><small>{item.code} / {item.status}</small><h3>{item.name}</h3><h4>{item.en}</h4><p>{item.text}</p><Tags>{item.tags.map(tag=><span key={tag}>{tag}</span>)}</Tags></DossierCopy></Dossier></AnimatePresence></ArchiveGrid></Archive>
      <Dispatch><SectionHead><h2>Signal Dispatch</h2><p>空间站近期发生的变化会以短讯形式留档。它们连接作品更新、制作过程与访客回声。</p></SectionHead><Filters>{["全部","空间公告","制作日志","访客通讯"].map(name=><Filter key={name} $active={filter===name} onClick={()=>setFilter(name)}>{name}</Filter>)}</Filters><AnimatePresence mode="popLayout">{visible.map(entry=><DispatchRow layout key={entry.title} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}><small>{entry.type}</small><time>{entry.date}</time><strong>{entry.title}</strong><p>{entry.text}</p></DispatchRow>)}</AnimatePresence></Dispatch>
    </Content>
  </Wrapper>;
}

