import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const destinations = [
  { path: "/", code: "00", title: "首页", en: "Home Station", desc: "回到 PaL,ve.Future Space 主展馆" },
  { path: "/gallery", code: "01", title: "我的图库", en: "Gallery", desc: "按年份与月份归档的图像收藏" },
  { path: "/animation", code: "02", title: "动画展厅", en: "Animation Hall", desc: "动态短片与视觉实验" },
  { path: "/game", code: "03", title: "小游戏", en: "Mini Games", desc: "轻量互动与角色陪伴" },
  { path: "/mbti", code: "04", title: "人格测试", en: "MBTI Test", desc: "探索属于你的人格原型" },
  { path: "/guestbook", code: "05", title: "访客通讯", en: "Guest Signal", desc: "留下问候、灵感与雨夜短讯" },
  { path: "/world", code: "06", title: "世界档案", en: "World Archive", desc: "读取空间概念、动态情报与运行数据" },
  { path: "/project", code: "07", title: "项目档案", en: "Projects", desc: "主站功能与创作项目记录" },
  { path: "/about", code: "08", title: "关于空间", en: "About", desc: "了解名字、方向与空间设定" },
];

const Dock = styled.div`
  position: fixed;
  left: 22px;
  bottom: 22px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 560px) {
    left: 14px;
    bottom: 14px;
  }
`;

const DockButton = styled.button`
  min-height: 40px;
  border: 1px solid rgba(239, 214, 162, 0.3);
  border-radius: 4px;
  padding: 0 13px;
  color: #f3dbab;
  background: rgba(8, 8, 13, 0.78);
  backdrop-filter: blur(14px);
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.13em;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.24);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(239, 214, 162, 0.72);
    background: rgba(20, 18, 22, 0.92);
    transform: translateY(-2px);
  }

  kbd {
    margin-left: 8px;
    color: rgba(255, 247, 232, 0.44);
    font: inherit;
  }

  @media (max-width: 560px) {
    kbd {
      display: none;
    }
  }
`;

const TopButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border: 1px solid rgba(239, 214, 162, 0.26);
  border-radius: 4px;
  color: #efd6a2;
  background: rgba(8, 8, 13, 0.78);
  backdrop-filter: blur(14px);
  cursor: pointer;
  font-size: 17px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: start center;
  padding: min(14vh, 130px) 20px 30px;
  background: rgba(3, 3, 7, 0.76);
  backdrop-filter: blur(16px);

  @media (max-width: 620px) {
    place-items: end center;
    padding: 12px;
  }
`;

const Palette = styled(motion.section)`
  width: min(760px, 100%);
  max-height: min(720px, 78vh);
  overflow: hidden;
  border: 1px solid rgba(239, 214, 162, 0.24);
  border-radius: 6px;
  color: #fff7e8;
  background:
    linear-gradient(135deg, rgba(239, 214, 162, 0.08), transparent 38%),
    rgba(9, 9, 15, 0.97);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);

  @media (max-width: 620px) {
    max-height: 86vh;
  }
`;

const PaletteHead = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(239, 214, 162, 0.14);

  strong {
    color: #efd6a2;
    font-family: "Cinzel Decorative", "Times New Roman", serif;
    font-size: 14px;
    letter-spacing: 0.08em;
  }

  span {
    color: rgba(255, 247, 232, 0.38);
    font-size: 9px;
    letter-spacing: 0.14em;
  }
`;

const SearchBox = styled.label`
  display: grid;
  grid-template-columns: 26px 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 60px;
  padding: 0 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);

  > span:first-child {
    color: #efd6a2;
    font-size: 20px;
  }

  input {
    min-width: 0;
    border: 0;
    outline: 0;
    color: #fff7e8;
    background: transparent;
    font: inherit;
    font-size: 15px;
  }

  small {
    color: rgba(255, 247, 232, 0.34);
    font-size: 9px;
  }
`;

const Results = styled.div`
  max-height: min(510px, 58vh);
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(239, 214, 162, 0.26);
  }
`;

const GroupLabel = styled.p`
  margin: 10px 10px 7px;
  color: rgba(239, 214, 162, 0.48);
  font-size: 8px;
  letter-spacing: 0.18em;
`;

const ResultButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  border: 0;
  border-left: 2px solid ${(props) => (props.$active ? "#efd6a2" : "transparent")};
  border-radius: 3px;
  padding: 13px 12px;
  color: #fff7e8;
  background: ${(props) => (props.$active ? "rgba(239, 214, 162, 0.09)" : "transparent")};
  cursor: pointer;
  text-align: left;

  > span:first-child {
    color: ${(props) => (props.$active ? "#efd6a2" : "rgba(255, 247, 232, 0.32)")};
    font-size: 9px;
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 13px;
    font-weight: 600;
  }

  small {
    margin-top: 4px;
    color: rgba(255, 247, 232, 0.42);
    font-size: 10px;
  }

  > span:last-child {
    color: ${(props) => (props.$current ? "#efd6a2" : "rgba(255, 247, 232, 0.28)")};
    font-size: 14px;
  }
`;

const Empty = styled.div`
  padding: 54px 20px;
  color: rgba(255, 247, 232, 0.48);
  text-align: center;
  font-size: 13px;
`;

const PaletteFoot = styled.footer`
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 13px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 247, 232, 0.32);
  font-size: 8px;
  letter-spacing: 0.1em;

  @media (max-width: 560px) {
    span:last-child {
      display: none;
    }
  }
`;

function readRecent() {
  try {
    const value = JSON.parse(window.localStorage.getItem("palve-recent-pages") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function SpaceNavigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentPaths, setRecentPaths] = useState(readRecent);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const current = destinations.find((item) => item.path === location.pathname);
    if (!current || current.path === "/") return;

    setRecentPaths((previous) => {
      const next = [current.path, ...previous.filter((path) => path !== current.path)].slice(0, 4);
      window.localStorage.setItem("palve-recent-pages", JSON.stringify(next));
      return next;
    });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !isTyping && !open) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return destinations;
    return destinations.filter((item) => (
      item.title.toLowerCase().includes(keyword)
      || item.en.toLowerCase().includes(keyword)
      || item.desc.toLowerCase().includes(keyword)
    ));
  }, [query]);

  const recent = recentPaths
    .map((path) => destinations.find((item) => item.path === path))
    .filter(Boolean);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [activeIndex, filtered.length]);

  const goTo = (path) => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    if (path !== location.pathname) navigate(path);
  };

  const handlePaletteKeys = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      goTo(filtered[activeIndex].path);
    }
  };

  const renderResult = (item, index, keyPrefix = "all") => (
    <ResultButton
      key={keyPrefix + item.path}
      type="button"
      $active={index === activeIndex}
      $current={item.path === location.pathname}
      onMouseEnter={() => setActiveIndex(index)}
      onClick={() => goTo(item.path)}
    >
      <span>{item.code}</span>
      <span><strong>{item.title} · {item.en}</strong><small>{item.desc}</small></span>
      <span>{item.path === location.pathname ? "●" : "→"}</span>
    </ResultButton>
  );

  return (
    <>
      <Dock>
        <DockButton type="button" onClick={() => setOpen(true)} aria-label="打开空间导航器">
          NAVIGATION <kbd>⌘K</kbd>
        </DockButton>
        <AnimatePresence>
          {showTop && (
            <TopButton
              type="button"
              aria-label="回到页面顶部"
              title="回到顶部"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              ↑
            </TopButton>
          )}
        </AnimatePresence>
      </Dock>

      <AnimatePresence>
        {open && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <Palette
              role="dialog"
              aria-modal="true"
              aria-label="空间导航器"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{ duration: 0.22 }}
              onKeyDown={handlePaletteKeys}
            >
              <PaletteHead>
                <strong>PaL,ve.Space Navigator</strong>
                <span>SECTOR INDEX / 00—08</span>
              </PaletteHead>
              <SearchBox>
                <span aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                  placeholder="搜索功能、页面或关键词…"
                  aria-label="搜索空间页面"
                />
                <small>ESC 关闭</small>
              </SearchBox>
              <Results>
                {!query && recent.length > 0 && (
                  <>
                    <GroupLabel>RECENT SIGNALS / 最近访问</GroupLabel>
                    {recent.slice(0, 2).map((item) => {
                      const index = filtered.findIndex((entry) => entry.path === item.path);
                      return renderResult(item, index, "recent");
                    })}
                    <GroupLabel>ALL SECTORS / 全部入口</GroupLabel>
                  </>
                )}
                {filtered.length > 0 ? filtered.map((item, index) => renderResult(item, index, "all")) : <Empty>这里暂时没有匹配的入口，换个关键词试试吧。</Empty>}
              </Results>
              <PaletteFoot>
                <span>↑↓ 选择　ENTER 前往　ESC 关闭</span>
                <span>{String(filtered.length).padStart(2, "0")} DESTINATIONS ONLINE</span>
              </PaletteFoot>
            </Palette>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}



