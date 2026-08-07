import SubpageBackButton from "../components/SubpageBackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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
  background: linear-gradient(180deg, rgba(5, 5, 10, 0.86), rgba(5, 5, 10, 0));
  backdrop-filter: blur(10px);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 18px;
  }
`;

const LogoText = styled.h2`
  margin: 0;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: 18px;
  font-weight: 500;
  color: #efd6a2;
  letter-spacing: 0.12em;

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
  padding: 0;
  color: rgba(255, 247, 232, 0.72);
  cursor: pointer;
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
  width: min(1680px, calc(100% - 64px));
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
  max-width: 660px;
  margin: 0 0 48px;
  color: rgba(255, 247, 232, 0.62);
  line-height: 1.8;
`;

const AccessGate = styled(motion.form)`
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(239, 214, 162, 0.2);
  border-radius: 6px;
  padding: clamp(24px, 4vw, 46px);
  background:
    linear-gradient(135deg, rgba(239, 214, 162, 0.07), transparent 55%),
    rgba(10, 10, 17, 0.86);

  h2 {
    margin: 0 0 10px;
    color: #efd6a2;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: clamp(23px, 3vw, 34px);
    letter-spacing: 0.04em;
  }

  > p {
    margin: 0 0 32px;
    color: rgba(255, 247, 232, 0.56);
    font-size: 13px;
    line-height: 1.8;
  }
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(210px, 0.68fr);
  gap: 28px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Question = styled.label`
  display: block;

  > span {
    display: block;
    min-height: 3.4em;
    margin-bottom: 12px;
    color: rgba(255, 247, 232, 0.82);
    font-size: 14px;
    line-height: 1.7;
  }

  small {
    display: block;
    margin-bottom: 7px;
    color: rgba(239, 214, 162, 0.52);
    font-size: 9px;
    letter-spacing: 0.16em;
  }

  select {
    width: 100%;
    height: 44px;
    border: 1px solid rgba(239, 214, 162, 0.22);
    border-radius: 4px;
    outline: 0;
    padding: 0 12px;
    color: #fff7e8;
    background: #101019;
    cursor: pointer;
  }

  select:focus {
    border-color: #efd6a2;
  }
`;

const GateAside = styled.aside`
  position: relative;
  min-height: 218px;
  overflow: hidden;
  border: 1px solid rgba(239, 214, 162, 0.18);
  border-radius: 4px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(180deg, rgba(8, 7, 12, 0.2), rgba(8, 7, 12, 0.9)),
    url("/assets/gallery/2026/cover.jpg") center / cover no-repeat;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 5px, rgba(255, 255, 255, 0.06) 6px);
    pointer-events: none;
  }

  strong,
  span {
    position: relative;
    z-index: 1;
  }

  strong {
    max-width: 10ch;
    color: #f3dbab;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: 22px;
    line-height: 1.15;
  }

  span {
    color: rgba(255, 247, 232, 0.62);
    font-size: 9px;
    line-height: 1.7;
    letter-spacing: 0.13em;
  }

  @media (max-width: 720px) {
    min-height: 180px;
  }
`;

const gateSpin = keyframes`
  to { transform: rotate(360deg); }
`;

const gatePulse = keyframes`
  0%, 100% { transform: scale(0.92); opacity: 0.55; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const GateResultOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 8;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  background: rgba(7, 7, 12, 0.94);
  backdrop-filter: blur(12px);

  h3 {
    margin: 24px 0 8px;
    color: ${(props) => (props.$success ? "#f3dbab" : "#eeb6ad")};
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: clamp(24px, 4vw, 38px);
  }

  p {
    margin: 0;
    color: rgba(255, 247, 232, 0.62);
    font-size: 13px;
  }
`;

