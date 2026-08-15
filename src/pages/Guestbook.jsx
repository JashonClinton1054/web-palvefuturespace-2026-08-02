import SubpageBackButton from "../components/SubpageBackButton";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import TurnstileWidget from "../components/TurnstileWidget";
import { submitGuestbookMessage, supabase, trackEvent } from "../lib/supabase";

const Shell = styled.main`
  min-height: 100vh;
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

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(239, 214, 162, 0.16);
  background: rgba(5, 5, 10, 0.84);
  backdrop-filter: blur(18px);
`;

const Container = styled.div`
  width: min(1480px, calc(100% - 64px));
  margin: 0 auto;

  @media (max-width: 720px) {
    width: min(100% - 32px, 620px);
  }
`;

const HeaderInner = styled(Container)`
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Brand = styled.button`
  border: 0;
  padding: 0;
  color: #efd6a2;
  background: transparent;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: 17px;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 560px) {
    font-size: 13px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToolButton = styled.button`
  min-height: 38px;
  border: 1px solid rgba(239, 214, 162, 0.28);
  border-radius: 4px;
  padding: 0 13px;
  color: ${(props) => (props.$active ? "#09080c" : "rgba(255, 247, 232, 0.76)")};
  background: ${(props) => (props.$active ? "#efd6a2" : "rgba(255, 255, 255, 0.03)")};
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.08em;

  &:hover {
    border-color: #efd6a2;
  }

  @media (max-width: 560px) {
    span {
      display: none;
    }
  }
`;

const Hero = styled.section`
  position: relative;
  padding: clamp(86px, 11vw, 160px) 0 74px;
  overflow: hidden;
  border-bottom: 1px solid rgba(239, 214, 162, 0.14);

  &::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    opacity: 0.18;
    background: repeating-linear-gradient(0deg, transparent 0 5px, rgba(255, 255, 255, 0.08) 6px);
  }
`;

const HeroGrid = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: 72px;
  align-items: end;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 46px;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 18px;
  color: rgba(239, 214, 162, 0.66);
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  max-width: 9ch;
  color: #f3dbab;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: clamp(50px, 8vw, 118px);
  line-height: 0.92;
  letter-spacing: 0.02em;
  text-shadow: 0 0 28px rgba(230, 197, 151, 0.18);
`;

const Intro = styled.p`
  max-width: 660px;
  margin: 26px 0 0;
  color: rgba(255, 247, 232, 0.68);
  font-size: 15px;
  line-height: 1.9;
`;

const StationPanel = styled.aside`
  border-left: 1px solid rgba(239, 214, 162, 0.25);
  padding-left: 24px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  }

  span {
    color: rgba(255, 247, 232, 0.46);
    font-size: 10px;
    letter-spacing: 0.13em;
  }

  strong {
    color: #efd6a2;
    font-size: 12px;
    font-weight: 500;
    text-align: right;
  }

  @media (max-width: 860px) {
    border-left: 0;
    padding-left: 0;
  }
`;

const Content = styled(Container)`
  padding-top: 82px;
  padding-bottom: 120px;
`;

const ContentHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;

  h2 {
    margin: 0;
    color: #efd6a2;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: clamp(28px, 4vw, 48px);
  }

  p {
    margin: 0;
    color: rgba(255, 247, 232, 0.48);
    font-size: 11px;
    letter-spacing: 0.1em;
  }

  @media (max-width: 620px) {
    display: block;

    p {
      margin-top: 10px;
    }
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 0.75fr) minmax(0, 1.25fr);
  border: 1px solid rgba(239, 214, 162, 0.18);
  background: rgba(9, 9, 15, 0.74);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  padding: clamp(22px, 3vw, 38px);
  border-right: 1px solid rgba(239, 214, 162, 0.16);

  @media (max-width: 860px) {
    border-right: 0;
    border-bottom: 1px solid rgba(239, 214, 162, 0.16);
  }
`;

const TerminalBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 34px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(239, 214, 162, 0.18);
  color: rgba(239, 214, 162, 0.72);
  font-size: 9px;
  letter-spacing: 0.18em;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 24px;

  > span {
    display: block;
    margin-bottom: 9px;
    color: rgba(255, 247, 232, 0.48);
    font-size: 9px;
    letter-spacing: 0.14em;
  }

  input,
  textarea {
    width: 100%;
    border: 0;
    border-bottom: 1px solid rgba(255, 247, 232, 0.18);
    border-radius: 0;
    outline: 0;
    padding: 11px 0;
    color: #fff7e8;
    background: transparent;
    resize: vertical;
    line-height: 1.7;
  }

  input:focus,
  textarea:focus {
    border-color: #efd6a2;
  }
`;

const ChannelSet = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
  padding: 0;
  border: 0;

  legend {
    width: 100%;
    margin-bottom: 9px;
    color: rgba(255, 247, 232, 0.48);
    font-size: 9px;
    letter-spacing: 0.14em;
  }

  button {
    min-width: 72px;
    height: 32px;
    border: 1px solid rgba(255, 247, 232, 0.15);
    border-radius: 3px;
    color: rgba(255, 247, 232, 0.62);
    background: transparent;
    cursor: pointer;
    font-size: 11px;
  }

  button[data-active="true"] {
    border-color: #efd6a2;
    color: #08070c;
    background: #efd6a2;
  }
`;

