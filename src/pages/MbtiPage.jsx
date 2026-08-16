import SubpageBackButton from "../components/SubpageBackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// ======================= Styled 样式（修复语法，完善移动端） =======================
const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #05050a;
  background-image:
    linear-gradient(180deg, rgba(5, 5, 10, 0.68), rgba(5, 5, 10, 0.93)),
    linear-gradient(90deg, rgba(239, 214, 162, 0.035) 1px, transparent 1px),
    linear-gradient(rgba(239, 214, 162, 0.025) 1px, transparent 1px),
    url("/assets/bg-banner2.jpg");
  background-position: center, center, center, center top;
  background-size: auto, 72px 72px, 72px 72px, cover;
  background-attachment: fixed;
  color: #ffffff;
  padding: 120px 20px 60px;
  @media(max-width:768px){
    background-attachment: scroll;
    padding: 100px 16px 40px;
  }
`;

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px;
  z-index: 999;
  @media(max-width:768px){
    padding: 20px 16px;
  }
`;
const Brand = styled.div`
  font-size: 24px;
  color: #fff;
  font-family: "Cinzel Decorative", serif;
  @media(max-width:768px){
    font-size:18px;
  }
`;
const NavMenu = styled.div`
  display: flex;
  gap: 36px;
  @media(max-width:768px){
    gap:16px;
  }
`;
const NavLink = styled.span`
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  transition: 0.25s;
  @media(max-width:768px){
    font-size:14px;
  }
  &:hover {
    color: #d4af37;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled(motion.h1)`
  font-size: 48px;
  color: #d4af37;
  letter-spacing: 4px;
  margin-bottom: 16px;
  text-align: center;
  font-family: "Cinzel Decorative", serif;
  @media(max-width:768px){
    font-size:32px;
  }
`;

const SubText = styled(motion.p)`
  font-size: 18px;
  color: #999;
  margin-bottom: 60px;
  text-align:center;
  @media(max-width:768px){
    font-size:15px;
    margin-bottom:40px;
  }
`;

const StartBtn = styled(motion.button)`
  padding: 16px 48px;
  border: 1px solid #d4af37;
  background: transparent;
  color: #d4af37;
  font-size: 20px;
  font-family: "Cinzel Decorative", serif;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  @media(max-width:768px){
    padding:12px 32px;
    font-size:16px;
  }
  &:hover {
    background: #d4af37;
    color: #06060c;
    scale: 1.05;
  }
  &:active {
    scale: 0.96;
  }
`;

const QuestionBox = styled.div`
  max-width: 800px;
  width: 100%;
`;

const QuestionText = styled.h2`
  font-size: 24px;
  margin-bottom: 32px;
  line-height: 1.6;
  @media(max-width:768px){
    font-size:20px;
  }
`;

const OptionBtn = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  margin: 10px 0;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(212,175,55,0.3);
  color: #fff;
  text-align: left;
  font-size: 17px;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.25s;
  @media(max-width:768px){
    font-size:15px;
    padding:14px 18px;
  }
  &:hover {
    border-color: #d4af37;
    background: rgba(212,175,55,0.1);
  }
  &.active {
    background: rgba(212,175,55,0.18);
    border-color: #d4af37;
  }
  &:active {
    scale: 0.98;
  }
  -webkit-tap-highlight-color: transparent;
`;

const ProgressBarWrap = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 99px;
  margin-bottom: 40px;
`;
const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #d4af37;
  border-radius: 99px;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap:wrap;
  gap:12px;
`;
const SmallBtn = styled.button`
  padding: 10px 24px;
  background: transparent;
  border: 1px solid #666;
  color: #aaa;
  cursor: pointer;
  border-radius: 4px;
  @media(max-width:768px){
    padding:10px 14px;
    font-size:14px;
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    border-color: #d4af37;
    color: #d4af37;
  }
  -webkit-tap-highlight-color: transparent;
`;

const ResultCard = styled(motion.div)`
  max-width: 750px;
  width: 100%;
  border: 1px solid rgba(212,175,55,0.4);
  padding: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
  @media(max-width:768px){
    padding:24px 16px;
  }
`;

const PersonalityCode = styled.div`
  font-size: 56px;
  text-align: center;
  margin-bottom:20px;
  @media(max-width:768px){
    font-size:42px;
  }
`;

const AvatarWrap = styled.div`
  text-align:center;
  margin-bottom:24px;
  img{
    width:280px;
    max-width:100%;
    @media(max-width:768px){
      width:220px;
    }
  }
`;

// MBTI 维度可视化容器
const DimensionBlock = styled.div`
  margin: 22px 0;
  position:relative;
`;
const DimensionLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom:8px;
  font-size:15px;
  color:#ccc;
