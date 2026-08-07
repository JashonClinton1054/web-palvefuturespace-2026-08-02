import SubpageBackButton from "../components/SubpageBackButton";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: #fff7e8;
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
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(5, 5, 10, 0.86), rgba(5, 5, 10, 0));
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 20px 18px;
  }
`;

const LogoText = styled.h2`
  margin: 0;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #efd6a2;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 28px;

  @media (max-width: 640px) {
    gap: 14px;
  }
`;

const NavLink = styled.button`
  border: 0;
  background: transparent;
  color: rgba(255, 247, 232, 0.72);
  cursor: pointer;
  padding: 0;
  font: inherit;
  font-size: 14px;
  transition: 0.25s ease;

  &:hover {
    color: #efd6a2;
  }

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const Container = styled.div`
  width: min(1200px, calc(100% - 64px));
  margin: 0 auto;
  padding-top: 164px;
  padding-bottom: 120px;

  @media (max-width: 768px) {
    width: min(100% - 32px, 620px);
    padding-top: 132px;
  }
`;

const PageTitle = styled(motion.h1)`
  margin: 0 0 16px;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: clamp(36px, 5vw, 64px);
  color: #efd6a2;
  letter-spacing: 0.06em;
`;

const PageDesc = styled(motion.p)`
  max-width: 680px;
  margin: 0 0 48px;
  color: rgba(255, 247, 232, 0.62);
  line-height: 1.8;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
`;

const ProjectCard = styled(motion.article)`
  min-height: 230px;
  padding: 28px;
  border: 1px solid rgba(239, 214, 162, 0.16);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  box-sizing: border-box;
  transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(239, 214, 162, 0.42);
    background: rgba(239, 214, 162, 0.06);
  }
`;

const ProjectName = styled.h3`
  margin: 0 0 14px;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: 22px;
  color: #efd6a2;
  letter-spacing: 0.06em;
  line-height: 1.3;
`;

const ProjectDesc = styled.p`
  margin: 0;
  color: rgba(255, 247, 232, 0.68);
  font-size: 15px;
  line-height: 1.75;
`;

const ProjectTagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
`;

const Tag = styled.span`
  border: 1px solid rgba(239, 214, 162, 0.24);
  border-radius: 999px;
  padding: 5px 10px;
  color: rgba(239, 214, 162, 0.86);
  font-size: 12px;
`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const projectList = [
  {
    name: "PaL,ve.Future Space · 主站",
    desc: "个人创意收藏空间站，整合图库、动画展厅、小游戏、MBTI 测试与项目归档。",
    tags: ["React", "Vite", "Styled Components", "Framer Motion"],
  },
  {
    name: "品牌视觉设计合集",
    desc: "围绕标志、视觉识别、海报版式和 AI 视觉实验展开的品牌设计归档。",
    tags: ["品牌设计", "视觉系统", "AI 视觉"],
  },
  {
    name: "互动动画实验",
    desc: "网页动效、粒子交互、滚动叙事、鼠标跟随与页面转场的持续实验。",
    tags: ["网页交互", "动态设计", "Motion"],
  },
  {
    name: "创意图像工程",
    desc: "AI 生成艺术、图像后期、概念视觉和个人素材库的创作整理。",
    tags: ["AI 艺术", "概念视觉", "图像归档"],
  },
];

export default function Project() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <NavBar>
        <LogoText>PaL,ve.Future Space</LogoText>
        <NavMenu>
          <NavLink onClick={() => navigate("/")}>首页</NavLink>
          <NavLink onClick={() => navigate("/about")}>关于</NavLink>
          <NavLink onClick={() => navigate("/gallery")}>图库</NavLink>
        </NavMenu>
      </NavBar>

      <Container>
        <PageTitle variants={fadeUp} initial="hidden" animate="animate">Project · 我的项目</PageTitle>
        <SubpageBackButton />
        <PageDesc variants={fadeUp} initial="hidden" animate="animate">
          这里用于归档主站功能、视觉实验和持续发展的创作项目。卡片样式已统一成更克制的展馆式信息层级。
        </PageDesc>
        <ProjectGrid>
          {projectList.map((item, idx) => (
            <ProjectCard key={item.name} variants={fadeUp} initial="hidden" animate="animate" transition={{ delay: idx * 0.08 }}>
              <ProjectName>{item.name}</ProjectName>
              <ProjectDesc>{item.desc}</ProjectDesc>
              <ProjectTagWrap>
                {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </ProjectTagWrap>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Container>
    </Wrapper>
  );
}