const TextAreaWrap = styled.div`
  position: relative;

  small {
    position: absolute;
    right: 0;
    bottom: 9px;
    color: rgba(255, 247, 232, 0.36);
    font-size: 9px;
  }
`;

const Submit = styled.button`
  width: 100%;
  min-height: 48px;
  border: 1px solid #efd6a2;
  border-radius: 4px;
  color: #08070c;
  background: #efd6a2;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.34;
  }
`;

const SignalStatus = styled.p`
  min-height: 20px;
  margin: 12px 0 0;
  color: ${(props) => (props.$warning ? "#f0b98b" : "rgba(239, 214, 162, 0.68)")};
  font-size: 10px;
  line-height: 1.6;
  letter-spacing: 0.06em;
`;

const Honeypot = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Verification = styled.div`
  min-height: 44px;
  margin: -4px 0 16px;
`;

const Log = styled.div`
  min-width: 0;
  padding: clamp(22px, 3vw, 38px);
`;

const Message = styled(motion.article)`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 18px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);

  > span {
    color: rgba(239, 214, 162, 0.58);
    font-size: 9px;
  }

  header,
  footer {
    display: flex;
    justify-content: space-between;
    gap: 18px;
  }

  strong {
    color: #efd6a2;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: 12px;
    font-weight: 500;
  }

  time,
  footer span {
    color: rgba(255, 247, 232, 0.38);
    font-size: 9px;
    letter-spacing: 0.08em;
  }

  p {
    margin: 14px 0;
    color: rgba(255, 247, 232, 0.76);
    font-size: 13px;
    line-height: 1.8;
  }

  footer button {
    border: 0;
    padding: 0;
    color: rgba(255, 247, 232, 0.46);
    background: transparent;
    cursor: pointer;
  }

  footer button:hover {
    color: #efd6a2;
  }

  @media (max-width: 520px) {
    grid-template-columns: 22px 1fr;
    gap: 8px;
  }
`;

const initialMessages = [
  { id: 1, name: "ORBIT-07", channel: "问候", text: "沿着光标留下的轨迹来到这里。愿这座空间站持续更新。", date: "2026.07.26", likes: 12 },
  { id: 2, name: "ANONYMOUS", channel: "雨夜", text: "雨声和暗金色的光很适合慢慢浏览，今晚在图库停留了很久。", date: "2026.07.18", likes: 8 },
  { id: 3, name: "TRAVELER 24", channel: "灵感", text: "动画厅像一扇舷窗。期待看到更多仍在实验中的东西。", date: "2026.06.30", likes: 17 },
];

