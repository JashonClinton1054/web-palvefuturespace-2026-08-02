import SubpageBackButton from "../components/SubpageBackButton";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

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
  margin-bottom: 40px;
  @media (max-width:768px){
    font-size:32px;
  }
`;

const ContentBlock = styled(motion.div)`
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Paragraph = styled.p`
  font-size: 17px;
  line-height: 1.8;
  opacity: 0.78;
  @media (max-width:768px){
    font-size:15px;
  }
`;

const SubTitle = styled.h3`
  font-size: 22px;
  color:#e6c597;
  opacity:0.9;
  margin-top: 20px;
  letter-spacing:1px;
`;

const staggerContainer = {
  hidden: {},
  animate: {
    transition: {
      staggerChildren: 0.18
    }
  }
};
const fadeUp = {
  hidden: {opacity:0, y:24},
  animate: {opacity:1, y:0, transition:{duration:0.6, ease:"easeOut"}}
};

export default function About() {
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
          <PageTitle variants={fadeUp}>About · 关于网页</PageTitle>
          <SubpageBackButton />
          <ContentBlock variants={fadeUp}>
            <Paragraph>
              PaL,ve.Future Space — 创意收藏空间站。名称源自口号：<strong>Proletarier aller Länder, vereinigt euch!</strong>
              这是一座属于视觉创作者的交互式数字展馆。网站追求高级、克制、富有科技童话质感，融合创意作品展示与各类趣味交互程序。
            </Paragraph>
            <SubTitle>创作者身份</SubTitle>
            <Paragraph>
              视觉设计师 / AI设计师 / 品牌设计师，持续探索视觉美学与网页交互融合的边界。
              目标打造不止用于陈列图片，每个角落都可交互、充满探索感的个人数字空间。
            </Paragraph>
            <SubTitle>网站功能规划</SubTitle>
            <Paragraph>
              图库展厅、原创动画展厅、休闲小游戏、十六人格测试、项目归档等板块持续开发。
              全部功能入口均可在首页卡片直达。
            </Paragraph>
            <Paragraph>
              全站采用暗黑极简视觉体系，同时适配电脑大屏与移动端访问体验。
            </Paragraph>
            <SubTitle>数据与访客信号</SubTitle>
            <Paragraph>
              为了了解哪些展厅更常被使用，本站会记录匿名随机标识、会话、页面路径、有限交互事件，以及由
              Cloudflare 在边缘端提供的国家、地区、可能不准确的城市与设备类别。IP 只在服务端转换为带秘密盐值的
              不可逆指纹，不在页面或公开接口中显示；不采集街道、精确位置、图库答案、留言输入过程、密码或邮箱。
              启用 Global Privacy Control 或 Do Not Track 的浏览器不会发送行为事件。匿名原始事件保存 30 天后聚合删除，
              旧登录安全记录中的完整 IP 最长保存 7 天；公开留言会先进入整理队列，再决定是否展示。
            </Paragraph>
          </ContentBlock>
        </motion.div>
      </Container>
    </Wrapper>
  )
}