const ResultVisual = styled.div`
  position: relative;
  width: 112px;
  height: 112px;
  display: grid;
  place-items: center;

  &::before,
  &::after {
    position: absolute;
    border-radius: 50%;
    content: "";
  }

  &::before {
    inset: 0;
    border: 1px solid ${(props) => (props.$success ? "rgba(239, 214, 162, 0.68)" : "rgba(238, 182, 173, 0.68)")};
    border-top-color: transparent;
    animation: ${gateSpin} 1.2s linear infinite;
  }

  &::after {
    inset: 17px;
    border: 1px dashed ${(props) => (props.$success ? "rgba(239, 214, 162, 0.42)" : "rgba(238, 182, 173, 0.42)")};
    animation: ${gateSpin} 2.2s linear infinite reverse;
  }

  strong {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #08070c;
    background: ${(props) => (props.$success ? "#efd6a2" : "#eeb6ad")};
    font-size: 24px;
    animation: ${gatePulse} 0.9s ease-in-out infinite;
  }
`;
const DateSelects = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const GateFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 30px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const UnlockButton = styled.button`
  min-height: 44px;
  border: 1px solid #efd6a2;
  border-radius: 4px;
  padding: 0 18px;
  color: #09080d;
  background: #efd6a2;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.08em;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.36;
  }
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const AlbumCard = styled(motion.button)`
  position: relative;
  border: 1px solid rgba(239, 214, 162, 0.14);
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  cursor: pointer;
  padding: 0;
  background: #0c0c13;
  text-align: left;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease, filter 0.7s ease;
    filter: saturate(0.78) brightness(0.76);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.86) 0%, transparent 68%);
    opacity: 0.88;
  }

  &:hover img {
    transform: scale(1.07);
    filter: saturate(1) brightness(0.92);
  }
`;

const CardLabel = styled.div`
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  z-index: 2;

  h3 {
    margin: 0 0 6px;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: 24px;
    color: #efd6a2;
    letter-spacing: 0.06em;
  }

  span {
    color: rgba(255, 247, 232, 0.66);
    font-size: 13px;
  }
`;

const BackBtn = styled(motion.button)`
  margin-bottom: 30px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #efd6a2;
  opacity: 0.72;
  letter-spacing: 0.08em;

  &:hover {
    opacity: 1;
  }
`;

const EmptyState = styled(motion.div)`
  border: 1px solid rgba(239, 214, 162, 0.18);
  border-radius: 6px;
  padding: 42px;
  color: rgba(255, 247, 232, 0.68);
  background: rgba(255, 255, 255, 0.03);
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 42px;
  background: rgba(0, 0, 0, 0.92);
`;

const LightboxImg = styled.img`
  max-width: 90%;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 4px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 28px;
  right: 34px;
  border: 0;
  background: transparent;
  color: #fff7e8;
  font-size: 30px;
  cursor: pointer;
  opacity: 0.72;

  &:hover {
    opacity: 1;
  }
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$left ? "left: 28px;" : "right: 28px;")}
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #fff7e8;
  cursor: pointer;
  font-size: 44px;
  opacity: 0.62;

  &:hover {
    opacity: 1;
  }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const yearData = [
  { year: "2025", cover: "/assets/gallery/2025/cover.jpg" },
  { year: "2026", cover: "/assets/gallery/2026/cover.jpg" },
  { year: "2027", cover: "/assets/gallery/2027/cover.jpg" },
];

const monthDataMap = {
  "2025": [
    { month: "01", cover: "/assets/gallery/2025/2025-01/cover.jpg" },
    { month: "02", cover: "/assets/gallery/2025/2025-02/cover.jpg" },
    { month: "03", cover: "/assets/gallery/2025/2025-03/cover.jpg" },
  ],
  "2026": [
    { month: "06", cover: "/assets/gallery/2026/2026-06/cover.jpg" },
    { month: "07", cover: "/assets/gallery/2026/2026-07/cover.jpg" },
  ],
  "2027": [],
};

