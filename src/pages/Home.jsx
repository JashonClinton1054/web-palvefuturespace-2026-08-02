import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  width: 100%; min-height: 100vh; overflow-x: hidden; color: #fff7e8; background: #05050a;
`;
const Header = styled(motion.header)`
  position: fixed; inset: 0 0 auto; z-index: 999; padding: 26px 0;
  background: linear-gradient(180deg, rgba(5,5,10,.84), transparent); backdrop-filter: blur(10px);
`;
const Container = styled.div`
  width: min(1680px, calc(100% - 64px)); margin: 0 auto;
  @media(max-width:760px){width:min(100% - 32px,620px);}
`;
const NavInner = styled(Container)`display:flex;align-items:center;justify-content:space-between;gap:24px;`;
const LogoText = styled.div`
  color:#efd6a2;font:500 18px "Cinzel Decorative","Times New Roman",serif;letter-spacing:.12em;white-space:nowrap;
  @media(max-width:560px){font-size:15px;}
`;
const NavMenu = styled.nav`
  display:flex;gap:24px;@media(max-width:760px){gap:13px;}@media(max-width:580px){button:nth-last-child(-n + 2){display:none;}}
`;
const NavLink = styled.button`
  border:0;padding:0;background:transparent;color:${p=>p.$active?"#efd6a2":"rgba(255,247,232,.72)"};font:inherit;font-size:14px;letter-spacing:.06em;cursor:pointer;
  &:hover{color:#efd6a2;}@media(max-width:560px){font-size:12px;}
`;
const HeroSection = styled.section`position:relative;min-height:100svh;display:grid;align-items:end;overflow:hidden;`;
const VideoCover = styled.div`position:absolute;inset:0;background:url("/assets/video-cover.jpg") center/cover no-repeat;filter:saturate(.9) contrast(1.06) brightness(.78);`;
const HeroMask = styled.div`
  position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,3,8,.9),rgba(3,3,8,.34) 52%,rgba(3,3,8,.78)),linear-gradient(180deg,rgba(3,3,8,.2),rgba(3,3,8,.92));
`;
const HeroContent = styled(Container)`
  position:relative;z-index:1;padding:160px 0 94px;display:grid;grid-template-columns:minmax(0,780px) 280px;gap:56px;align-items:end;
  @media(max-width:900px){grid-template-columns:1fr;gap:40px;}
`;
const HeroText = styled(motion.div)`text-align:left;`;
const Eyebrow = styled.p`margin:0 0 18px;color:rgba(255,247,232,.58);font-size:12px;letter-spacing:.28em;text-transform:uppercase;`;
const HeroTitle = styled.h1`
  margin:0;color:#f3dbab;font:500 clamp(46px,7vw,108px)/.96 "Cinzel Decorative","Times New Roman",serif;letter-spacing:.04em;
  text-shadow:0 0 24px rgba(230,197,151,.25),0 10px 30px rgba(0,0,0,.72);
`;
const HeroDesc = styled.p`max-width:640px;margin:24px 0 0;color:rgba(255,247,232,.76);font-size:16px;line-height:1.9;`;
const HeroActions = styled.div`display:flex;flex-wrap:wrap;gap:14px;margin-top:34px;`;
const ActionButton = styled.button`
  border:1px solid rgba(239,214,162,.45);border-radius:4px;padding:12px 18px;background:${p=>p.$primary?"rgba(239,214,162,.92)":"rgba(255,255,255,.04)"};color:${p=>p.$primary?"#08070c":"#f6e8cc"};cursor:pointer;letter-spacing:.06em;transition:.25s;
  &:hover{transform:translateY(-2px);border-color:rgba(239,214,162,.85);background:${p=>p.$primary?"#f3dbab":"rgba(239,214,162,.1)"};}
`;
const StatusPanel = styled(motion.aside)`
  border-left:1px solid rgba(239,214,162,.24);padding-left:24px;text-align:left;
  @media(max-width:900px){border-left:0;padding-left:0;display:grid;grid-template-columns:repeat(2,1fr);gap:18px;}
