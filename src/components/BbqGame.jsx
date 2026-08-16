import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const rise = keyframes`
  from { opacity: 0; transform: translate3d(0, 18px, 0) scale(.8); }
  to { opacity: .72; transform: translate3d(0, -74px, 0) scale(1.2); }
`;

const spark = keyframes`
  0% { opacity: 0; transform: translate3d(0, 8px, 0) scale(.5); }
  35% { opacity: .9; }
  100% { opacity: 0; transform: translate3d(var(--drift), -52px, 0) scale(1.2); }
`;

const Shell = styled.div`
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  color: #fff7e8;
  background:
    linear-gradient(180deg, rgba(6, 7, 10, .34), rgba(6, 7, 10, .82)),
    url("/assets/MiniGame/game-03.webp") center / cover;
`;

const Topbar = styled.header`
  min-height: 64px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(239, 214, 162, .18);
  padding: 12px 64px 12px 20px;
  background: rgba(7, 7, 11, .84);
  backdrop-filter: blur(12px);

  span { color: rgba(255, 247, 232, .5); font-size: 10px; letter-spacing: .12em; }
  strong { display: block; margin-top: 4px; color: #efd6a2; font-size: 15px; font-weight: 500; }
  > div:nth-child(2) { text-align: center; }
  > div:last-child { text-align: right; }

  @media (max-width: 620px) {
    min-height: 58px;
    padding: 9px 52px 9px 12px;
    gap: 6px;
    span { font-size: 8px; }
    strong { font-size: 12px; }
  }
`;

const Stage = styled.div`
  min-height: 0;
  overflow-y: auto;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(90deg, rgba(5, 5, 8, .72), rgba(5, 5, 8, .22) 50%, rgba(5, 5, 8, .72));

  @media (max-width: 620px) { padding: 14px; }
`;

const Intro = styled.section`
  width: min(640px, 100%);
  border-top: 1px solid rgba(239, 214, 162, .48);
  padding: 28px 0 10px;
  text-align: center;
  text-shadow: 0 2px 12px #000;

  img { width: 118px; max-height: 168px; object-fit: contain; filter: drop-shadow(0 12px 20px rgba(0, 0, 0, .72)); }
  h2 { margin: 12px 0 10px; color: #efd6a2; font: 500 clamp(24px, 4vw, 38px) "Cinzel Decorative", serif; }
  p { margin: 0 auto; max-width: 540px; color: rgba(255, 247, 232, .72); line-height: 1.85; font-size: 13px; }
`;

const PrimaryButton = styled.button`
  min-width: 154px;
  min-height: 42px;
  margin-top: 24px;
  border: 1px solid #efd6a2;
  border-radius: 4px;
  padding: 0 20px;
  color: #09090d;
  background: #efd6a2;
  cursor: pointer;
  font-weight: 700;
  &:hover { background: #ffe5b0; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
`;

const PlayLayout = styled.div`
  width: min(920px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: center;
  gap: 28px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const GrillScene = styled.div`
  position: relative;
  min-height: 390px;
  display: grid;
  place-items: center;
  isolation: isolate;

  @media (max-width: 620px) { min-height: 280px; }
