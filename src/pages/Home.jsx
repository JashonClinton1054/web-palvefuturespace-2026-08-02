import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: #fff;
  background: #06060c;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  padding: 32px 0;
  transition: 0.3s ease;
`;

const Container = styled.div`
  max-width: 1700px;
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const LogoText = styled.div`
  font-family: "Cinzel Decorative", serif;
  font-size: 20px;
  letter-spacing: 2px;
  color: #e6c597;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width:768px){
    gap:20px;
  }
`;

const NavLink = styled.span`
  font-size: 15px;
  opacity: ${props => props.active ? 1 : 0.75};
  color: ${props => props.active ? "#e6c597" : "#ffffff"};
  cursor: pointer;
  transition: 0.25s ease;
  user-select: none;
  &:hover{
    opacity:1;
    color:#e6c597;
  }
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const HeroSection = styled.section`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const VideoCover = styled.div`
  position: absolute;
  inset: 0;
  background: url("/assets/video-cover.jpg") center center / cover no-repeat;
  video {
    width:100%;
    height:100%;
    object-fit:cover;
  }
`;

const HeroMask = styled.div`
  position:absolute;
  inset:0;
  background: rgba(6,6,12,0.45);
`;

const HeroContent = styled(motion.div)`
  position:absolute;
  left:32px;
  bottom:120px;
  max-width:700px;
  padding:0 32px;
  @media (max-width:768px){
    padding:0 20px;
    left:0;
  }
`;

const HeroTitle = styled.h1`
  font-family: "Cinzel Decorative", serif;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom:16px;
  color:#ffffff;
  @media(max-width:768px){
    font-size:32px;
  }
`;

const HeroDesc = styled.p`
  font-size:16px;
  opacity:0.8;
  line-height:1.8;
`;

const WorksSection = styled.section`
  max-width:1700px;
  margin:0 auto;
  padding:140px 32px;
  width:100%;
  @media(max-width:768px){
    padding:100px 20px;
  }
`;

const SectionHead = styled(motion.h2)`
  font-family:"Cinzel Decorative",serif;
  font-size:32px;
  margin-bottom:60px;
  color:#e6c597;
`;

const WorkGrid = styled.div`
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:32px;
  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

const WorkCard = styled(motion.div)`
  position:relative;
  height:420px;
  overflow:hidden;
  cursor:pointer;
  border-radius:6px;
  img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:0.6s ease;
  }
  &:hover img{
    transform:scale(1.06);
  }
`;

const CardMask = styled.div`
  position:absolute;
  inset:0;
  background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
  opacity:0;
  transition:0.4s ease;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  padding:32px;
  ${WorkCard}:hover & {
    opacity:1;
  }
`;

const CardTitle = styled.h3`
  font-family:"Cinzel Decorative",serif;
  font-size:22px;
  margin-bottom:8px;
  color:#e6c597;
`;
const CardText = styled.p`
  font-size:14px;
  opacity:0.85;
`;

// 入场动画配置
const headerVariants = {
  hidden:{opacity:0,y:-20},
  enter:{opacity:1,y:0,transition:{duration:0.7}}
}
const heroVariants = {
  hidden:{opacity:0,y:30},
  enter:{opacity:1,y:0,transition:{delay:0.6,duration:0.8}}
}
const sectionVariants = {
  hidden:{opacity:0,y:24},
  enter:{opacity:1,y:0,transition:{duration:0.6}}
}
const cardVariants = {
  hidden:{opacity:0,y:30},
  enter:{opacity:1,y:0}
}

export default function Home() {
  const navigate = useNavigate();
  // 视频延迟播放：首页先展示封面，3秒后启动视频，减少初始带宽抢占
  const [videoPlayEnabled, setVideoPlayEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const sectionIds = ["hero", "works"];
  const offset = 150;

  // 视频延迟计时器
  useEffect(()=>{
    const videoTimer = setTimeout(()=>{
      setVideoPlayEnabled(true);
    }, 3000);
    return ()=>clearTimeout(videoTimer);
  },[])

  // 滚动导航高亮
  useEffect(()=>{
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let currentId = "";
      for(const id of sectionIds){
        const el = document.getElementById(id);
        if(!el) continue;
        const top = el.offsetTop - offset;
        const bottom = top + el.offsetHeight;
        if(scrollY >= top && scrollY < bottom){
          currentId = id;
          break;
        }
      }
      setActiveSection(currentId);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  },[])

  // 页面内平滑滚动跳转
  const scrollToSection = (id) => {
    const dom = document.getElementById(id);
    if(dom) dom.scrollIntoView({behavior:"smooth"});
  }

  // 作品卡片数据
  const workList = [
    {
      img:"/assets/work-01.jpg",
      title:"Gallery",
      desc:"时间轴个人图库",
      route:"/gallery"
    },
    {
      img:"/assets/work-02.jpg",
      title:"Animation Hall",
      desc:"动画视频展厅",
      route:"/animation"
    },
    {
      img:"/assets/work-03.jpg",
      title:"Mini Game",
      desc:"趣味小游戏专区",
      route:"/game"
    },
    {
      img:"/assets/work-04.jpg",
      title:"MBTI Test",
      desc:"十六人格测试",
      route:"/mbti"
    }
  ]

  return (
    <Wrapper>
      <Header as={motion.header} variants={headerVariants} initial="hidden" animate="enter">
        <Container>
          <LogoText>PaL,ve.Future Space</LogoText>
          <NavMenu>
            <NavLink 
              active={activeSection === "hero"}
              onClick={()=>scrollToSection("hero")}
            >首页</NavLink>
            <NavLink onClick={()=>navigate("/about")}>关于网页</NavLink>
            <NavLink onClick={()=>navigate("/project")}>我的项目</NavLink>
          </NavMenu>
        </Container>
      </Header>

      <HeroSection id="hero">
        <VideoCover>
          <video 
            muted 
            loop 
            playsInline 
            preload="metadata"
            poster="/assets/video-cover.jpg"
            autoPlay={videoPlayEnabled}
          >
            <source src="/assets/bg-video.mp4" type="video/mp4"/>
          </video>
        </VideoCover>
        <HeroMask/>
        <HeroContent variants={heroVariants} initial="hidden" animate="enter">
          <HeroTitle>PaL,ve.Future Space</HeroTitle>
          <HeroDesc>创意收藏空间站。全域可交互，融合动画、图库、趣味实验功能。</HeroDesc>
        </HeroContent>
      </HeroSection>

      <WorksSection id="works">
        <SectionHead variants={sectionVariants} initial="hidden" animate="enter">
          精选功能入口
        </SectionHead>
        <WorkGrid>
          {workList.map((item,idx)=>(
            <WorkCard
              key={idx}
              variants={cardVariants}
              initial="hidden"
              animate="enter"
              transition={{delay:0.25 + idx * 0.12}}
              onClick={()=>navigate(item.route)}
            >
              <img src={item.img} alt={item.title}/>
              <CardMask>
                <CardTitle>{item.title}</CardTitle>
                <CardText>{item.desc}</CardText>
              </CardMask>
            </WorkCard>
          ))}
        </WorkGrid>
      </WorksSection>
    </Wrapper>
  )
}