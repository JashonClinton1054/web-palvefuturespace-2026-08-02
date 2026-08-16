import SubpageBackButton from "../components/SubpageBackButton";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import BbqGame from "../components/BbqGame";

// ====================== 样式定义 ======================
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
    url("/assets/bg-banner2.jpg");
  background-position: center, center, center, center top;
  background-size: auto, 72px 72px, 72px 72px, cover;
  background-attachment: fixed;
  padding: 120px 20px 60px;
  @media (max-width:768px){
    background-attachment: scroll;
    padding: 100px 12px 40px;
  }
`;
const NavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.5rem;
  padding: 32px 4rem;
  z-index: 998;
  font-family: "Cinzel Decorative", serif;
  a {
    color: #cccccc;
    text-decoration: none;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: #e6c882;
    }
  }
`;
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;
const PageTitle = styled(motion.h1)`
  font-family: "Cinzel Decorative",serif;
  font-size: clamp(2rem,5vw,3rem);
  text-align:center;
  margin-bottom:48px;
  color:#e6c882;
`;
const GameGrid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(360px,1fr));
  gap:32px;
  @media (max-width:768px){
    grid-template-columns:1fr;
  }
`;
const GameCard = styled(motion.div)`
  border:1px solid #333;
  border-radius:16px;
  overflow:hidden;
  background:#0c0c16;
  cursor:pointer;
  transition:0.3s ease;
  &:hover{
    border-color:#e6c882;
  }
`;
const CardImg = styled.img`
  width:100%;
  height:240px;
  object-fit:cover;
`;
const CardText = styled.div`
  padding:20px;
`;
const CardTitle = styled.h3`
  font-family: "Cinzel Decorative",serif;
  font-size:1.4rem;
  margin-bottom:8px;
  color:#f1ddaa;
`;
const CardDesc = styled.p`
  color:#aaa;
  line-height:1.6;
`;

// 游戏弹窗（最高层级，浮在页面上方，不会摧毁底层页面）
const GameModalWrap = styled(motion.div)`
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.92);
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:16px;
`;
const GameBox = styled.div`
  width:min(100%,1100px);
  height:min(90vh,720px);
  background:#090912;
  border-radius:16px;
  border:1px solid #444;
  position:relative;
  overflow:hidden;
  display:flex;
  flex-direction:column;
`;
const CloseBtn = styled.button`
  position:absolute;
  top:12px;
  right:12px;
  z-index:10;
  width:36px;
  height:36px;
  border-radius:50%;
  border:1px solid #666;
  background:#111;
  color:#fff;
  cursor:pointer;
  font-size:18px;
  &:hover{
    background:#222;
  }
`;

// ========== 吃饭大冒险样式 ==========
const EatGameArea = styled.div`
  flex:1;
  position:relative;
  overflow:hidden;