`;

const Grill = styled.div`
  position: relative;
  width: min(430px, 78vw);
  aspect-ratio: 1.65;
  display: grid;
  place-items: center;
  border: 10px solid #2b2928;
  border-radius: 50%;
  background:
    repeating-linear-gradient(0deg, transparent 0 17px, rgba(224, 207, 180, .32) 18px 20px),
    repeating-linear-gradient(90deg, transparent 0 21px, rgba(224, 207, 180, .2) 22px 24px),
    radial-gradient(ellipse, rgba(255, 151, 48, calc(.14 + var(--heat) * .16)), #171413 62%, #090909 72%);
  box-shadow:
    inset 0 0 32px rgba(255, 123, 35, calc(var(--heat) * .32)),
    0 18px 48px rgba(0, 0, 0, .72),
    0 0 calc(20px + var(--heat) * 26px) rgba(255, 124, 39, calc(var(--heat) * .18));
  transform: perspective(700px) rotateX(48deg);

  &::after {
    content: "";
    position: absolute;
    inset: 10%;
    border-radius: 50%;
    border: 1px solid rgba(255, 225, 174, .15);
    pointer-events: none;
  }
`;

const Meat = styled.img`
  width: 38%;
  max-height: 76%;
  object-fit: contain;
  z-index: 2;
  filter:
    sepia(calc(var(--cook) * .52))
    saturate(calc(1 + var(--cook) * 1.5))
    brightness(calc(1.12 - var(--cook) * .52))
    contrast(calc(1 + var(--cook) * .35))
    drop-shadow(0 8px 7px rgba(0, 0, 0, .72));
  transform: rotate(calc(-10deg + var(--flipped) * 200deg)) scaleX(calc(1 - var(--flipped) * .08));
  transition: transform .42s ease, filter .35s linear;
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const GrillMark = styled.i`
  position: absolute;
  z-index: 3;
  width: 24%;
  height: 6px;
  border-radius: 999px;
  background: rgba(40, 12, 4, calc(var(--mark) * .72));
  box-shadow: 0 22px 0 rgba(40, 12, 4, calc(var(--mark) * .64)), 0 -22px 0 rgba(40, 12, 4, calc(var(--mark) * .58));
  transform: rotate(14deg);
  pointer-events: none;
`;

const Smoke = styled.div`
  position: absolute;
  inset: 4% 22% auto;
  height: 150px;
  opacity: var(--smoke);
  pointer-events: none;
  span {
    position: absolute;
    bottom: 0;
    width: 36px;
    height: 60px;
    border-radius: 50%;
    background: rgba(220, 217, 210, .28);
    filter: blur(9px);
    animation: ${rise} 1.8s ease-out infinite;
  }
  span:nth-child(2) { left: 42%; animation-delay: .55s; }
  span:nth-child(3) { right: 8%; animation-delay: 1.05s; }
  @media (prefers-reduced-motion: reduce) { span { animation: none; opacity: .35; } }
`;

const Sparks = styled.div`
  position: absolute;
  inset: 34% 28%;
  pointer-events: none;
  opacity: var(--spark-opacity);
  span {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ffd07e;
    box-shadow: 0 0 8px #ff8d35;
    animation: ${spark} 1.25s linear infinite;
  }
  span:nth-child(2) { left: 42%; animation-delay: .35s; --drift: 20px; }
  span:nth-child(3) { right: 8%; animation-delay: .7s; --drift: -18px; }
  @media (prefers-reduced-motion: reduce) { span { animation: none; opacity: .55; } }
`;

const Controls = styled.aside`
  border-left: 1px solid rgba(239, 214, 162, .28);
  padding-left: 22px;
  h3 { margin: 0 0 8px; color: #efd6a2; font-size: 15px; font-weight: 500; }
  p { margin: 0 0 18px; color: rgba(255, 247, 232, .52); font-size: 11px; line-height: 1.7; }

  @media (max-width: 720px) {
    border-left: 0;
    border-top: 1px solid rgba(239, 214, 162, .22);
    padding: 14px 0 0;
  }
`;

const HeatControl = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid rgba(239, 214, 162, .22);
  border-radius: 4px;
  overflow: hidden;
  button {
    min-height: 38px;
    border: 0;
    border-right: 1px solid rgba(239, 214, 162, .16);
    color: rgba(255, 247, 232, .58);
    background: rgba(8, 8, 12, .78);
    cursor: pointer;
  }
  button:last-child { border-right: 0; }
  button[aria-pressed="true"] { color: #111; background: #efd6a2; }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
  button {
    min-height: 44px;
    border: 1px solid rgba(239, 214, 162, .32);
    border-radius: 4px;
    color: #fff7e8;
    background: rgba(9, 9, 13, .88);
    cursor: pointer;
  }
  button:last-child { color: #17120b; background: #efd6a2; font-weight: 700; }
  button:disabled { opacity: .35; cursor: not-allowed; }
`;

const Cue = styled.div`
  margin-top: 16px;
  color: ${(props) => props.$color};
  font-size: 12px;
  line-height: 1.6;
`;

const Result = styled.section`
  width: min(660px, 100%);
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  align-items: center;
  gap: 30px;
  border-top: 1px solid rgba(239, 214, 162, .46);
  padding-top: 26px;
  img { width: 100%; max-height: 210px; object-fit: contain; filter: drop-shadow(0 12px 18px rgba(0, 0, 0, .76)); }
  h2 { margin: 0; color: #efd6a2; font: 500 clamp(24px, 4vw, 36px) "Cinzel Decorative", serif; }
  p { color: rgba(255, 247, 232, .68); line-height: 1.75; }
  strong { color: #fff; font-size: 28px; font-weight: 500; }

  @media (max-width: 560px) {
    grid-template-columns: 96px 1fr;
    gap: 16px;
    padding-top: 18px;
  }
`;

const RoundScores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  span { border: 1px solid rgba(239, 214, 162, .2); padding: 7px 9px; color: rgba(255, 247, 232, .62); font-size: 10px; }
`;

const HEAT = {
  low: { label: "文火", multiplier: .68, visual: .38 },
  medium: { label: "中火", multiplier: 1, visual: .66 },
  high: { label: "旺火", multiplier: 1.45, visual: 1 },
};

function evaluateMeat(progress, flippedAt) {
  let result;
  if (progress < 28) result = { label: "未熟", points: 18, note: "中心仍然冰凉，再多给它一点耐心。", color: "#9ed7ff" };
  else if (progress < 48) result = { label: "稍生", points: 52, note: "肉汁还很活跃，已经接近可以享用。", color: "#ffb6a9" };
  else if (progress <= 72) result = { label: "恰到好处", points: 100, note: "外焦里嫩，艾克莉西娅已经把盘子递过来了。", color: "#efd6a2" };
  else if (progress <= 88) result = { label: "过熟", points: 44, note: "香气很足，只是肉汁悄悄少了一些。", color: "#e7a66a" };
  else result = { label: "烤焦", points: 8, note: "烟雾抢先抵达，下一片记得早点收火。", color: "#9d8b80" };

  const flipBonus = flippedAt == null ? -10 : Math.max(0, 12 - Math.round(Math.abs(flippedAt - 50) / 3));
  return { ...result, points: Math.max(0, result.points + flipBonus), flipBonus };
}

function finalRating(score) {
  if (score >= 300) return { title: "烤肉大师", text: "三片肉都闪着漂亮的焦香光泽，今晚的餐桌由你负责。" };
  if (score >= 220) return { title: "火候观测员", text: "节奏已经很稳，再抓准一次翻面的瞬间就更好了。" };
  if (score >= 130) return { title: "认真烤肉人", text: "有几片稍微偏离理想火候，但艾克莉西娅还是吃得很开心。" };
  return { title: "烟雾研究员", text: "烤盘留下了不少实验数据，重新挑战一定会更香。" };
}

export default function BbqGame() {
  const [phase, setPhase] = useState("ready");
  const [round, setRound] = useState(1);
  const [progress, setProgress] = useState(0);
  const [heat, setHeat] = useState("medium");
  const [flippedAt, setFlippedAt] = useState(null);
  const [results, setResults] = useState([]);
  const [roundResult, setRoundResult] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const progressRef = useRef(0);
  const heatRef = useRef(heat);
  const flippedAtRef = useRef(flippedAt);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem("palve-bbq-high-score") || 0);
    setHighScore(Number.isFinite(saved) ? saved : 0);
  }, []);

  useEffect(() => { heatRef.current = heat; }, [heat]);
  useEffect(() => { flippedAtRef.current = flippedAt; }, [flippedAt]);

  const finishRound = useCallback((forcedProgress) => {
    const cooked = Math.min(100, forcedProgress ?? progressRef.current);
    const judged = evaluateMeat(cooked, flippedAtRef.current);
    setProgress(cooked);
    setRoundResult(judged);
    setResults((current) => [...current, judged]);
    setPhase("round-result");
  }, []);

  useEffect(() => {
    if (phase !== "grilling") return undefined;
    lastTimeRef.current = performance.now();
    const tick = (time) => {
      const delta = Math.min(80, time - lastTimeRef.current);
      lastTimeRef.current = time;
      const next = Math.min(100, progressRef.current + delta * .0125 * HEAT[heatRef.current].multiplier);
      progressRef.current = next;
      setProgress(next);
      if (next >= 100) finishRound(100);
      else frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [finishRound, phase]);

  const startRound = useCallback((nextRound = 1, reset = false) => {
    if (reset) setResults([]);
    setRound(nextRound);
    setProgress(0);
    progressRef.current = 0;
    setHeat("medium");
    heatRef.current = "medium";
    setFlippedAt(null);
    flippedAtRef.current = null;
    setRoundResult(null);
    setPhase("grilling");
  }, []);

  const flipMeat = useCallback(() => {
    if (phase !== "grilling" || flippedAtRef.current != null) return;
    const value = progressRef.current;
    flippedAtRef.current = value;
    setFlippedAt(value);
  }, [phase]);

  const plateMeat = useCallback(() => {
    if (phase === "grilling") finishRound();
  }, [finishRound, phase]);

  useEffect(() => {
    if (phase !== "grilling") return undefined;
    const handleKey = (event) => {
      if (event.code === "Space") { event.preventDefault(); flipMeat(); }
      if (event.code === "Enter") { event.preventDefault(); plateMeat(); }
      if (["Digit1", "Digit2", "Digit3"].includes(event.code)) {
        setHeat({ Digit1: "low", Digit2: "medium", Digit3: "high" }[event.code]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipMeat, phase, plateMeat]);

  const total = useMemo(() => results.reduce((sum, item) => sum + item.points, 0), [results]);
  const completeGame = () => {
    const nextHigh = Math.max(highScore, total);
    setHighScore(nextHigh);
    window.localStorage.setItem("palve-bbq-high-score", String(nextHigh));
    setPhase("finished");
  };
  const advance = () => round < 3 ? startRound(round + 1) : completeGame();
  const restart = () => startRound(1, true);

  const cue = progress < 28
    ? { text: "表面刚刚升温，肉汁还没有活跃起来。", color: "#9ed7ff" }
    : progress < 48
      ? { text: "边缘开始收紧，油脂发出细小声响。", color: "#ffb6a9" }
      : progress <= 72
        ? { text: "焦香变得清晰，现在是一段很漂亮的窗口。", color: "#efd6a2" }
        : progress <= 88
          ? { text: "颜色正在加深，烟气也慢慢多起来。", color: "#e7a66a" }
          : { text: "烟雾已经很明显，再等下去会只剩实验报告。", color: "#aaa" };
  const reaction = roundResult?.points >= 92 ? "ek_happy.webp" : roundResult?.points >= 45 ? "ek_smile.webp" : "ek_sad.webp";
  const rating = finalRating(total);

  return <Shell>
    <Topbar>
      <div><span>ROUND</span><strong>{phase === "ready" ? "准备" : `${Math.min(round, 3)} / 3`}</strong></div>
      <div><span>TOTAL SCORE</span><strong>{total}</strong></div>
      <div><span>BEST</span><strong>{highScore}</strong></div>
    </Topbar>
    <Stage>
      {phase === "ready" && <Intro>
        <img src="/assets/MiniGame/sprite/ek_happy.webp" alt="开心的艾克莉西娅" />
        <h2>帮艾克莉西娅烤肉吧</h2>
        <p>调整火候，观察颜色、油脂和烟气，在合适的时机翻面并装盘。每局烤三片肉，翻面越接近中段，成品会更均匀。</p>
        <PrimaryButton data-track="bbq-start" onClick={() => startRound(1, true)}>开始烤肉</PrimaryButton>
      </Intro>}

      {phase === "grilling" && <PlayLayout>
        <GrillScene style={{ "--heat": HEAT[heat].visual, "--cook": progress / 100, "--smoke": Math.max(0, (progress - 62) / 38), "--spark-opacity": heat === "high" ? 1 : .42 }}>
          <Smoke><span /><span /><span /></Smoke>
          <Sparks><span style={{ "--drift": "-12px" }} /><span /><span /></Sparks>
          <Grill>
            <Meat src="/assets/MiniGame/sprite/food_meat.webp" alt="正在烤制的肉" style={{ "--cook": progress / 100, "--flipped": flippedAt == null ? 0 : 1 }} />
            <GrillMark style={{ "--mark": Math.max(0, (progress - 34) / 36) }} />
          </Grill>
        </GrillScene>
        <Controls>
          <h3>火候控制</h3>
          <p>文火更从容，旺火变化更快。键盘可使用 1 / 2 / 3 调火、空格翻面、回车装盘。</p>
          <HeatControl aria-label="火候">
            {Object.entries(HEAT).map(([value, item]) => <button key={value} aria-pressed={heat === value} onClick={() => setHeat(value)}>{item.label}</button>)}
          </HeatControl>
          <ActionGrid>
            <button data-track="bbq-flip" disabled={flippedAt != null} onClick={flipMeat}>{flippedAt == null ? "翻面" : "已翻面"}</button>
            <button data-track="bbq-plate" onClick={plateMeat}>装盘</button>
          </ActionGrid>
          <Cue $color={cue.color}>{cue.text}</Cue>
        </Controls>
      </PlayLayout>}

      {phase === "round-result" && roundResult && <Result>
        <img src={`/assets/MiniGame/sprite/${reaction}`} alt="艾克莉西娅的反应" />
        <div>
          <h2>{roundResult.label}</h2>
          <p>{roundResult.note}</p>
          <strong>+{roundResult.points}</strong>
          <p>{roundResult.flipBonus > 0 ? `翻面时机奖励 +${roundResult.flipBonus}` : flippedAt == null ? "这片肉忘记翻面了。" : "翻面时机没有获得额外奖励。"}</p>
          <PrimaryButton data-track="bbq-next" onClick={advance}>{round < 3 ? "烤下一片" : "查看总分"}</PrimaryButton>
        </div>
      </Result>}

      {phase === "finished" && <Result>
        <img src={`/assets/MiniGame/sprite/${total >= 220 ? "ek_full.webp" : total >= 130 ? "ek_happy.webp" : "ek_tired.webp"}`} alt="艾克莉西娅的最终反应" />
        <div>
          <h2>{rating.title}</h2>
          <p>{rating.text}</p>
          <strong>{total} / 336</strong>
          <RoundScores>{results.map((item, index) => <span key={`${item.label}-${index}`}>第 {index + 1} 片 · {item.label} · {item.points}</span>)}</RoundScores>
          <PrimaryButton data-track="bbq-restart" onClick={restart}>重新挑战</PrimaryButton>
        </div>
      </Result>}
    </Stage>
  </Shell>;
}