const monthImagesMap = {
  "2026-07": [
    "/assets/gallery/2026/2026-07/img01.jpg",
    "/assets/gallery/2026/2026-07/img02.jpg",
    "/assets/gallery/2026/2026-07/img03.jpg",
  ],
};

export default function Gallery() {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState("year");
  const [currentYear, setCurrentYear] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [photoList, setPhotoList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [galleryUnlocked, setGalleryUnlocked] = useState(false);
  const [festivalAnswer, setFestivalAnswer] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gateStatus, setGateStatus] = useState("idle");

  const unlockGallery = (event) => {
    event.preventDefault();
    if (gateStatus !== "idle") return;

    const isCorrect = festivalAnswer === "端午节" && birthMonth === "3" && birthDay === "3";
    setGateStatus(isCorrect ? "success" : "error");

    window.setTimeout(() => {
      if (isCorrect) setGalleryUnlocked(true);
      setGateStatus("idle");
    }, isCorrect ? 1700 : 1500);
  };

  const openYear = (year) => {
    setCurrentYear(year);
    setViewLevel("month");
  };

  const openMonth = (year, month) => {
    const key = `${year}-${month}`;
    setCurrentYear(year);
    setCurrentMonth(month);
    setPhotoList(monthImagesMap[key] || []);
    setViewLevel("photo");
  };

  const goBack = () => {
    if (viewLevel === "photo") setViewLevel("month");
    else if (viewLevel === "month") setViewLevel("year");
  };

  const prevImage = () => setActiveIndex((activeIndex === 0 ? photoList.length : activeIndex) - 1);
  const nextImage = () => setActiveIndex(activeIndex === photoList.length - 1 ? 0 : activeIndex + 1);
  const monthList = monthDataMap[currentYear] || [];

  return (
    <Wrapper>
      <NavBar>
        <LogoText>PaL,ve.Future Space</LogoText>
        <NavMenu>
          <NavLink onClick={() => navigate("/")}>首页</NavLink>
          <NavLink onClick={() => navigate("/animation")}>动画</NavLink>
          <NavLink onClick={() => navigate("/project")}>项目</NavLink>
        </NavMenu>
      </NavBar>

      <Container>
        <PageTitle variants={fadeUp} initial="hidden" animate="animate">Gallery · 我的图库</PageTitle>
        <SubpageBackButton />
        <PageDesc variants={fadeUp} initial="hidden" animate="animate">
          从年份与月份开始，慢慢翻阅留在未来空间里的图像切片与阶段记录。
        </PageDesc>

        {!galleryUnlocked ? (
          <AccessGate
            onSubmit={unlockGallery}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <h2>Before We Enter</h2>
            <p>在翻开相册之前，先回答两个关于老朋友的小问题吧。</p>
            <QuestionGrid>
              <Question>
                <small>QUESTION 01</small>
                <span>哪个节日是阿不思的生日？</span>
                <select value={festivalAnswer} onChange={(event) => { setFestivalAnswer(event.target.value); setGateStatus("idle"); }} aria-label="选择阿不思生日对应的节日">
                  <option value="">请选择节日</option>
                  {["元旦", "春节", "清明节", "劳动节", "端午节", "中秋节", "国庆节"].map((festival) => (
                    <option key={festival} value={festival}>{festival}</option>
                  ))}
                </select>
              </Question>
              <Question>
                <small>QUESTION 02</small>
                <span>艾克莉西娅的生日是哪天？</span>
                <DateSelects>
                  <select value={birthMonth} onChange={(event) => { setBirthMonth(event.target.value); setGateStatus("idle"); }} aria-label="选择生日月份">
                    <option value="">月份</option>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <option key={month} value={String(month)}>{month}月</option>
                    ))}
                  </select>
                  <select value={birthDay} onChange={(event) => { setBirthDay(event.target.value); setGateStatus("idle"); }} aria-label="选择生日日期">
                    <option value="">日期</option>
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                      <option key={day} value={String(day)}>{day}日</option>
                    ))}
                  </select>
                </DateSelects>
              </Question>
              <GateAside aria-hidden="true">
                <strong>MEMORY CHECKPOINT</strong>
                <span>PALVE ARCHIVE / TWO LITTLE QUESTIONS / 2026</span>
              </GateAside>
            </QuestionGrid>
            <GateFooter>
              <UnlockButton type="submit" disabled={!festivalAnswer || !birthMonth || !birthDay || gateStatus !== "idle"}>
                {gateStatus === "idle" ? "看看回答对不对" : "正在确认…"}
              </UnlockButton>
            </GateFooter>
            <AnimatePresence>
              {gateStatus !== "idle" && (
                <GateResultOverlay
                  $success={gateStatus === "success"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  aria-live="polite"
                >
                  <div>
                    <ResultVisual $success={gateStatus === "success"}>
                      <strong>{gateStatus === "success" ? "✓" : "↺"}</strong>
                    </ResultVisual>
                    <h3>{gateStatus === "success" ? "答对啦！" : "差一点点"}</h3>
                    <p>{gateStatus === "success" ? "相册正在从轨道上靠近，请稍等一下…" : "两个答案里似乎有一个走错了方向，再想想看吧。"}</p>
                  </div>
                </GateResultOverlay>
              )}
            </AnimatePresence>          </AccessGate>
        ) : (
          <>
            {viewLevel !== "year" && <BackBtn onClick={goBack} variants={fadeUp} initial="hidden" animate="animate">返回上一层</BackBtn>}

        {viewLevel === "year" && (
          <GridWrap>
            {yearData.map((item, idx) => (
              <AlbumCard key={item.year} variants={fadeUp} initial="hidden" animate="animate" transition={{ delay: idx * 0.08 }} onClick={() => openYear(item.year)}>
                <img loading="lazy" decoding="async" src={item.cover} alt={`${item.year} 相册`} />
                <CardLabel><h3>{item.year}</h3><span>年度相册</span></CardLabel>
              </AlbumCard>
            ))}
          </GridWrap>
        )}

        {viewLevel === "month" && (
          monthList.length > 0 ? (
            <GridWrap>
              {monthList.map((item, idx) => (
                <AlbumCard key={`${currentYear}-${item.month}`} variants={fadeUp} initial="hidden" animate="animate" transition={{ delay: idx * 0.08 }} onClick={() => openMonth(currentYear, item.month)}>
                  <img loading="lazy" decoding="async" src={item.cover} alt={`${currentYear}-${item.month} 相册`} />
                  <CardLabel><h3>{currentYear} · {item.month}月</h3><span>月度相册</span></CardLabel>
                </AlbumCard>
              ))}
            </GridWrap>
          ) : <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>这个年份还没有补充月度相册。</EmptyState>
        )}

        {viewLevel === "photo" && (
          photoList.length > 0 ? (
            <GridWrap>
              {photoList.map((src, idx) => (
                <AlbumCard key={src} variants={fadeUp} initial="hidden" animate="animate" transition={{ delay: idx * 0.08 }} onClick={() => setActiveIndex(idx)}>
                  <img loading="lazy" decoding="async" src={src} alt={`${currentYear}-${currentMonth}-${idx + 1}`} />
                </AlbumCard>
              ))}
            </GridWrap>
          ) : <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>这个月份还没有补充图片。</EmptyState>
        )}
          </>
        )}
      </Container>

      <AnimatePresence>
        {activeIndex !== null && (
          <LightboxOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveIndex(null)}>
            <CloseBtn onClick={() => setActiveIndex(null)}>×</CloseBtn>
            {photoList.length > 1 && <ArrowBtn $left onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</ArrowBtn>}
            <LightboxImg src={photoList[activeIndex]} alt="预览图片" onClick={(e) => e.stopPropagation()} />
            {photoList.length > 1 && <ArrowBtn onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</ArrowBtn>}
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
