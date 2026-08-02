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
  width: min(1200px,90%);
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

// 项目网格布局
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 40px;
  @media (max-width:768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

// 项目卡片
const ProjectCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(230, 197, 151, 0.12);
  border-radius: 14px;
  padding: 28px;
  cursor: default;
  transition: 0.3s ease;

  &:hover {
    border-color: rgba(230, 197, 151, 0.35);
    background: rgba(255,255,255,0.05);
  }
`;

const ProjectName = styled.h3`
  font-family: "Cinzel Decorative",serif;
  font-size:24px;
  color:#e6c597;
  letter-spacing:2px;
  margin-bottom:12px;
`;

const ProjectDesc = styled.p`
  font-size:15px;
  line-height:1.7;
  opacity:0.72;
`;

const ProjectTagWrap = styled.div`
  display:flex;
  gap:10px;
  margin-top:20px;
  flex-wrap:wrap;
`;
const Tag = styled.span`
  font-size:12px;
  border:1px solid rgba(230,197,151,0.25);
  color:#e6c597;
  padding:4px 10px;
  border-radius:99px;
  opacity:0.8;
`;

// 动画变量
const staggerContainer = {
  hidden: {},
  animate: {
    transition: {
      staggerChildren: 0.14
    }
  }
};
const fadeUp = {
  hidden: {opacity:0, y:24},
  animate: {opacity:1, y:0, transition:{duration:0.6, ease:"easeOut"}}
};

// 项目数据，后续可以持续新增
const projectList = [
  {
    name: "PaL,ve.Future Space · 主站",
    desc: "个人创意收藏空间站，暗黑交互型作品集网站，集成图库、小游戏、动画展厅、人格测试等交互式模块。",
    tags: ["React","Vite","Styled Components","Framer Motion"]
  },
  {
    name: "品牌视觉设计合集",
    desc: "一系列品牌LOGO、视觉识别系统、海报版式创作，偏向极简未来主义风格。",
    tags: ["品牌设计","视觉","AI视觉"]
  },
  {
    name: "交互式动画实验",
    desc: "网页动效、粒子交互、滚动动画、鼠标跟随特效持续实验项目。",
    tags: ["网页交互","动态设计"]
  },
  {
    name: "创意图像工程",
    desc: "AI生成艺术、图像后期、概念视觉创作素材库。",
    tags: ["AI艺术","概念视觉"]
  }
];

export default function Project() {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <NavBar>
        <LogoText>PaL,ve.Future Space</LogoText>
        <NavMenu>
          <NavLink onClick={()=>navigate("/")}>首页</NavLink>
          <NavLink onClick={()=>navigate("/about")}>关于网页</NavLink>
          <NavLink onClick={()=>navigate("/project")}>我的项目</NavLink>
        </NavMenu>
      </NavBar>

      <Container>
        <motion.div variants={staggerContainer} initial="hidden" animate="animate">
          <PageTitle variants={fadeUp}>Project · 我的项目</PageTitle>
          <ProjectGrid>
            {projectList.map((item,idx)=>(
              <ProjectCard variants={fadeUp} key={idx}>
                <ProjectName>{item.name}</ProjectName>
                <ProjectDesc>{item.desc}</ProjectDesc>
                <ProjectTagWrap>
                  {item.tags.map((tag,i)=>(
                    <Tag key={i}>{tag}</Tag>
                  ))}
                </ProjectTagWrap>
              </ProjectCard>
            ))}
          </ProjectGrid>
        </motion.div>
      </Container>
    </Wrapper>
  )
}