`;
const PlayerChar = styled(motion.img)`
  position:absolute;
  bottom:10px;
  width:110px;
  @media(max-width:768px){
    width:80px;
  }
  pointer-events:none;
  filter: drop-shadow(0 8px 12px rgba(0,0,0,.68)) drop-shadow(0 0 1px #090912);
`;
const FoodItem = styled(motion.img)`
  position:absolute;
  width:60px;
  @media(max-width:768px){
    width:46px;
  }
  filter: drop-shadow(0 5px 7px rgba(0,0,0,.72)) drop-shadow(0 0 1px #090912);
`;
const ScorePanel = styled.div`
  padding:12px 20px;
  display:flex;
  justify-content:space-between;
  border-bottom:1px solid #222;
`;
const TipText = styled.span`
  color:#e6c882;
  font-weight:bold;
  font-size:1.25rem;
`;

// ========== 陪伴大作战样式 ==========
const StoryWrap = styled.div`
  display:grid;
  grid-template-columns: 220px 1fr;
  height:100%;
  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;
const CharSide = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  background:#0b0b14;
  border-right:1px solid #222;
  img{
    width:160px;
    filter: drop-shadow(0 12px 18px rgba(0,0,0,.62)) drop-shadow(0 0 1px #090912);
    @media(max-width:768px){
      width:110px;
    }
  }
`;
const StoryContent = styled.div`
  padding:30px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:24px;
  overflow-y:auto;
`;
const Narration = styled.p`
  font-size:1.1rem;
  line-height:1.8;
  color:#ddd;
`;
const OptionBtn = styled(motion.button)`
  display:block;
  width:100%;
  text-align:left;
  padding:14px 18px;
  background:#141420;
  border:1px solid #333;
  border-radius:10px;
  color:#fff;
  cursor:pointer;
  font-size:1rem;
  transition:0.2s;
  &:hover{
    border-color:#e6c882;
    background:#1a1a2c;
  }
`;
const StatusBar = styled.div`
  display:flex;
  gap:16px;
  flex-wrap:wrap;
  margin-bottom:12px;
  span{
    color:#e6c882;
  }
`;
const EndTitle = styled.h2`
  font-family:"Cinzel Decorative",serif;
  font-size:1.8rem;
  color:#e6c882;
`;

// ====================== 素材路径【完全匹配你的文件夹】 ======================
const SPRITE_PATH = "/assets/MiniGame/sprite/";
const FOOD_LIST = [
  {name:"烤肉",src:`${SPRITE_PATH}food_meat.webp`,score:15,isBad:false},
  {name:"蛋糕",src:`${SPRITE_PATH}food_cake.webp`,score:10,isBad:false},
  {name:"面包",src:`${SPRITE_PATH}food_bread.webp`,score:6,isBad:false},
  {name:"浆果",src:`${SPRITE_PATH}food_berry.webp`,score:8,isBad:false},
  {name:"矿石",src:`${SPRITE_PATH}rock.webp`,score:-12,isBad:true},
  {name:"深渊雾气",src:`${SPRITE_PATH}abyss_mist.webp`,score:-18,isBad:true},
];
// 根据分数切换艾克莉西娅表情
const getEkSpriteByScore = (score)=>{
  if(score <= -20) return `${SPRITE_PATH}ek_angry.webp`
  if(score < 20) return `${SPRITE_PATH}ek_sad.webp`
  if(score <60) return `${SPRITE_PATH}ek_normal.webp`
  if(score <100) return `${SPRITE_PATH}ek_smile.webp`
  if(score <160) return `${SPRITE_PATH}ek_happy.webp`
  return `${SPRITE_PATH}ek_full.webp`
}

// 题库
const STORY_QUESTIONS = [
  {
    text:"窗外的天色慢慢沉下来，艾克莉西娅坐在沙发上，指尖无意识摩挲着杯沿。桌上的温水已经凉透。",
    options:[
      {txt:"提议出门沿街散步",attr:{energy:+8,luck:+3,wisdom:0}},
      {txt:"安静坐在一旁陪她，不主动说话",attr:{energy:+4,luck:+6,wisdom:+5}},
      {txt:"准备一份甜点端到她面前",attr:{energy:+10,luck:-2,wisdom:-3}},
      {txt:"询问她是不是又想起了过往的烦心事",attr:{energy:-6,luck:-4,wisdom:+8}}
    ]
  },
  {
    text:"路过街边花店，玻璃橱窗里摆放着各色花朵，艾克莉西娅停下脚步静静望着。",
    options:[
      {txt:"挑选一束浅色花送给她",attr:{energy:+7,luck:+6,wisdom:-2}},
      {txt:"和她闲聊花朵的养护方式",attr:{energy:+3,luck:+2,wisdom:+7}},
      {txt:"仅仅驻足一同观赏，稍后继续往前走",attr:{energy:+5,luck:+8,wisdom:+4}},
      {txt:"提醒花朵不容易养护，不必购买",attr:{energy:-8,luck:-3,wisdom:+6}}
    ]
  },
  {
    text:"傍晚下起小雨，两个人被困在便利店门口，暂时无法返程。",
    options:[
      {txt:"进店买热饮，等待雨势变小",attr:{energy:+9,luck:+4,wisdom:0}},
      {txt:"冒雨快步跑回家",attr:{energy:-10,luck:-6,wisdom:-4}},
      {txt:"靠着墙面，一起安静听雨声",attr:{energy:+6,luck:+7,wisdom:+5}},
      {txt:"规划绕行路线，寻找避雨的长廊",attr:{energy:+2,luck:+3,wisdom:+9}}
    ]
  },
  {
    text:"路过小吃摊，香气扑面而来，艾克莉西娅顿住脚步看向摊位。",
    options:[
      {txt:"主动询问想尝试哪一样，直接买下",attr:{energy:+8,luck:+5,wisdom:-3}},
      {txt:"提醒小吃油脂较高，建议浅尝",attr:{energy:-5,luck:-2,wisdom:+7}},
      {txt:"和她分一份小吃慢慢品尝",attr:{energy:+7,luck:+6,wisdom:+2}},
      {txt:"继续往前走，寻找环境更好的餐厅",attr:{energy:+3,luck:-4,wisdom:+6}}
    ]
  },
  {
    text:"回到房间，暮色笼罩屋子，灯光还没有打开。",
    options:[
      {txt:"轻轻点亮柔和的落地灯",attr:{energy:+7,luck:+8,wisdom:+3}},
      {txt:"直接打开主灯，全屋瞬间明亮",attr:{energy:+4,luck:-3,wisdom:+2}},
      {txt:"保持黑暗，拉开窗帘看远处城市灯火",attr:{energy:+6,luck:+4,wisdom:+6}},
      {txt:"打开电视播放舒缓影片",attr:{energy:+8,luck:+2,wisdom:-4}}
    ]
  },
  {
    text:"整理物品时，旧画册从书架滑落，纸张散落一地。",
    options:[
      {txt:"一同蹲下来慢慢收拾，翻看画册",attr:{energy:+9,luck:+5,wisdom:+3}},
      {txt:"快速收拾完毕，放到高处避免再次掉落",attr:{energy:+3,luck:+2,wisdom:+8}},
      {txt:"先搁置一旁，等有空再整理",attr:{energy:-7,luck:-5,wisdom:-2}},
      {txt:"挑选其中几页妥善保存，其余收纳起来",attr:{energy:+4,luck:+4,wisdom:+7}}
    ]
  },
  {
    text:"休息日清晨，窗外阳光照进房间，天色格外晴朗。",
    options:[
      {txt:"提议外出前往公园漫步",attr:{energy:+10,luck:+4,wisdom:-2}},
      {txt:"在家准备简单早餐，悠闲度过上午",attr:{energy:+7,luck:+6,wisdom:+3}},
      {txt:"留充足时间让她自由独处",attr:{energy:+5,luck:+9,wisdom:+6}},
      {txt:"安排繁多行程，前往多处景点",attr:{energy:-9,luck:-7,wisdom:-3}}
    ]
  },
  {
    text:"街边流浪小猫靠近两人，怯生生地抬头张望。",
    options:[
      {txt:"就近购买食物投喂小猫",attr:{energy:+8,luck:+7,wisdom:-3}},
      {txt:"远远安静观察，不去惊扰小动物",attr:{energy:+4,luck:+6,wisdom:+7}},
      {txt:"尝试轻轻伸手缓慢靠近猫咪",attr:{energy:+6,luck:+3,wisdom:+4}},
      {txt:"劝说尽快离开，避免被抓伤",attr:{energy:-6,luck:-3,wisdom:+8}}
    ]
  },
  {
    text:"天色渐晚，晚风微凉，街道行人慢慢变少。",
    options:[
      {txt:"放慢脚步，沿着街道慢慢散步回家",attr:{energy:+8,luck:+7,wisdom:+4}},
      {txt:"加快脚步早点回到温暖室内",attr:{energy:+4,luck:-3,wisdom:+6}},
      {txt:"顺路挑选一份小零食带回住处",attr:{energy:+7,luck:+5,wisdom:-2}},
      {txt:"换乘车辆，省去步行路程",attr:{energy:+3,luck:+2,wisdom:+5}}
    ]
  },
  {
    text:"书桌摆放着尚未完成的速写稿，笔触停留在画面中央。",
    options:[
      {txt:"不打扰，等待她自己继续创作",attr:{energy:+6,luck:+8,wisdom:+7}},
      {txt:"夸赞画面，询问创作的想法",attr:{energy:+9,luck:+4,wisdom:+2}},
      {txt:"给出自己对画面的修改建议",attr:{energy:-4,luck:-5,wisdom:+8}},
      {txt:"提议暂时放下画笔休息片刻",attr:{energy:+5,luck:+6,wisdom:+3}}
    ]
  }
]

// ====================== 主组件 ======================
const MiniGame = () => {
  const navigate = useNavigate();
  const [openGame,setOpenGame] = useState(null);

  // ========== 游戏1：吃饭大冒险状态 ==========
  const [eatGameState,setEatGameState] = useState("ready"); // ready / play / end
  const [score,setScore] = useState(0);
  const [remainTime,setRemainTime] = useState(20);
  const [foods,setFoods] = useState([]);
  const playerXRef = useRef(50);
  const foodIdRef = useRef(0);
  const finalWaveSpawned = useRef(false); // 标记最后一波烤肉是否生成

  const resetEatGame = ()=>{
    setScore(0);
    setRemainTime(20);
    setFoods([]);
    playerXRef.current = 50;
    foodIdRef.current = 0;
    finalWaveSpawned.current = false;
  }

  const startEatGame = ()=>{
    resetEatGame();
    setEatGameState("play");
  }

  // 生成食物
  const spawnFood = useCallback((isFinalWave=false)=>{
    if(isFinalWave){
      const newMeats = []
      for(let i=0;i<5;i++){
        newMeats.push({
          id:foodIdRef.current++,
          ...FOOD_LIST[0],
          x:10 + i*16,
          y:-10
        })
      }
      setFoods(prev=>[...prev,...newMeats])
      finalWaveSpawned.current = true;
      return;
    }
    // 如果最后一波已经生成，停止生成普通食物
    if(finalWaveSpawned.current) return;
    const randItem = FOOD_LIST[Math.floor(Math.random()*FOOD_LIST.length)]
    const randX = Math.random()*76 + 8
    setFoods(prev=>[...prev,{
      id:foodIdRef.current++,
      ...randItem,
      x:randX,
      y:-8
    }])
  },[])

  // 游戏主循环
  useEffect(()=>{
    if(eatGameState !== "play") return;

    // 倒计时
    const timer = setInterval(()=>{
      setRemainTime(prev=>{
        if(prev <= 1){
          setEatGameState("end")
          return 0
        }
        // 剩余3秒，生成最后一波烤肉
        if(prev ===3 && !finalWaveSpawned.current){
          spawnFood(true)
        }
        return prev -1
      })
    },1000)

    // 普通食物生成
    const spawnTimer = setInterval(()=>{
      spawnFood()
    },850)

    // 下落&碰撞检测
    const moveLoop = setInterval(()=>{
      setFoods(prev=>{
        const playerX = playerXRef.current
        const newArr = []
        prev.forEach(food=>{
          const newY = food.y + 1.6
          // 碰撞区域判定
          if(newY >=84 && newY <=96 && Math.abs(food.x - playerX) <9){
            setScore(s=>s+food.score)
            return;
          }
          if(newY >105) return;
          newArr.push({...food,y:newY})
        })
        return newArr
      })
    },32)

    // 鼠标/触屏移动控制
    const handleMove = (e)=>{
      const gameDom = document.getElementById("eatGameArea")
      if(!gameDom) return;
      const rect = gameDom.getBoundingClientRect();
      let clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const percent = ((clientX - rect.left)/rect.width)*100
      playerXRef.current = Math.max(5,Math.min(95,percent))
    }
    window.addEventListener("mousemove",handleMove)
    window.addEventListener("touchmove",handleMove)

    return ()=>{
      clearInterval(timer);
      clearInterval(spawnTimer);
      clearInterval(moveLoop);
      window.removeEventListener("mousemove",handleMove)
      window.removeEventListener("touchmove",handleMove)
    }
  },[eatGameState, spawnFood])


  // ========== 游戏2：陪伴大作战状态 ==========
  const [storyState,setStoryState] = useState("ready");
  const [hp,setHp] = useState(5);
  const [attr,setAttr] = useState({energy:0,luck:0,wisdom:0})
  const [usedIndex,setUsedIndex] = useState([]); // 记录已出题索引，杜绝重复
  const [currentQ,setCurrentQ] = useState(null);
  const [ekStoryImg,setEkStoryImg] = useState(`${SPRITE_PATH}ek_normal.webp`)

  const resetStoryGame = ()=>{
    setHp(5);
    setAttr({energy:0,luck:0,wisdom:0});
    setUsedIndex([]);
    setEkStoryImg(`${SPRITE_PATH}ek_normal.webp`)
  }
  const startStoryGame = ()=>{
    resetStoryGame();
    setStoryState("playing");
    pickNextQuestion()
  }

  // 抽取未使用题目
  const pickNextQuestion = ()=>{
    const availableIndex = STORY_QUESTIONS.map((_,i)=>i).filter(i=>!usedIndex.includes(i))
    if(availableIndex.length ===0){
      setStoryState("ending");
      return;
    }
    const randomIdx = availableIndex[Math.floor(Math.random()*availableIndex.length)]
    setUsedIndex(prev=>[...prev,randomIdx])
    setCurrentQ(STORY_QUESTIONS[randomIdx])
    setEkStoryImg(`${SPRITE_PATH}ek_normal.webp`)
  }

  const selectOption = (opt)=>{
    setAttr(prev=>({
      energy:prev.energy + opt.attr.energy,
      luck:prev.luck + opt.attr.luck,
      wisdom:prev.wisdom + opt.attr.wisdom
    }))
    //负面选项扣血
    if(opt.attr.energy < -4 || (opt.attr.luck < -4 && opt.attr.wisdom <3)){
      setHp(prev=>{
        const nextHp = prev -1
        if(nextHp <=0) setTimeout(()=>setStoryState("ending"),600)
        return nextHp
      })
      setEkStoryImg(`${SPRITE_PATH}ek_sad.webp`)
    }else if(opt.attr.energy >=6 || opt.attr.luck >=6){
      setEkStoryImg(`${SPRITE_PATH}ek_smile.webp`)
    }
    setTimeout(()=>{
      if(storyState === "playing") pickNextQuestion()
    },650)
  }

  //结局文本
  const getEndText = ()=>{
    const {energy,luck,wisdom} = attr;
    if(hp <=0) return {title:"短暂别离",desc:"一连串选择让氛围慢慢冷却，艾克莉西娅独自回到房间，今日的相处到此为止。"}
    if(energy >=22 && luck >=18) return {title:"温暖黄昏",desc:"持续的陪伴抚平心绪，两个人在城市晚风里度过了一段惬意安稳的时光。"}
    if(wisdom >=20 && luck >=12) return {title:"默契同行",desc:"你总能读懂她细微的情绪，无需过多言语，彼此拥有难得的默契。"}
    if(energy >=18 && wisdom >=16) return {title:"平和日常",desc:"没有轰轰烈烈的故事，细碎温暖的日常，就是最好的陪伴。"}
    return {title:"平淡一日",desc:"普通的城市日常，留下一段不算深刻、却值得记住的短暂相遇。"}
  }

  const modalRoot = document.body;

  return(
    <Wrapper>
      {/* 【固定导航栏，永久存在！不会消失】 */}
      <NavHeader>
        <motion.a onClick={()=>navigate("/")}>首页</motion.a>
        <motion.a onClick={()=>navigate("/about")}>关于网页</motion.a>
        <motion.a onClick={()=>navigate("/project")}>我的项目</motion.a>
      </NavHeader>

      <Container>
        <PageTitle initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
          Mini Games
        </PageTitle>
        <SubpageBackButton />
        <GameGrid>
          <GameCard
            whileHover={{scale:1.02}}
            onClick={()=>{resetEatGame();setOpenGame("eat")}}
          >
            <CardImg src="/assets/MiniGame/game-01.jpg" alt="艾克莉西娅吃饭大冒险"/>
            <CardText>
              <CardTitle>艾克莉西娅吃饭大冒险</CardTitle>
              <CardDesc>20秒限时挑战，移动接住掉落食物，获取高分！小心误捡危险物品扣分，最后迎来烤肉盛宴。</CardDesc>
            </CardText>
          </GameCard>
          <GameCard
            whileHover={{scale:1.02}}
            onClick={()=>{resetStoryGame();setOpenGame("story")}}
          >
            <CardImg src="/assets/MiniGame/game-02.jpg" alt="阿不思的陪伴大作战"/>
            <CardText>
              <CardTitle>阿不思的陪伴大作战</CardTitle>
              <CardDesc>城市日常叙事选择，不同抉择改变精力、运气、智慧数值，走向多种结局。留意艾克莉西娅的状态变化。</CardDesc>
            </CardText>
          </GameCard>
          <GameCard
            whileHover={{scale:1.02}}
            onClick={()=>setOpenGame("bbq")}
          >
            <CardImg src="/assets/MiniGame/game-03.webp" alt="帮艾克莉西娅烤肉吧" loading="lazy" decoding="async"/>
            <CardText>
              <CardTitle>帮艾克莉西娅烤肉吧</CardTitle>
              <CardDesc>观察肉片颜色、油脂与烟气，调整火候并把握翻面和装盘时机。三轮烤制，挑战最高总分。</CardDesc>
            </CardText>
          </GameCard>
        </GameGrid>
      </Container>

      {/* 弹窗：吃饭大冒险 Portal */}
      {openGame === "eat" && createPortal(
        <GameModalWrap initial={{opacity:0}} animate={{opacity:1}}>
          <GameBox>
            <CloseBtn onClick={()=>setOpenGame(null)}>✕</CloseBtn>
            {eatGameState === "ready" && (
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"24px"}}>
                <h2 style={{fontFamily:"Cinzel Decorative",color:"#e6c882",fontSize:"1.8rem"}}>艾克莉西娅吃饭大冒险</h2>
                <p style={{textAlign:"center",maxWidth:"600px",lineHeight:"1.7"}}>移动鼠标 / 滑动屏幕控制角色左右移动<br/>接住食物获得分数，矿石与深渊雾气会扣除分数<br/>限时20秒，倒计时剩余3秒刷新一波烤肉，之后不再生成食物！</p>
                <motion.button
                  whileHover={{scale:1.05}}
                  onClick={startEatGame}
                  style={{padding:"12px 32px",background:"#222",color:"#fff",border:"1px solid #e6c882",borderRadius:"8px",cursor:"pointer"}}
                >开始游戏
                </motion.button>
              </div>
            )}
            {eatGameState === "play" && (
              <>
                <ScorePanel>
                  <TipText>分数：{score}</TipText>
                  <TipText>剩余时间：{remainTime}s</TipText>
                </ScorePanel>
                <EatGameArea id="eatGameArea">
                  <PlayerChar
                    src={getEkSpriteByScore(score)}
                    style={{left:`${playerXRef.current}%`,transform:"translateX(-50%)"}}
                  />
                  {foods.map(food=>(
                    <FoodItem
                      key={food.id}
                      src={food.src}
                      style={{left:`${food.x}%`,top:`${food.y}%`}}
                    />
                  ))}
                </EatGameArea>
              </>
            )}
            {eatGameState === "end" && (
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"20px"}}>
                <h2 style={{fontFamily:"Cinzel Decorative",color:"#e6c882"}}>游戏结束</h2>
                <img src={getEkSpriteByScore(score)} style={{width:"140px"}} alt="ek"/>
                <p style={{fontSize:"1.4rem"}}>最终得分：{score}</p>
                <div style={{display:"flex",gap:"16px"}}>
                  <motion.button
                    whileHover={{scale:1.04}}
                    onClick={startEatGame}
                    style={{padding:"10px 24px",border:"1px solid #aaa",background:"#111",color:"#fff",borderRadius:"8px",cursor:"pointer"}}
                  >再来一局</motion.button>
                  <motion.button
                    whileHover={{scale:1.04}}
                    onClick={()=>setOpenGame(null)}
                    style={{padding:"10px 24px",border:"1px solid #444",background:"#08080c",color:"#aaa",borderRadius:"8px",cursor:"pointer"}}
                  >关闭</motion.button>
                </div>
              </div>
            )}
          </GameBox>
        </GameModalWrap>,
        modalRoot
      )}

      {/* 弹窗：陪伴大作战 Portal */}
      {openGame === "story" && createPortal(
        <GameModalWrap initial={{opacity:0}} animate={{opacity:1}}>
          <GameBox>
            <CloseBtn onClick={()=>setOpenGame(null)}>✕</CloseBtn>
            {storyState === "ready" && (
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"24px",padding:"30px"}}>
                <h2 style={{fontFamily:"Cinzel Decorative",color:"#e6c882",fontSize:"1.8rem"}}>阿不思的陪伴大作战</h2>
                <p style={{textAlign:"center",maxWidth:"600px",lineHeight:1.8}}>
                  在城市日常里做出选择，观察艾克莉西娅的状态。<br/>
                  你的抉择会影响精力、运气、智慧三项隐藏属性，生命值归零将提前结束故事。<br/>
                  多条路线，解锁不同结局。
                </p>
                <motion.button
                  whileHover={{scale:1.05}}
                  onClick={startStoryGame}
                  style={{padding:"12px 32px",background:"#222",color:"#fff",border:"1px solid #e6c882",borderRadius:"8px",cursor:"pointer"}}
                >开启故事
                </motion.button>
              </div>
            )}
            {storyState === "playing" && currentQ && (
              <StoryWrap>
                <CharSide>
                  <motion.img src={ekStoryImg} alt="艾克莉西娅" initial={{scale:0.9}} animate={{scale:1}} transition={{duration:0.3}}/>
                </CharSide>
                <StoryContent>
                  <StatusBar>
                    <span>❤️ 生命：{hp}/5</span>
                    <span>⚡精力 {attr.energy}</span>
                    <span>🍀运气 {attr.luck}</span>
                    <span>📖智慧 {attr.wisdom}</span>
                  </StatusBar>
                  <Narration>{currentQ.text}</Narration>
                  {currentQ.options.map((opt,i)=>(
                    <OptionBtn
                      key={i}
                      whileTap={{scale:0.97}}
                      onClick={()=>selectOption(opt)}
                    >
                      {opt.txt}
                    </OptionBtn>
                  ))}
                </StoryContent>
              </StoryWrap>
            )}
            {storyState === "ending" && (
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"20px",padding:"30px"}}>
                <EndTitle>{getEndText().title}</EndTitle>
                <p style={{maxWidth:"600px",textAlign:"center",lineHeight:"1.8",color:"#ccc"}}>{getEndText().desc}</p>
                <div style={{display:"flex",gap:"16px",marginTop:"12px"}}>
                  <motion.button
                    whileHover={{scale:1.04}}
                    onClick={startStoryGame}
                    style={{padding:"10px 24px",border:"1px solid #aaa",background:"#111",color:"#fff",borderRadius:"8px",cursor:"pointer"}}
                  >重新体验</motion.button>
                  <motion.button
                    whileHover={{scale:1.04}}
                    onClick={()=>setOpenGame(null)}
                    style={{padding:"10px 24px",border:"1px solid #444",background:"#08080c",color:"#aaa",borderRadius:"8px",cursor:"pointer"}}
                  >关闭页面</motion.button>
                </div>
              </div>
            )}
          </GameBox>
        </GameModalWrap>,
        modalRoot
      )}

      {openGame === "bbq" && createPortal(
        <GameModalWrap initial={{opacity:0}} animate={{opacity:1}}>
          <GameBox role="dialog" aria-modal="true" aria-label="帮艾克莉西娅烤肉吧">
            <CloseBtn aria-label="关闭烤肉游戏" onClick={()=>setOpenGame(null)}>✕</CloseBtn>
            <BbqGame />
          </GameBox>
        </GameModalWrap>,
        modalRoot
      )}
    </Wrapper>
  )
}

export default MiniGame;