`;
const BarContainer = styled.div`
  width:100%;
  height:8px;
  background:rgba(255,255,255,0.08);
  border-radius:99px;
  position:relative;
  overflow:hidden;
  cursor:help;
`;
const CenterLine = styled.div`
  position:absolute;
  width:2px;
  height:100%;
  left:50%;
  transform:translateX(-50%);
  background:rgba(212,175,55,0.4);
  z-index:2;
`;
const LeftBar = styled(motion.div)`
  position:absolute;
  height:100%;
  left:0;
  top:0;
  border-radius:99px 0 0 99px;
  z-index:1;
`;
const RightBar = styled(motion.div)`
  position:absolute;
  height:100%;
  right:0;
  top:0;
  border-radius:0 99px 99px 0;
  z-index:1;
`;

// 悬浮提示 Tooltip
const Tooltip = styled(motion.div)`
  position:absolute;
  background:#111118;
  border:1px solid #d4af37;
  color:#fff;
  padding:8px 12px;
  border-radius:6px;
  font-size:14px;
  z-index:99;
  pointer-events:none;
  white-space:nowrap;
  bottom:120%;
  left:50%;
  transform:translateX(-50%);
  @media(max-width:768px){
    white-space:normal;
    width:max-content;
    max-width:260px;
  }
`;

// 全部人格弹窗样式
const ModalOverlay = styled(motion.div)`
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.75);
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
`;
const ModalBox = styled(motion.div)`
  width:100%;
  max-width:900px;
  max-height:85vh;
  overflow-y:auto;
  background:#06060c;
  border:1px solid rgba(212,175,55,0.4);
  border-radius:12px;
  padding:36px;
  @media(max-width:768px){
    padding:20px 16px;
  }
`;
const GridWrap = styled.div`
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap:16px;
  margin-top:24px;
  @media(max-width:768px){
    grid-template-columns: repeat(2,1fr);
  }
`;
const TypeCard = styled.div`
  border:1px solid rgba(212,175,55,0.25);
  padding:14px;
  border-radius:8px;
  cursor:pointer;
  transition:0.25s;
  text-align:center;
  &:hover{
    border-color:${props=>props.$color};
    background:rgba(212,175,55,0.06);
  }
  h3{
    margin:6px 0;
    color:${props=>props.$color};
  }
  p{
    font-size:13px;
    color:#aaa;
  }
  -webkit-tap-highlight-color: transparent;
`;
const CloseBtn = styled.button`
  display:block;
  margin:30px auto 0;
  padding:10px 32px;
  border:1px solid #d4af37;
  color:#d4af37;
  background:transparent;
  border-radius:4px;
  cursor:pointer;
  &:hover{
    background:#d4af37;
    color:#06060c;
  }
  -webkit-tap-highlight-color: transparent;