`;
const Stat = styled.div`
  padding:16px 0;border-bottom:1px solid rgba(255,255,255,.1);
  strong{display:block;color:#f3dbab;font:500 26px "Cinzel Decorative","Times New Roman",serif;letter-spacing:.08em;}
  span{display:block;margin-top:8px;color:rgba(255,247,232,.6);font-size:12px;letter-spacing:.08em;}
`;
const ScrollHint = styled.button`
  position:absolute;left:50%;bottom:28px;z-index:2;transform:translateX(-50%);border:0;background:transparent;color:rgba(255,247,232,.54);cursor:pointer;font-size:12px;letter-spacing:.22em;text-transform:uppercase;
  &::after{content:"";display:block;width:1px;height:42px;margin:12px auto 0;background:linear-gradient(#efd6a2,transparent);}
`;
const WorksSection = styled.section`position:relative;padding:112px 0 130px;background-image:linear-gradient(rgba(239,214,162,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(239,214,162,.025) 1px,transparent 1px);background-size:72px 72px;`;
const SectionHead = styled.div`
  display:flex;justify-content:space-between;gap:40px;align-items:end;margin-bottom:42px;text-align:left;
  h2{margin:0;color:#efd6a2;font:500 clamp(32px,4vw,56px) "Cinzel Decorative","Times New Roman",serif;letter-spacing:.06em;}
  p{max-width:520px;margin:0;color:rgba(255,247,232,.62);line-height:1.8;}
  @media(max-width:760px){display:block;p{margin-top:16px;}}
`;
const WorkGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;@media(max-width:980px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:640px){grid-template-columns:1fr;}`;
const WorkCard = styled(motion.button)`
  position:relative;min-height:430px;overflow:hidden;border:1px solid rgba(239,214,162,.16);border-radius:6px;padding:0;background:#0b0b12;text-align:left;cursor:pointer;
  img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.78) brightness(.74);transition:transform .8s,filter .8s;}
  &::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,10,.08),rgba(5,5,10,.9));}
  &:hover img{transform:scale(1.08);filter:saturate(1) brightness(.9);}
`;
const CardText = styled.div`
  position:absolute;left:24px;right:24px;bottom:24px;z-index:1;
  small{color:rgba(255,247,232,.52);letter-spacing:.18em;text-transform:uppercase;}
  h3{margin:10px 0 8px;color:#efd6a2;font:500 24px "Cinzel Decorative","Times New Roman",serif;}
  p{margin:0;color:rgba(255,247,232,.72);line-height:1.7;font-size:14px;}
`;

const workList = [
  { img: "/assets/work-01.jpg", title: "Gallery", desc: "按年份与月份归档的个人图像收藏库。", route: "/gallery" },
  { img: "/assets/work-02.jpg", title: "Animation Hall", desc: "原创动画、视觉短片与动态实验展厅。", route: "/animation" },
  { img: "/assets/work-03.jpg", title: "Mini Game", desc: "轻量互动游戏入口，保留探索感和一点趣味。", route: "/game" },
  { img: "/assets/work-04.jpg", title: "MBTI Test", desc: "十六人格测试与结果视觉化展示。", route: "/mbti" },
  { img: "/assets/work-05.jpg", title: "Guest Signal", desc: "留下问候、灵感与雨夜短讯的访客通讯站。", route: "/guestbook" },
  { img: "/assets/loading-game-art.jpg", title: "World Archive", desc: "读取空间概念、动态情报与运行状态。", route: "/world" },
];

const headerVariants={hidden:{opacity:0,y:-18},enter:{opacity:1,y:0,transition:{duration:.7}}};
const heroVariants={hidden:{opacity:0,y:28},enter:{opacity:1,y:0,transition:{delay:.25,duration:.85,ease:"easeOut"}}};

export default function Home(){
  const navigate=useNavigate();
  const [activeSection,setActiveSection]=useState("hero");
  const [stationTime,setStationTime]=useState(new Date());

  useEffect(()=>{const timer=window.setInterval(()=>setStationTime(new Date()),1000);return()=>window.clearInterval(timer)},[]);
  useEffect(()=>{
    const handleScroll=()=>{const hero=document.getElementById("hero");if(hero)setActiveSection(window.scrollY<hero.offsetHeight-160?"hero":"works")};
    window.addEventListener("scroll",handleScroll);handleScroll();return()=>window.removeEventListener("scroll",handleScroll);
  },[]);
  const scrollToSection=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return <Wrapper>
    <Header variants={headerVariants} initial="hidden" animate="enter"><NavInner><LogoText>PaL,ve.Future Space</LogoText><NavMenu>
      <NavLink $active={activeSection==="hero"} onClick={()=>scrollToSection("hero")}>首页</NavLink>
      <NavLink $active={activeSection==="works"} onClick={()=>scrollToSection("works")}>入口</NavLink>
      <NavLink onClick={()=>navigate("/guestbook")}>留言</NavLink><NavLink onClick={()=>navigate("/about")}>关于</NavLink><NavLink onClick={()=>navigate("/project")}>项目</NavLink>
    </NavMenu></NavInner></Header>
    <HeroSection id="hero"><VideoCover/><HeroMask/><HeroContent>
      <HeroText variants={heroVariants} initial="hidden" animate="enter"><Eyebrow>Digital archive / visual playground</Eyebrow><HeroTitle>PaL,ve.Future Space</HeroTitle>
        <HeroDesc>一个暗色、克制、带有科技童话气质的个人创意空间。这里收纳图像、动画、互动程序与人格测试，把作品集做成一座可以进入的数字展馆。</HeroDesc>
        <HeroActions><ActionButton $primary onClick={()=>scrollToSection("works")}>进入展馆</ActionButton><ActionButton onClick={()=>navigate("/world")}>读取世界档案</ActionButton></HeroActions>
      </HeroText>
      <StatusPanel variants={heroVariants} initial="hidden" animate="enter"><Stat><strong>06</strong><span>主要功能入口</span></Stat><Stat><strong>16</strong><span>人格结果图谱</span></Stat><Stat><strong>∞</strong><span>持续扩展的作品归档</span></Stat><Stat><strong>{stationTime.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false})}</strong><span>空间站本地时间</span></Stat></StatusPanel>
    </HeroContent><ScrollHint onClick={()=>scrollToSection("works")}>Scroll</ScrollHint></HeroSection>
    <WorksSection id="works"><Container><SectionHead><h2>Featured Gates</h2><p>选择一扇入口，进入图像、动画、互动实验、世界档案与旅人通讯共同构成的未来空间。</p></SectionHead>
      <WorkGrid>{workList.map((item,idx)=><WorkCard key={item.title} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.28}} transition={{delay:idx*.08,duration:.55}} onClick={()=>navigate(item.route)}>
        <img src={item.img} alt="" loading="lazy" decoding="async"/><CardText><small>Gate {String(idx+1).padStart(2,"0")}</small><h3>{item.title}</h3><p>{item.desc}</p></CardText>
      </WorkCard>)}</WorkGrid>
    </Container></WorksSection>
  </Wrapper>;
}
