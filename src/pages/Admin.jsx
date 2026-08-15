import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../lib/supabase";

const Shell = styled.main`
  min-height: 100vh;
  color: #f7f2e8;
  background:
    linear-gradient(rgba(9, 10, 14, 0.94), rgba(9, 10, 14, 0.985)),
    url("/assets/bg-banner.jpg") center top / cover fixed;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(237, 207, 151, 0.18);
  background: rgba(9, 10, 14, 0.92);
  backdrop-filter: blur(16px);
`;

const HeaderInner = styled.div`
  width: min(1440px, calc(100% - 40px));
  min-height: 68px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 640px) {
    width: calc(100% - 28px);
  }
`;

const Brand = styled.button`
  border: 0;
  padding: 0;
  color: #edcf97;
  background: transparent;
  cursor: pointer;
  font-family: "Cinzel Decorative", "Times New Roman", serif;
  font-size: 15px;
  letter-spacing: 0.08em;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  min-height: 36px;
  border: 1px solid rgba(237, 207, 151, 0.24);
  border-radius: 4px;
  padding: 0 14px;
  color: ${(props) => (props.$primary ? "#0a0b0e" : "rgba(247, 242, 232, 0.74)")};
  background: ${(props) => (props.$primary ? "#edcf97" : "rgba(255,255,255,0.025)")};
  cursor: pointer;
  font-size: 12px;

  &:disabled { cursor: not-allowed; opacity: 0.42; }
  &:focus-visible { outline: 2px solid #edcf97; outline-offset: 2px; }
`;

const Main = styled.div`
  width: min(1440px, calc(100% - 40px));
  margin: 0 auto;
  padding: 44px 0 96px;

  @media (max-width: 640px) {
    width: calc(100% - 28px);
    padding-top: 28px;
  }
`;