function useRainSound() {
  const contextRef = useRef(null);
  const sourceRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => () => contextRef.current?.close(), []);

  const toggle = async () => {
    if (active) {
      sourceRef.current?.stop();
      sourceRef.current = null;
      setActive(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = contextRef.current || new AudioContext();
    contextRef.current = context;
    await context.resume();
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const output = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < output.length; i += 1) {
      last = last * 0.985 + (Math.random() * 2 - 1) * 0.015;
      output[i] = last * 2.6;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "lowpass";
    filter.frequency.value = 1700;
    gain.gain.value = 0.14;
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    sourceRef.current = source;
    setActive(true);
  };

  return { active, toggle };
}

export default function Guestbook() {
  const navigate = useNavigate();
  const { active: rainActive, toggle: toggleRain } = useRainSound();
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [channel, setChannel] = useState("问候");
  const [sent, setSent] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [submitState, setSubmitState] = useState(supabase ? "ready" : "offline");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = window.localStorage.getItem("palve-guestbook");
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("palve-guestbook", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    supabase
      .from("guestbook_messages")
      .select("id, display_name, channel, message, likes, created_at")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (!active) return;
        setLoading(false);
        if (error) {
          setSubmitState("offline");
          return;
        }

        const remoteMessages = data.map((item) => ({
          id: item.id,
          name: item.display_name,
          channel: item.channel,
          text: item.message,
          likes: item.likes,
          date: new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
            .format(new Date(item.created_at))
            .replaceAll("/", "."),
        }));
        setMessages((current) => [...current.filter((item) => item.pending), ...remoteMessages]);
      });

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim() || website || !turnstileToken) return;
    const date = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
      .format(new Date())
      .replaceAll("/", ".");
    const pendingMessage = {
      id: `pending-${Date.now()}`,
      name: name.trim() || "ANONYMOUS",
      channel,
      text: text.trim(),
      date,
      likes: 0,
      pending: Boolean(supabase),
    };

    setSubmitState("sending");
    if (supabase) {
      const result = await submitGuestbookMessage({
        displayName: pendingMessage.name,
        channel,
        message: pendingMessage.text,
        turnstileToken,
      });

      if (result.ok) {
        setSubmitState("queued");
        void trackEvent("guestbook_submit", { channel, length: pendingMessage.text.length });
      } else {
        setSubmitState(result.status === 429 ? "cooldown" : result.code === "turnstile_failed" ? "verify" : "offline");
        setTurnstileToken("");
        setTurnstileReset((value) => value + 1);
        return;
      }
    } else {
      setSubmitState("offline");
      return;
    }

    setMessages((current) => [pendingMessage, ...current]);
    setName("");
    setText("");
    setTurnstileToken("");
    setTurnstileReset((value) => value + 1);
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  };

  const like = (id) => {
    setMessages((current) => current.map((item) => (
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    )));
    void trackEvent("guestbook_like", { message_id: String(id).slice(0, 48) });
  };

  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand onClick={() => navigate("/")}>PaL,ve.Future Space</Brand>
          <HeaderActions>
            <ToolButton $active={rainActive} onClick={toggleRain} aria-pressed={rainActive}>
              {rainActive ? "◼" : "▶"} <span>{rainActive ? "雨声播放中" : "播放雨声"}</span>
            </ToolButton>
            <ToolButton onClick={() => navigate("/")} aria-label="返回首页">← <span>返回首页</span></ToolButton>
          </HeaderActions>
        </HeaderInner>
      </Header>

      <Hero>
        <HeroGrid>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <Eyebrow>Visitor transmission / channel 05</Eyebrow>
            <Title>Guest Signal Station</Title>
            <SubpageBackButton />
            <Intro>旅人可以在这里留下短讯、问候或灵感。每条讯息都像漂浮在轨道上的微弱信号，等待下一位访客经过。</Intro>
          </motion.div>
          <StationPanel>
            <div><span>STATION</span><strong>ONLINE</strong></div>
            <div><span>LOCAL TIME</span><strong>{now.toLocaleTimeString("zh-CN", { hour12: false })}</strong></div>
            <div><span>WEATHER</span><strong>{rainActive ? "SYNTHETIC RAIN" : "QUIET ORBIT"}</strong></div>
            <div><span>RECORDS</span><strong>{String(messages.length).padStart(2, "0")} SIGNALS</strong></div>
          </StationPanel>
        </HeroGrid>
      </Hero>

      <Content>
        <ContentHead>
          <h2>Transmission Log</h2>
          <p>{loading ? "CONNECTING TO ARCHIVE" : "MODERATED PUBLIC ARCHIVE"}</p>
        </ContentHead>
        <Board>
          <Form onSubmit={submit}>
            <TerminalBar><span>NEW TRANSMISSION</span><span>PALVE-05</span></TerminalBar>
            <Honeypot aria-hidden="true">
              Website
              <input value={website} onChange={(event) => setWebsite(event.target.value)} autoComplete="off" tabIndex={-1} />
            </Honeypot>
            <Label>
              <span>CALL SIGN / 署名</span>
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="ANONYMOUS" />
            </Label>
            <ChannelSet>
              <legend>CHANNEL / 频道</legend>
              {["问候", "灵感", "雨夜"].map((item) => (
                <button key={item} type="button" data-active={channel === item} onClick={() => setChannel(item)}>
                  {channel === item ? "· " : ""}{item}
                </button>
              ))}
            </ChannelSet>
            <Label>
              <span>MESSAGE / 短讯</span>
              <TextAreaWrap>
                <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={180} rows={6} placeholder="向未来空间发送一条讯息……" required />
                <small>{text.length} / 180</small>
              </TextAreaWrap>
            </Label>
            <Verification>
              <TurnstileWidget onVerify={setTurnstileToken} resetKey={turnstileReset} />
            </Verification>
            <Submit type="submit" disabled={!text.trim() || !turnstileToken || submitState === "sending"} data-track="guestbook-send">
              {submitState === "sending" ? "TRANSMITTING…" : sent ? "SIGNAL RECEIVED" : "SEND TRANSMISSION  →"}
            </Submit>
            <SignalStatus $warning={["offline", "cooldown", "verify"].includes(submitState)} aria-live="polite">
              {submitState === "queued" && "信号已抵达，经过简单整理后会出现在公共频道。"}
              {submitState === "offline" && "轨道连接有些安静，这条信号暂时没有发出，请稍后再试。"}
              {submitState === "cooldown" && "信号来得有点密，稍等一会儿再发送吧。"}
              {submitState === "verify" && "安全验证刚刚走神了，重新确认一下就好。"}
              {submitState === "ready" && "短讯会先进入待整理队列，不会立即公开。"}
            </SignalStatus>
          </Form>

          <Log>
            <TerminalBar><span>RECENT SIGNALS</span><span>{String(messages.length).padStart(2, "0")} RECORDS</span></TerminalBar>
            {messages.slice(0, 6).map((message, index) => (
              <Message key={message.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <header><strong>{message.name}</strong><time>{message.date}</time></header>
                  <p>{message.text}</p>
                  <footer>
                    <span>#{message.channel}{message.pending ? " · 待整理" : ""}</span>
                    <button type="button" onClick={() => like(message.id)} aria-label="喜欢这条留言" disabled={message.pending}>♡ {message.likes}</button>
                  </footer>
                </div>
              </Message>
            ))}
          </Log>
        </Board>
      </Content>
    </Shell>
  );
}
