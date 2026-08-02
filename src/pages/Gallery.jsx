import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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
  width: min(1700px,92%);
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

// 网格布局
const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px,1fr));
  gap: 32px;
  @media (max-width:1024px){
    grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
    gap:24px;
  }
  @media (max-width:640px){
    grid-template-columns: repeat(auto-fill, minmax(100%,1fr));
  }
`;

// 相册卡片（核心样式，hover遮罩+文字浮现，对标ungetsu风格）
const AlbumCard = styled(motion.div)`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  cursor: pointer;
  border: 1px solid rgba(230, 197, 151, 0.1);

  img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition: transform 0.6s ease;
  }

  /* 渐变遮罩 */
  &::after{
    content:"";
    position:absolute;
    inset:0;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 65%);
    opacity:0;
    transition: opacity 0.4s ease;
  }

  &:hover img{
    transform: scale(1.07);
  }
  &:hover::after{
    opacity:1;
  }
`;

// 卡片标题文字
const CardLabel = styled.div`
  position:absolute;
  left:24px;
  bottom:24px;
  z-index:2;
  transform: translateY(12px);
  opacity:0;
  transition: all 0.4s ease;
  pointer-events:none;

  h3{
    font-family: "Cinzel Decorative",serif;
    font-size:22px;
    color:#e6c597;
    letter-spacing:2px;
    margin:0;
  }
  span{
    font-size:13px;
    opacity:0.75;
  }

  ${AlbumCard}:hover & {
    opacity:1;
    transform: translateY(0);
  }
`;

// 返回按钮
const BackBtn = styled(motion.div)`
  display:inline-block;
  margin-bottom:32px;
  cursor:pointer;
  font-family: "Cinzel Decorative",serif;
  color:#e6c597;
  opacity:0.7;
  transition:0.3s;
  &:hover{opacity:1;}
`;

// 大图预览
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;
const LightboxImg = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
`;
const CloseBtn = styled.div`
  position: absolute;
  top: 32px;
  right: 40px;
  color:#fff;
  font-size:32px;
  cursor: pointer;
  opacity:0.7;
  transition:0.2s;
  &:hover{opacity:1;}
`;
const ArrowBtn = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size:48px;
  color:#fff;
  cursor: pointer;
  opacity:0.6;
  transition:0.2s;
  user-select:none;
  &:hover{opacity:1;}
  ${props => props.left ? "left:32px" : "right:32px"}