`;

// 5 档选项配置
const selectOptions = [
  {label:"非常同意", value:2},
  {label:"比较赞同", value:1},
  {label:"不确定", value:0},
  {label:"较为反对", value:-1},
  {label:"强烈拒绝", value:-2}
]

// =====================【固定顺序60题题库｜正向反向均衡，顺序永久不变】=====================
// reverse:true = 反向计分题目
const questionList = [
  // EI 维度
  {q:"和朋友聚会结束后，我的精力依旧充沛，想继续聊天。",letter:"E",reverse:false},
  {q:"繁忙的社交之后，我需要独自安静一段时间恢复状态。",letter:"I",reverse:false},
  {q:"想到一件事，我习惯立刻找人交流梳理思路。",letter:"E",reverse:false},
  {q:"重要想法我会在内心反复斟酌成熟，再对外表达。",letter:"I",reverse:false},
  {q:"陌生环境里，我愿意主动开启对话认识新人。",letter:"E",reverse:false},
  {q:"身处陌生人群，我倾向保持观望，不会主动搭话。",letter:"I",reverse:false},
  {q:"日常闲聊能够快速缓解我的疲惫。",letter:"E",reverse:false},
  {q:"长时间交谈会消耗我的精神，需要独处休整。",letter:"I",reverse:false},
  {q:"空闲周末，我更期待外出与人见面。",letter:"E",reverse:true},
  {q:"休息时间，我更愿意一个人安排自己的活动。",letter:"I",reverse:true},
  {q:"团队讨论，我乐于主动发表观点带动氛围。",letter:"E",reverse:true},
  {q:"小组合作，我更喜欢安静完成任务，减少沟通。",letter:"I",reverse:true},
  // SN 维度
  {q:"学习新知识，我优先关注实际案例、落地经验。",letter:"S",reverse:false},
  {q:"接触陌生领域，我优先理解整体理论与内在规律。",letter:"N",reverse:false},
  {q:"我更信任亲身经历、已经验证过的事实。",letter:"S",reverse:false},
  {q:"我常常依靠直觉、灵感预判事情走向。",letter:"N",reverse:false},
  {q:"畅想未来，我优先思考现实可行的方案。",letter:"S",reverse:false},
  {q:"畅想未来时，我热衷于构思各种全新可能性。",letter:"N",reverse:false},
  {q:"欣赏文艺作品，我偏爱写实、贴近现实的故事。",letter:"S",reverse:false},
  {q:"我更容易被奇幻、充满隐喻想象的内容吸引。",letter:"N",reverse:false},
  {q:"改良现有成熟方案，远比从零创新更加稳妥。",letter:"S",reverse:true},
  {q:"我厌倦一成不变的模式，总想尝试新思路。",letter:"N",reverse:true},
  {q:"面对创意，我第一反应评估落地难度。",letter:"S",reverse:true},
  {q:"看待想法，我优先关注它蕴含的想象空间。",letter:"N",reverse:true},
  // TF 维度
  {q:"产生分歧时，我优先客观辨析对错与逻辑。",letter:"T",reverse:false},
  {q:"发生矛盾，我首要考虑如何照顾他人情绪。",letter:"F",reverse:false},
  {q:"评价一件事，公平规则比人情感受更重要。",letter:"T",reverse:false},
  {q:"做决定时，他人处境与感受会显著影响我。",letter:"F",reverse:false},
  {q:"安慰他人时，我习惯直接给出可行解决方案。",letter:"T",reverse:false},
  {q:"安抚别人时，我优先倾听情绪、给予陪伴共情。",letter:"F",reverse:false},
  {q:"争论过程中，我专注辨析逻辑，不太在意气氛。",letter:"T",reverse:false},
  {q:"沟通时我会刻意委婉表达，避免刺伤对方。",letter:"F",reverse:false},
  {q:"资源分配应当严格按照贡献大小划分。",letter:"T",reverse:true},
  {q:"分配资源时，可以适当照顾处境弱势的人。",letter:"F",reverse:true},
  {q:"死板的规则需要遵守，维持整体秩序优先。",letter:"T",reverse:true},
  {q:"僵化的制度，可以根据人情灵活变通。",letter:"F",reverse:true},
  // JP 维度
  {q:"重要事情我会提前规划，不喜欢临时变动。",letter:"J",reverse:false},
  {q:"生活尽量保持灵活，不希望被计划束缚。",letter:"P",reverse:false},
  {q:"任务尽量尽早完成，不愿拖延到截止前夕。",letter:"J",reverse:false},
  {q:"轻微压力下灵感更好，我习惯临近期限冲刺。",letter:"P",reverse:false},
  {q:"出行前，我会规划路线、时间、行程安排。",letter:"J",reverse:false},
  {q:"出游更喜欢漫无目的，随机探索偶遇风景。",letter:"P",reverse:false},
  {q:"临时更改安排，容易让我感到烦躁不安。",letter:"J",reverse:false},
  {q:"计划临时变动，我能接纳，甚至感到新鲜。",letter:"P",reverse:false},
  {q:"开启新项目，我先制定完整方案再动手执行。",letter:"J",reverse:true},
  {q:"新项目先动手尝试，过程中持续调整优化。",letter:"P",reverse:true},
  {q:"日常事务我习惯清单化，按计划推进。",letter:"J",reverse:true},
  {q:"我讨厌被清单约束，更喜欢随机应变。",letter:"P",reverse:true},
  // 第二轮补充题目，提升信度
  {q:"遇到难题，我倾向找人讨论寻找突破口。",letter:"E",reverse:true},
  {q:"遇到困境，我习惯独自长时间思考对策。",letter:"I",reverse:true},
  {q:"我更容易留意事物直观、表面的特征。",letter:"S",reverse:true},
  {q:"我习惯挖掘表象之下隐藏的含义与联系。",letter:"N",reverse:true},
  {q:"观点冲突，我愿意公开辩论寻找真相。",letter:"T",reverse:true},
  {q:"观点存在分歧，我尽量避免正面冲突。",letter:"F",reverse:true},
  {q:"承诺的事项，我尽全力按时兑现。",letter:"J",reverse:true},
  {q:"承诺可以根据后续现实情况灵活调整。",letter:"P",reverse:true},
  {q:"情绪想法我愿意自然表达，不会刻意隐藏。",letter:"E",reverse:true},
  {q:"内心情绪偏向内敛，很少轻易表露在外。",letter:"I",reverse:true},
  {q:"看待问题，我优先关注当下发生的事实。",letter:"S",reverse:true},
  {q:"看待事物，我经常联想未来发展的可能性。",letter:"N",reverse:true},
  {q:"对错标准应当统一，不因个人感受改变。",letter:"T",reverse:true},
  {q:"判断事情，无法脱离当事人自身感受。",letter:"F",reverse:true},
  {q:"居住环境尽量保持整洁有序。",letter:"J",reverse:true},
  {q:"环境随性凌乱，只要自己舒适即可。",letter:"P",reverse:true},
]

// 扩充完整版 16 人格资料库
const personalityData = {
  "INTJ":{
    name:"建筑师｜INTJ",
    temperament:"NT",
    desc:"富有想象力与战略眼光的思想者，擅长长期布局，习惯于推演事物长远走向。拥有独立完整的内在逻辑体系，渴望持续精进认知，天生擅长从混乱中搭建可行方案。内心标准极高，追求效率与深度，常常独自思考宏大命题。",
    adv:"优势：洞察力极强，擅长宏观规划，独立自律，敢于坚持长期目标。局限：容易忽略身边人的情绪感受，对低效、感性行为缺乏耐心，容易过度自我苛责。"
  },
  "INTP":{
    name:"逻辑学家｜INTP",
    temperament:"NT",
    desc:"永不停歇的求知者，痴迷理论、逻辑与抽象推演。热衷于拆解规则、寻找漏洞，享受纯粹思辨带来的乐趣。很少被世俗标准束缚，跟随好奇心探索各类知识，常常沉浸在自我思想世界。",
    adv:"优势：思维发散、思辨能力出众，包容多元观点，创新潜力强。局限：执行力偏弱，难以长期坚持枯燥重复事务，容易无限思考却迟迟不落地。"
  },
  "ENTJ":{
    name:"指挥官｜ENTJ",
    temperament:"NT",
    desc:"天生领导者，意志坚定，目标清晰，擅长统筹人群、规划路线。善于快速发现问题症结，果断推动变革，乐于挑战复杂难题。拥有强大号召力，相信清晰秩序可以驱动一切向前发展。",
    adv:"优势：统筹管理能力突出，决策果敢，不惧竞争，擅长制定战略。局限：行事强势急躁，容易忽视他人情感诉求，容易显得强势压迫。"
  },
  "ENTP":{
    name:"辩论家｜ENTP",
    temperament:"NT",
    desc:"充满好奇心的思想挑战者，热爱思辨、创新与脑洞。乐于多角度审视同一个问题，喜欢碰撞观点，抗拒一成不变的规则。灵感源源不断，擅长发掘隐藏可能性，厌倦单调重复。",
    adv:"优势：头脑灵活，创意充沛，适应力强，擅长即兴发挥。局限：很难长期专注单一任务，容易三分钟热度，不喜欢繁琐细节落地。"
  },
  "INFJ":{
    name:"提倡者｜INFJ",
    temperament:"NF",
    desc:"安静深邃的理想主义者，拥有极强共情力与长远洞察力。能够感知他人难以察觉的情绪与趋势，坚守内心价值观，默默为长远理想持续付出。外表沉静，内心拥有坚定信念。",
    adv:"优势：善解人意，富有远见，忠于本心，拥有治愈他人的力量。局限：极易精神内耗，不擅长直面冲突，习惯独自承担压力。"
  },
  "INFP":{
    name:"调停者｜INFP",
    temperament:"NF",
    desc:"诗意纯粹的理想主义者，遵从内心价值高于一切。感知细腻，共情能力极强，向往真诚、美好的事物，厌恶虚伪与粗暴。重视自我精神世界，不断寻找生命内在意义。",
    adv:"优势：真诚温柔，富有创造力，同理心极强，坚守良知。局限：逃避矛盾，抗压能力偏弱，理想与现实冲突时容易陷入失落。"
  },
  "ENFJ":{
    name:"主人公｜ENFJ",
    temperament:"NF",
    desc:"富有感染力的引导者，善于看见他人潜力，乐于鼓舞身边的人。擅长感知群体情绪，搭建人与人之间的联结，愿意为共同理想带动团队前行。拥有天然的号召力。",
    adv:"优势：擅长共情沟通，擅长发掘他人闪光点，责任感强。局限：过度在意他人评价，习惯讨好别人，忽视自我需求。"
  },
  "ENFP":{
    name:"竞选者｜ENFP",
    temperament:"NF",
    desc:"热情自由的追梦人，充满灵感、乐观活泼。热爱一切新鲜可能性，乐于探索不同生活方式，擅长带动氛围。内心拥有丰富幻想，相信未来拥有无限机会。",
    adv:"优势：创意丰富，乐观开朗，共情力强，适应变化。局限：难以坚持枯燥长期任务，容易兴趣泛滥，难以抉择。"
  },
  "ISTJ":{
    name:"物流师｜ISTJ",
    temperament:"SJ",
    desc:"务实可靠的守护者，重视事实、责任与承诺。做事严谨细致，恪守规则，擅长落地执行，相信经验与积累。稳扎稳打，值得托付，不喜虚无缥缈的空谈。",
    adv:"优势：踏实守信，细致负责，执行力稳定，靠谱稳重。局限：抗拒快速变革，不容易接纳脱离经验的新思路。"
  },
  "ISFJ":{
    name:"守卫者｜ISFJ",
    temperament:"SJ",
    desc:"温柔细心的照料者，默默留意身边人的需求，习惯性付出与守护。擅长记住他人细节喜好，愿意维持环境安稳和谐，低调温和，不求张扬。",
    adv:"优势：耐心体贴，尽职尽责，善于照顾他人情绪。局限：不懂拒绝，习惯性自我消耗，很少主动表达自身需求。"
  },
  "ESTJ":{
    name:"总经理｜ESTJ",
    temperament:"SJ",
    desc:"秩序的组织者，重视效率、规则与责任。擅长统筹安排事务，清晰划分职责，推动事情规范化落地。相信清晰制度可以维持稳定运转。",
    adv:"优势：执行力强悍，务实有条理，管理协调能力优秀。局限：思维偏刻板，难以接纳脱离规则的灵活方案。"
  },
  "ESFJ":{
    name:"执政官｜ESFJ",
    temperament:"SJ",
    desc:"热忱友善的社群维系者，重视人际关系和谐，乐于照顾身边所有人。擅长感知群体氛围，主动维系社交联结，愿意为身边人提供帮助。",
    adv:"优势：热心友善，擅长体察他人情绪，维系氛围。局限：害怕冲突，容易被他人看法左右选择。"
  },
  "ISTP":{
    name:"鉴赏家｜ISTP",
    temperament:"SP",
    desc:"冷静灵活的实干者，擅长动手解决实际问题，适应突发状况。享受理解事物运作原理，不喜冗长规划，依靠临场判断应对挑战。",
    adv:"优势：临场应变强，动手能力优秀，冷静理性。局限：讨厌长期束缚与繁琐计划，不擅长长远规划。"
  },
  "ISFP":{
    name:"探险家｜ISFP",
    temperament:"SP",
    desc:"温和敏感的艺术家，专注感受当下，拥有细腻审美感知。尊重自我感受，热爱美学与自然，不喜宏大理论与空洞说教。",
    adv:"优势：感知力敏锐，审美出众，待人温和真诚。局限：排斥复杂规划，不擅长激烈竞争与冲突。"
  },
  "ESTP":{
    name:"企业家｜ESTP",
    temperament:"SP",
    desc:"活在当下的行动派，擅长捕捉眼前机会，敢于冒险尝试。擅长观察现实环境，临场发挥出色，厌倦枯燥理论空谈。",
    adv:"优势：行动力迅猛，擅长把握机遇，适应现实变化。局限：容易忽略长远风险，耐心不足。"
  },
  "ESFP":{
    name:"表演者｜ESFP",
    temperament:"SP",
    desc:"活力充沛的体验者，热爱当下、享受生活，感染力十足。擅长调动现场气氛，乐于分享喜悦，喜欢丰富有趣的新鲜体验。",
    adv:"优势：乐观热情，擅长活跃氛围，共情直观。局限：难以长期坚持枯燥事务，对长远规划兴趣较低。"
  },
}

// 【修复颜色颠倒！SJ蓝色，SP金色】
const getTypeColor = (temper) => {
  switch (temper){
    case "NT": return "#b088ff"; // 紫色
    case "NF": return "#7cd98c"; // 绿色
    case "SJ": return "#7cb8ff"; // 蓝色
    case "SP": return "#d4af37"; // 金色
    default: return "#d4af37";
  }
}

export default function MbtiPage () {
  const navigate = useNavigate ();
  const [stage, setStage] = useState ("start"); // start / quiz / result
  const [currentQ, setCurrentQ] = useState (0);
  const [answerRecord, setAnswerRecord] = useState (Array (questionList.length).fill (null));
  const [score, setScore] = useState ({E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0});
  // 弹窗控制
  const [showAllModal, setShowAllModal] = useState (false);
  // 悬浮提示 增加唯一标识，防止冲突
  const [activeTipId, setActiveTipId] = useState ("");

  // 选择选项
  const selectOption = (value, targetLetter, isReverse) => {
    let finalVal = value;
    // 反向题目反转分值，平衡问卷偏差
    if (isReverse){
      finalVal = -value;
    }
    const newRecord = [...answerRecord];
    newRecord [currentQ] = {val:finalVal, letter:targetLetter};
    setAnswerRecord (newRecord);
  }

  // 计算最终人格【优化计分逻辑】
  const calculateResult = () => {
    const stat = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
    answerRecord.forEach (res=>{
      if (!res) return;
      const {val,letter} = res;
      stat [letter] += val;
    })
    setScore (stat);
    setStage ("result");
  }

  const goNext = () => {
    if(currentQ < questionList.length - 1){
      setCurrentQ(currentQ+1);
    }else{
      calculateResult();
    }
  }

  const prevQuestion = () => {
    if(currentQ > 0) setCurrentQ(currentQ -1);
  }

  const restartTest = () => {
    setStage("start");
    setCurrentQ(0);
    setAnswerRecord(Array(questionList.length).fill(null));
    setScore({E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0});
  }

  const getPersonalityType = () => {
    const EI = score.E >= score.I ? "E" : "I";
    const SN = score.S >= score.N ? "S" : "N";
    const TF = score.T >= score.F ? "T" : "F";
    const JP = score.J >= score.P ? "J" : "P";
    return `${EI}${SN}${TF}${JP}`
  }

  // ========== 维度条计算 ==========
  const getDimensionBar = (leftScore, rightScore) => {
    const leftAbs = Math.abs (leftScore);
    const rightAbs = Math.abs (rightScore);
    const total = leftAbs + rightAbs;

    if (total === 0){
      return {leftWidth:"50%", rightWidth:"50%", tip:"双方分值持平，倾向中立"};
    }
    const leftRatio = leftAbs / total;
    const rightRatio = rightAbs / total;
    return {
      leftWidth: `${leftRatio * 50}%`,
      rightWidth: `${rightRatio * 50}%`,
      tip:`左侧${(leftRatio*100).toFixed(1)}% | 右侧${(rightRatio*100).toFixed(1)}%`
    }
  }

  const progressPercent = ((currentQ+1)/questionList.length)*100;
  const currentItem = questionList[currentQ];
  const typeCode = getPersonalityType();
  const info = personalityData[typeCode];
  const currentSelect = answerRecord[currentQ];
  const typeColor = info ? getTypeColor(info.temperament) : "#d4af37";

  const eiBar = getDimensionBar(score.I, score.E);
  const snBar = getDimensionBar(score.S, score.N);
  const tfBar = getDimensionBar(score.T, score.F);
  const jpBar = getDimensionBar(score.J, score.P);

  // 判断是否存在临界倾向，用于页面提示
  const isBoundary = (a,b) => Math.abs (a-b) <= 6;
  const boundaryTip = [];
  if (isBoundary (score.E,score.I)) boundaryTip.push ("E/I 倾向模糊");
  if (isBoundary (score.S,score.N)) boundaryTip.push ("S/N 倾向模糊");
  if (isBoundary (score.T,score.F)) boundaryTip.push ("T/F 倾向模糊");
  if (isBoundary (score.J,score.P)) boundaryTip.push ("J/P 倾向模糊");

  return (
    <Wrapper>
      <NavBar>
        <Brand>PaL,ve.Future Space</Brand>
        <NavMenu>
          <NavLink onClick={()=>navigate ("/")}>首页</NavLink>
          <NavLink onClick={()=>navigate ("/about")}>关于网页</NavLink>
          <NavLink onClick={()=>navigate ("/project")}>我的项目</NavLink>
        </NavMenu>
      </NavBar>

      <Container>
        {stage === "start" && (
          <>
            <PageTitle initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              MBTI · 十六人格测试
            </PageTitle>
            <SubpageBackButton />
            <SubText initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
              PaL,ve.Future Space | 优化版64题五点量表，探索属于你的人格原型
            </SubText>
            <div style={{display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center"}}>
              <StartBtn
                whileHover={{scale:1.05}}
                whileTap={{scale:0.96}}
                onClick={()=>setStage("quiz")}
              >
                开始测试
              </StartBtn>
              <StartBtn
                whileHover={{scale:1.05}}
                whileTap={{scale:0.96}}
                onClick={()=>setShowAllModal(true)}
                style={{
                  background: "transparent",
                  color: "#d4af37",
                  border: "1px solid #d4af37"
                }}
              >
                浏览全部人格
              </StartBtn>
            </div>
            <p style={{marginTop:"30px",color:"#777",maxWidth:"650px",textAlign:"center",lineHeight:"1.7"}}>
              温馨提示：请依据你平时真实的行为习惯作答，不要选择理想中期待的自己。本测试仅作趣味参考，不构成专业心理诊断。
            </p>
          </>
        )}

        {stage === "quiz" && currentItem && (
          <QuestionBox>
            <ProgressBarWrap>
              <ProgressFill initial={{width:0}} animate={{width:`${progressPercent}%`}}/>
            </ProgressBarWrap>
            <p style={{color:"#d4af37",marginBottom:12}}>第 {currentQ+1} / {questionList.length} 题</p>
            <QuestionText>{currentItem.q}</QuestionText>
            {selectOptions.map(opt=>(
              <OptionBtn
                key={opt.label}
                className={currentSelect?.val === (currentItem.reverse ? -opt.value : opt.value) ? "active":""}
                whileHover={{scale:1.01}}
                whileTap={{scale:0.98}}
                onClick={()=>selectOption(opt.value, currentItem.letter, currentItem.reverse)}
              >
                {opt.label}
              </OptionBtn>
            ))}
            <NavRow>
              <SmallBtn disabled={currentQ === 0} onClick={prevQuestion}>上一题</SmallBtn>
              <SmallBtn onClick={goNext} disabled={!answerRecord[currentQ]}>
                {currentQ >= questionList.length-1 ? "查看结果":"下一题"}
              </SmallBtn>
              <SmallBtn onClick={()=>navigate("/")}>返回首页</SmallBtn>
            </NavRow>
          </QuestionBox>
        )}

        {stage === "result" && info && (
          <>
            <PageTitle>你的测试结果</PageTitle>
            <ResultCard initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>
              <AvatarWrap>
                <img
                  loading="lazy"
                  decoding="async"
                  src={`/assets/MbtiPage/${typeCode}.jpg`}
                  alt={typeCode}
                  onError={(e)=>{
                    e.target.style.display="none";
                  }}
                />
              </AvatarWrap>
              <PersonalityCode style={{color: typeColor}}>{typeCode}</PersonalityCode>
              <h2 style={{textAlign:"center",marginBottom:"24px",fontSize:"26px",color: typeColor}}>{info.name}</h2>

              {/* 临界倾向提示 */}
              {boundaryTip.length > 0 && (
                <p style={{color:"#ffc970",textAlign:"center",marginBottom:"20px"}}>
                  ⚠️ {boundaryTip.join("、")}，你的人格倾向处于临界区间，不同状态下复测结果可能发生变化。
                </p>
              )}

              {/* 4组维度可视化进度条 */}
              <DimensionBlock
                onMouseEnter={()=>setActiveTipId("ei")}
                onMouseLeave={()=>setActiveTipId("")}
              >
                <DimensionLabelRow>
                  <span>I 内向｜{score.I}</span>
                  <span>E 外向｜{score.E}</span>
                </DimensionLabelRow>
                <BarContainer>
                  <CenterLine/>
                  <LeftBar
                    style={{background:typeColor, width: eiBar.leftWidth}}
                    initial={{width:"50%"}}
                    animate={{width: eiBar.leftWidth}}
                    transition={{duration:1}}
                  />
                  <RightBar
                    style={{background:typeColor, width: eiBar.rightWidth}}
                    initial={{width:"50%"}}
                    animate={{width: eiBar.rightWidth}}
                    transition={{duration:1}}
                  />
                </BarContainer>
                <AnimatePresence>
                  {activeTipId === "ei" && (
                    <Tooltip initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      {eiBar.tip}
                    </Tooltip>
                  )}
                </AnimatePresence>
              </DimensionBlock>

              <DimensionBlock
                onMouseEnter={()=>setActiveTipId("sn")}
                onMouseLeave={()=>setActiveTipId("")}
              >
                <DimensionLabelRow>
                  <span>S 实感｜{score.S}</span>
                  <span>N 直觉｜{score.N}</span>
                </DimensionLabelRow>
                <BarContainer>
                  <CenterLine/>
                  <LeftBar
                    style={{background:typeColor, width: snBar.leftWidth}}
                    initial={{width:"50%"}}
                    animate={{width: snBar.leftWidth}}
                    transition={{duration:1}}
                  />
                  <RightBar
                    style={{background:typeColor, width: snBar.rightWidth}}
                    initial={{width:"50%"}}
                    animate={{width: snBar.rightWidth}}
                    transition={{duration:1}}
                  />
                </BarContainer>
                <AnimatePresence>
                  {activeTipId === "sn" && (
                    <Tooltip initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      {snBar.tip}
                    </Tooltip>
                  )}
                </AnimatePresence>
              </DimensionBlock>

              <DimensionBlock
                onMouseEnter={()=>setActiveTipId("tf")}
                onMouseLeave={()=>setActiveTipId("")}
              >
                <DimensionLabelRow>
                  <span>T 思考｜{score.T}</span>
                  <span>F 情感｜{score.F}</span>
                </DimensionLabelRow>
                <BarContainer>
                  <CenterLine/>
                  <LeftBar
                    style={{background:typeColor, width: tfBar.leftWidth}}
                    initial={{width:"50%"}}
                    animate={{width: tfBar.leftWidth}}
                    transition={{duration:1}}
                  />
                  <RightBar
                    style={{background:typeColor, width: tfBar.rightWidth}}
                    initial={{width:"50%"}}
                    animate={{width: tfBar.rightWidth}}
                    transition={{duration:1}}
                  />
                </BarContainer>
                <AnimatePresence>
                  {activeTipId === "tf" && (
                    <Tooltip initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      {tfBar.tip}
                    </Tooltip>
                  )}
                </AnimatePresence>
              </DimensionBlock>

              <DimensionBlock
                onMouseEnter={()=>setActiveTipId("jp")}
                onMouseLeave={()=>setActiveTipId("")}
              >
                <DimensionLabelRow>
                  <span>J 判断｜{score.J}</span>
                  <span>P 感知｜{score.P}</span>
                </DimensionLabelRow>
                <BarContainer>
                  <CenterLine/>
                  <LeftBar
                    style={{background:typeColor, width: jpBar.leftWidth}}
                    initial={{width:"50%"}}
                    animate={{width: jpBar.leftWidth}}
                    transition={{duration:1}}
                  />
                  <RightBar
                    style={{background:typeColor, width: jpBar.rightWidth}}
                    initial={{width:"50%"}}
                    animate={{width: jpBar.rightWidth}}
                    transition={{duration:1}}
                  />
                </BarContainer>
                <AnimatePresence>
                  {activeTipId === "jp" && (
                    <Tooltip initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      {jpBar.tip}
                    </Tooltip>
                  )}
                </AnimatePresence>
              </DimensionBlock>

              <div style={{margin:"32px 0 10px"}}></div>
              <p style={{lineHeight:"1.8",fontSize:"18px",marginBottom:"24px",color:"#ddd"}}>{info.desc}</p>
              <p style={{lineHeight:"1.8",fontSize:"16px",color:"#bbbbbb"}}>{info.adv}</p>
            </ResultCard>
            <div style={{marginTop:"40px",display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"}}>
              <StartBtn onClick={restartTest}>重新测试</StartBtn>
              <StartBtn onClick={()=>setShowAllModal(true)}>浏览全部人格</StartBtn>
              <StartBtn onClick={()=>navigate("/")}>返回首页</StartBtn>
            </div>
          </>
        )}
      </Container>

      {/* 全部人格弹窗 */}
      <AnimatePresence>
        {showAllModal && (
          <ModalOverlay
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={()=>setShowAllModal(false)}
          >
            <ModalBox
              onClick={e=>e.stopPropagation()}
              initial={{scale:0.9,opacity:0}}
              animate={{scale:1,opacity:1}}
              exit={{scale:0.9,opacity:0}}
            >
              <h2 style={{textAlign:"center",color:"#d4af37",fontFamily:"Cinzel Decorative",fontSize:"28px"}}>全部十六人格</h2>
              <GridWrap>
                {Object.entries(personalityData).map(([code,data])=>{
                  const cardColor = getTypeColor(data.temperament);
                  return(
                    <TypeCard
                      key={code}
                      $color={cardColor}
                      onClick={()=>{
                        setShowAllModal(false);
                        setStage("result");
                        // 满分模拟
                        setScore({
                          E: code[0]==="E" ? 10 : 0,
                          I: code[0]==="I" ? 10 : 0,
                          S: code[1]==="S" ? 10 : 0,
                          N: code[1]==="N" ? 10 : 0,
                          T: code[2]==="T" ? 10 : 0,
                          F: code[2]==="F" ? 10 : 0,
                          J: code[3]==="J" ? 10 : 0,
                          P: code[3]==="P" ? 10 : 0,
                        })
                      }}
                    >
                      <h3>{code}</h3>
                      <p>{data.name}</p>
                    </TypeCard>
                  )
                })}
              </GridWrap>
              <CloseBtn onClick={()=>setShowAllModal(false)}>关闭</CloseBtn>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}