const Heading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;

  h1 { margin: 0; color: #edcf97; font-size: clamp(26px, 4vw, 46px); letter-spacing: 0; }
  p { margin: 8px 0 0; color: rgba(247, 242, 232, 0.48); font-size: 12px; }

  @media (max-width: 760px) {
    align-items: start;
    flex-direction: column;
  }
`;

const Segment = styled.div`
  display: inline-flex;
  border: 1px solid rgba(237, 207, 151, 0.18);
  border-radius: 4px;
  overflow: hidden;

  button {
    min-width: 64px;
    height: 36px;
    border: 0;
    border-right: 1px solid rgba(237, 207, 151, 0.14);
    color: rgba(247, 242, 232, 0.6);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
  }
  button:last-child { border-right: 0; }
  button[aria-pressed="true"] { color: #090a0d; background: #edcf97; }

  @media (max-width: 640px) {
    width: 100%;
    button { min-width: 0; flex: 1 1 20%; }
  }
`;

const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(6, minmax(130px, 1fr));
  border-top: 1px solid rgba(237, 207, 151, 0.18);
  border-bottom: 1px solid rgba(237, 207, 151, 0.18);

  @media (max-width: 1080px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 580px) { grid-template-columns: repeat(2, 1fr); }
`;

const Metric = styled.div`
  min-width: 0;
  padding: 22px 18px;
  border-right: 1px solid rgba(237, 207, 151, 0.12);

  span { display: block; color: rgba(247, 242, 232, 0.42); font-size: 10px; }
  strong { display: block; margin-top: 9px; color: #f7f2e8; font-size: 26px; font-weight: 500; }
`;

const Tabs = styled.nav`
  display: flex;
  gap: 24px;
  margin: 34px 0 22px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(237, 207, 151, 0.14);

  button {
    flex: 0 0 auto;
    border: 0;
    border-bottom: 2px solid transparent;
    padding: 0 0 12px;
    color: rgba(247, 242, 232, 0.48);
    background: transparent;
    cursor: pointer;
    font-size: 12px;
  }
  button[aria-selected="true"] { color: #edcf97; border-bottom-color: #edcf97; }
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Panel = styled.section`
  min-width: 0;
  border-top: 1px solid rgba(237, 207, 151, 0.24);
  padding-top: 18px;

  h2 { margin: 0 0 18px; color: #edcf97; font-size: 14px; font-weight: 500; }
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: minmax(90px, 1fr) minmax(100px, 2fr) 58px;
  align-items: center;
  gap: 12px;
  min-height: 34px;
  font-size: 11px;

  > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(247, 242, 232, 0.7); }
  > span:last-child { color: rgba(247, 242, 232, 0.44); text-align: right; }
  i { display: block; height: 5px; background: rgba(255,255,255,0.07); }
  i::after { display: block; width: var(--width); height: 100%; content: ""; background: #edcf97; }
`;

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-top: 1px solid rgba(255,255,255,0.08);
`;

const Table = styled.table`
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 11px;
  text-align: left;

  th { color: rgba(247, 242, 232, 0.4); font-weight: 400; }
  th, td { padding: 13px 10px; border-bottom: 1px solid rgba(255,255,255,0.07); vertical-align: top; }
  td { color: rgba(247, 242, 232, 0.72); }
  td.message { max-width: 460px; white-space: normal; line-height: 1.65; }
`;

const State = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: rgba(247, 242, 232, 0.58);
  text-align: center;
  line-height: 1.8;
`;

const Login = styled.form`
  width: min(420px, calc(100% - 28px));
  border-top: 1px solid rgba(237, 207, 151, 0.4);
  padding-top: 26px;

  h1 { margin: 0 0 8px; color: #edcf97; font-size: 28px; }
  p { margin: 0 0 28px; color: rgba(247, 242, 232, 0.48); font-size: 12px; }
  label { display: block; margin-bottom: 18px; color: rgba(247, 242, 232, 0.48); font-size: 10px; }
  input { width: 100%; height: 42px; margin-top: 7px; border: 1px solid rgba(237, 207, 151, 0.2); border-radius: 3px; padding: 0 12px; color: #f7f2e8; background: rgba(255,255,255,0.03); }
  ${Button} { width: 100%; margin-top: 6px; }
`;

const Empty = styled.p`
  margin: 22px 0;
  color: rgba(247, 242, 232, 0.38);
  font-size: 12px;
`;

const Notice = styled.p`
  margin: 0 0 20px;
  border-left: 2px solid rgba(237, 207, 151, 0.62);
  padding: 10px 14px;
  color: rgba(247, 242, 232, 0.52);
  background: rgba(237, 207, 151, 0.035);
  font-size: 11px;
  line-height: 1.75;
`;

const TABS = [
  ["overview", "概览"],
  ["geography", "地区"],
  ["devices", "设备"],
  ["visits", "访问明细"],
  ["moderation", "留言审核"],
  ["security", "异常访问"],
];

const asNumber = (value) => Number(value || 0);
const maxOf = (rows, key) => Math.max(1, ...rows.map((row) => asNumber(row[key])));
const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Bars({ rows, label, value = "events" }) {
  const max = maxOf(rows, value);
  if (!rows.length) return <Empty>这个时间段还没有可展示的数据。</Empty>;
  return rows.slice(0, 10).map((row, index) => (
    <BarRow key={`${label(row)}-${index}`}>
      <span title={label(row)}>{label(row)}</span>
      <i style={{ "--width": `${Math.max(2, (asNumber(row[value]) / max) * 100)}%` }} />
      <span>{asNumber(row[value]).toLocaleString("zh-CN")}</span>
    </BarRow>
  ));
}

export default function Admin() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [days, setDays] = useState(7);
  const [tab, setTab] = useState("overview");
  const [snapshot, setSnapshot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visits, setVisits] = useState([]);

  const loadAdmin = useCallback(async (user) => {
    if (!supabase || !user) { setPhase("login"); return; }
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("display_name,email,role,status")
      .eq("user_id", user.id)
      .single();
    if (profileError || data?.role !== "admin" || data?.status !== "approved") {
      setProfile(null);
      setPhase("denied");
      return;
    }
    setProfile(data);
    setPhase("ready");
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase || phase !== "ready") return;
    setError("");
    const now = new Date();
    const endDay = new Date(now);
    endDay.setDate(endDay.getDate() + 1);
    const startDay = days === "all" ? null : new Date(now.getTime() - (days - 1) * 86400000);
    const [analytics, queue, recentVisits] = await Promise.all([
      supabase.rpc("admin_analytics_history_snapshot", {
        p_from: startDay ? localDate(startDay) : null,
        p_to: localDate(endDay),
      }),
      supabase.from("guestbook_messages")
        .select("id,display_name,channel,message,status,created_at,approved_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.rpc("admin_recent_visits", {
        p_from: new Date(now.getTime() - 30 * 86400000).toISOString(),
        p_to: new Date(now.getTime() + 60000).toISOString(),
        p_limit: 200,
      }),
    ]);
    if (analytics.error || queue.error || recentVisits.error) {
      setError("统计链路暂时没有响应，请稍后刷新。 ");
      return;
    }
    setSnapshot(analytics.data);
    setMessages(queue.data || []);
    setVisits(recentVisits.data || []);
  }, [days, phase]);

  useEffect(() => {
    if (!supabase) { setPhase("unavailable"); return undefined; }
    supabase.auth.getUser().then(({ data }) => loadAdmin(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => loadAdmin(session?.user));
    return () => data.subscription.unsubscribe();
  }, [loadAdmin]);

  useEffect(() => { void refresh(); }, [refresh]);

  const signIn = async (event) => {
    event.preventDefault();
    setError("");
    setPhase("signing-in");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) { setError("账号或密码没有对上，请重新确认。 "); setPhase("login"); return; }
    await loadAdmin(data.user);
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSnapshot(null);
    setProfile(null);
    setPhase("login");
  };

  const moderate = async (id, status) => {
    const { error: updateError } = await supabase.from("guestbook_messages")
      .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null })
      .eq("id", id);
    if (updateError) { setError("这条留言暂时没能更新，请再试一次。 "); return; }
    await refresh();
  };

  const exportCsv = () => {
    if (!snapshot) return;
    const rows = [["category", "label", "events", "visitors"]];
    snapshot.pages?.forEach((row) => rows.push(["page", row.path, row.page_views, row.visitors]));
    snapshot.geography?.forEach((row) => rows.push(["geography", `${row.country_code}/${row.region}/${row.city}`, row.events, row.visitors]));
    snapshot.devices?.forEach((row) => rows.push(["device", `${row.device_type}/${row.browser}/${row.os}`, row.events, row.visitors]));
    snapshot.referrers?.forEach((row) => rows.push(["referrer", row.referrer_host, row.events, row.visitors]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    link.download = `palve-analytics-${days === "all" ? "all" : `${days}d`}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const overview = snapshot?.overview || {};
  const pendingCount = useMemo(() => messages.filter((item) => item.status === "pending").length, [messages]);
  const galleryRate = asNumber(overview.gallery_attempts)
    ? `${Math.round((asNumber(overview.gallery_successes) / asNumber(overview.gallery_attempts)) * 100)}%`
    : "-";

  if (["loading", "signing-in"].includes(phase)) return <Shell><State>正在确认管理权限…</State></Shell>;
  if (phase === "unavailable") return <Shell><State>后台尚未连接到 Supabase 配置。</State></Shell>;
  if (phase === "denied") return (
    <Shell><State><div>这个账号没有管理权限。<br /><Button onClick={signOut}>退出账号</Button></div></State></Shell>
  );
  if (phase === "login") return (
    <Shell><State><Login onSubmit={signIn}>
      <h1>Control Room</h1><p>PaL,ve.Future Space 管理员入口</p>
      <label>邮箱<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
      <label>密码<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
      <Button $primary type="submit">进入控制室</Button>
      {error && <p role="alert">{error}</p>}
    </Login></State></Shell>
  );

  return (
    <Shell>
      <Header><HeaderInner>
        <Brand onClick={() => navigate("/")}>PaL,ve.Future Space</Brand>
        <Actions><Button onClick={exportCsv} disabled={!snapshot}>导出 CSV</Button><Button onClick={signOut}>退出</Button></Actions>
      </HeaderInner></Header>
      <Main>
        <Heading><div><h1>Control Room</h1><p>{profile?.display_name || profile?.email} · 仅显示脱敏统计</p></div>
          <Segment aria-label="日期范围">{[[1, "今日"], [7, "7 天"], [30, "30 天"], [90, "90 天"], ["all", "全部"]].map(([value, label]) => (
            <button key={value} aria-pressed={days === value} onClick={() => setDays(value)}>{label}</button>
          ))}</Segment>
        </Heading>
        {error && <Empty role="alert">{error}</Empty>}
        <Metrics>
          <Metric><span>页面浏览</span><strong>{asNumber(overview.page_views).toLocaleString("zh-CN")}</strong></Metric>
          <Metric><span>独立访客（日去重）</span><strong>{asNumber(overview.visitors).toLocaleString("zh-CN")}</strong></Metric>
          <Metric><span>会话</span><strong>{asNumber(overview.sessions).toLocaleString("zh-CN")}</strong></Metric>
          <Metric><span>图库通过率</span><strong>{galleryRate}</strong></Metric>
          <Metric><span>待审核留言</span><strong>{pendingCount}</strong></Metric>
          <Metric><span>疑似机器人事件</span><strong>{asNumber(overview.suspected_bots)}</strong></Metric>
        </Metrics>
        <Tabs role="tablist">{TABS.map(([value, label]) => (
          <button key={value} role="tab" aria-selected={tab === value} onClick={() => setTab(value)}>{label}</button>
        ))}</Tabs>

        {tab === "overview" && <Grid>
          <Panel><h2>热门页面</h2><Bars rows={snapshot?.pages || []} label={(row) => row.path} value="page_views" /></Panel>
          <Panel><h2>来源网站</h2><Bars rows={snapshot?.referrers || []} label={(row) => row.referrer_host} /></Panel>
          <Panel><h2>每日浏览（最近 14 个有数据的日期）</h2><Bars rows={(snapshot?.daily || []).slice(-14)} label={(row) => row.activity_day} value="page_views" /></Panel>
          <Panel><h2>历史与隐私窗口</h2><Empty>页面、地区、设备和来源的按日汇总永久保留；可识别单次访问的脱敏明细只保存 30 天。跨日访客数为每日去重人数之和。</Empty></Panel>
        </Grid>}

        {tab === "geography" && <Panel><h2>国家 / 地区 / 城市（IP 推断，可能不准确）</h2>
          <Notice>Cloudflare 的边缘定位不提供可靠街道地址。本站不会调用第三方精确定位服务，也不会把大致城市包装成街道，以免形成对个人的精确追踪。</Notice>
          <TableWrap><Table><thead><tr><th>国家</th><th>省 / 州</th><th>城市</th><th>事件</th><th>访客</th></tr></thead><tbody>
            {(snapshot?.geography || []).map((row, index) => <tr key={`${row.country_code}-${row.region}-${row.city}-${index}`}><td>{row.country_code}</td><td>{row.region}</td><td>{row.city}</td><td>{row.events}</td><td>{row.visitors}</td></tr>)}
          </tbody></Table></TableWrap></Panel>}

        {tab === "devices" && <Panel><h2>设备环境</h2>
          <TableWrap><Table><thead><tr><th>设备</th><th>浏览器</th><th>系统</th><th>事件</th><th>访客</th></tr></thead><tbody>
            {(snapshot?.devices || []).map((row, index) => <tr key={`${row.device_type}-${row.browser}-${row.os}-${index}`}><td>{row.device_type}</td><td>{row.browser}</td><td>{row.os}</td><td>{row.events}</td><td>{row.visitors}</td></tr>)}
          </tbody></Table></TableWrap></Panel>}

        {tab === "visits" && <Panel><h2>最近 30 天访问明细（最多显示 200 条）</h2>
          <Notice>“访问指纹”是服务端使用秘密盐值生成的不可逆短指纹，并不是原始 IP，也无法还原 IP。明细到期后删除，但不含指纹的按日汇总会永久保留。</Notice>
          <TableWrap><Table style={{ minWidth: 1180 }}><thead><tr><th>时间</th><th>访问指纹</th><th>事件 / 页面</th><th>国家 / 地区 / 城市</th><th>时区 / 网络</th><th>设备环境</th><th>来源</th><th>标记</th></tr></thead><tbody>
            {visits.map((row, index) => <tr key={`${row.occurred_at}-${row.fingerprint}-${index}`}>
              <td>{new Date(row.occurred_at).toLocaleString("zh-CN")}</td>
              <td>{row.fingerprint}</td>
              <td>{row.event_name}{row.event_result ? ` · ${row.event_result}` : ""}<br />{row.path}</td>
              <td>{[row.country_code, row.region, row.city].filter(Boolean).join(" / ")}</td>
              <td>{row.timezone}<br />{row.network}</td>
              <td>{[row.device_type, row.browser, row.os].filter(Boolean).join(" / ")}</td>
              <td>{row.referrer_host}</td>
              <td>{row.suspected_bot ? "疑似机器人" : "正常"}</td>
            </tr>)}
          </tbody></Table></TableWrap>{!visits.length && <Empty>最近 30 天还没有访问明细。</Empty>}</Panel>}

        {tab === "moderation" && <Panel><h2>留言审核</h2>
          <TableWrap><Table><thead><tr><th>时间</th><th>署名</th><th>频道</th><th>内容</th><th>状态</th><th>操作</th></tr></thead><tbody>
            {messages.map((row) => <tr key={row.id}><td>{new Date(row.created_at).toLocaleString("zh-CN")}</td><td>{row.display_name}</td><td>{row.channel}</td><td className="message">{row.message}</td><td>{row.status}</td><td><Actions><Button disabled={row.status === "approved"} onClick={() => moderate(row.id, "approved")}>公开</Button><Button disabled={row.status === "hidden"} onClick={() => moderate(row.id, "hidden")}>隐藏</Button></Actions></td></tr>)}
          </tbody></Table></TableWrap></Panel>}

        {tab === "security" && <Panel><h2>异常高频与疑似机器人（24 小时）</h2>
          <TableWrap><Table><thead><tr><th>脱敏指纹</th><th>地区</th><th>请求</th><th>机器人事件</th><th>首次</th><th>最近</th></tr></thead><tbody>
            {(snapshot?.suspicious || []).map((row) => <tr key={row.fingerprint}><td>{row.fingerprint}</td><td>{[row.country_code, row.city].filter(Boolean).join(" / ") || "未知"}</td><td>{row.request_count}</td><td>{row.bot_events}</td><td>{new Date(row.first_seen_at).toLocaleString("zh-CN")}</td><td>{new Date(row.last_seen_at).toLocaleString("zh-CN")}</td></tr>)}
          </tbody></Table></TableWrap>{!snapshot?.suspicious?.length && <Empty>目前没有达到告警阈值的记录。</Empty>}</Panel>}
      </Main>
    </Shell>
  );
}