`;

// 动画配置
const staggerContainer = {
  hidden: {},
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};
const fadeUp = {
  hidden: {opacity:0, y:20},
  animate: {opacity:1, y:0, transition:{duration:0.5}}
};

// ========== 相册数据源配置区（后续新增在这里修改） ==========
// 年份封面数据
const yearData = [
  {
    year:"2025",
    cover:"/assets/gallery/2025/cover.jpg", // 在2025文件夹放入cover.jpg作为年份封面
  },
  {
    year:"2026",
    cover:"/assets/gallery/2026/cover.jpg", // 在2026文件夹放入cover.jpg
  },
  {
    year:"2027",
    cover:"/assets/gallery/2027/cover.jpg",
  }
];

// 示例：2026年月份数据，你后续扩充所有年月
const monthDataMap = {
  "2026":[
    {month:"06", cover:"/assets/gallery/2026/2026-06/cover.jpg"},
    {month:"07", cover:"/assets/gallery/2026/2026-07/cover.jpg"},
    {month:"08", cover:"/assets/gallery/2026/2026-08/cover.jpg"},
    {month:"09", cover:"/assets/gallery/2026/2026-09/cover.jpg"},
    {month:"10", cover:"/assets/gallery/2026/2026-10/cover.jpg"},
    {month:"11", cover:"/assets/gallery/2026/2026-11/cover.jpg"},
    {month:"12", cover:"/assets/gallery/2026/2026-12/cover.jpg"},
  ],
  "2025":[
    {month:"01", cover:"/assets/gallery/2025/2025-01/cover.jpg"},
    {month:"02", cover:"/assets/gallery/2025/2025-02/cover.jpg"},
    {month:"03", cover:"/assets/gallery/2025/2025-03/cover.jpg"},
  ],
  "2027":[
    {month:"01", cover:"/assets/gallery/2027/2027-01/cover.jpg"},
  ]
};

// 示例：某月份内图片集合，新增图片在这里追加路径
const monthImagesMap = {
  "2026-07":[
    "/assets/gallery/2026/2026-07/img01.jpg",
    "/assets/gallery/2026/2026-07/img02.jpg",
    "/assets/gallery/2026/2026-07/img03.jpg",
  ]
};
// =====================================================

export default function Gallery() {
  const navigate = useNavigate();
  // 页面层级状态：year / month / photo
  const [viewLevel, setViewLevel] = useState("year");
  const [currentYear, setCurrentYear] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [photoList, setPhotoList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  // 进入年份 → 展示月份列表
  const openYear = (year) => {
    setCurrentYear(year);
    setViewLevel("month");
  };
  // 进入月份 → 加载当月图片，展示图库
  const openMonth = (year, month) => {
    const key = `${year}-${month}`;
    setCurrentYear(year);
    setCurrentMonth(month);
    setPhotoList(monthImagesMap[key] || []);
    setViewLevel("photo");
  };
  // 返回上一级
  const goBack = () => {
    if(viewLevel === "photo") setViewLevel("month");
    else if(viewLevel === "month") setViewLevel("year");
  };

  // 大图切换
  const prevImage = () => {
    if(activeIndex === 0) setActiveIndex(photoList.length - 1);
    else setActiveIndex(activeIndex - 1);
  };
  const nextImage = () => {
    if(activeIndex === photoList.length -1) setActiveIndex(0);
    else setActiveIndex(activeIndex + 1);
  };

  return (
    <Wrapper>
      <NavBar>
        <LogoText>PaL,ve.Future Space</LogoText>
       <NavMenu>
  <NavLink onClick={()=>navigate("/")}>首页</NavLink>
  <NavLink onClick={()=>navigate("/gallery")}>图库</NavLink>
  <NavLink onClick={()=>navigate("/animation")}>动画展厅</NavLink>
</NavMenu>
      </NavBar>

      <Container>
        <motion.div variants={staggerContainer} initial="hidden" animate="animate">
          <PageTitle variants={fadeUp}>Gallery · 我的图库</PageTitle>

          {/* 返回按钮 */}
          {viewLevel !== "year" && (
            <BackBtn onClick={goBack} variants={fadeUp}>
              ← 返回上一层
            </BackBtn>
          )}

          {/* 层级1：年份列表 */}
          {viewLevel === "year" && (
            <GridWrap>
              {yearData.map((item,idx)=>(
                <AlbumCard
                  key={idx}
                  variants={fadeUp}
                  onClick={()=>openYear(item.year)}
                >
                  <img src={item.cover} alt={item.year}/>
                  <CardLabel>
                    <h3>{item.year}</h3>
                    <span>相册年份</span>
                  </CardLabel>
                </AlbumCard>
              ))}
            </GridWrap>
          )}

          {/* 层级2：当前年份下的月份列表 */}
          {viewLevel === "month" && (
            <GridWrap>
              {monthDataMap[currentYear]?.map((item,idx)=>(
                <AlbumCard
                  key={idx}
                  variants={fadeUp}
                  onClick={()=>openMonth(currentYear, item.month)}
                >
                  <img src={item.cover} alt={`${currentYear}-${item.month}`}/>
                  <CardLabel>
                    <h3>{currentYear} · {item.month}月</h3>
                    <span>月度相册</span>
                  </CardLabel>
                </AlbumCard>
              ))}
            </GridWrap>
          )}

          {/* 层级3：当月全部图片 */}
          {viewLevel === "photo" && (
            <GridWrap>
              {photoList.map((src,idx)=>(
                <AlbumCard
                  key={idx}
                  variants={fadeUp}
                  onClick={()=>setActiveIndex(idx)}
                >
                  <img src={src} alt={`${currentYear}-${currentMonth}-img${idx+1}`}/>
                </AlbumCard>
              ))}
            </GridWrap>
          )}
        </motion.div>
      </Container>

      {/* 大图预览弹窗 */}
      <AnimatePresence>
        {activeIndex !== null && (
          <LightboxOverlay
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={()=>setActiveIndex(null)}
          >
            <CloseBtn>✕</CloseBtn>
            <ArrowBtn left onClick={(e)=>{e.stopPropagation(); prevImage()}}>←</ArrowBtn>
            <LightboxImg src={photoList[activeIndex]}/>
            <ArrowBtn onClick={(e)=>{e.stopPropagation(); nextImage()}}>→</ArrowBtn>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}