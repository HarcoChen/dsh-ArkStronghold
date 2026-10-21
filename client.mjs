import {createElement as h,useEffect,useState} from 'react';
import {normalizeSiteUrl,DEFAULT_SITE_URL} from './site-url.mjs';
import BACKDROP from './public/bkg_01.png';
import MOUNTAINS from './public/bg_mountains_tiled.png';
import CONTOURS from './public/round_bg_line.png';

export const inject=['slots','configForms'];
const ID='dsh-ark-stronghold';
// The build embeds public artwork as data URLs; the panel makes no image requests.
const styles=`
.ark-panel{--ark-accent:#4ed8af;--ark-line:#3e4b45;position:relative;isolation:isolate;overflow:hidden;width:100%;min-height:100%;box-sizing:border-box;padding:32px clamp(24px,5vw,72px);background:#0c0f0e;color:#f2f2f2;color-scheme:dark;font-family:inherit}
.ark-panel *{box-sizing:border-box}.ark-backdrop,.ark-mountains,.ark-shade{position:absolute;pointer-events:none;z-index:-1}.ark-backdrop{inset:0;width:100%;height:100%;object-fit:cover;object-position:35% center;opacity:.85;filter:saturate(.4)}.ark-mountains{bottom:0;left:0;width:100%;height:270px;object-fit:cover;object-position:center bottom;opacity:.35}.ark-shade{inset:0;background:linear-gradient(90deg,#0c0f0e30,#0c0f0e75),linear-gradient(0deg,#0c0f0e15,#0c0f0e40),radial-gradient(ellipse at 20% 95%,#17f9b71f,transparent 60%)}
.ark-topbar{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:18px;border-bottom:1px solid #4ed8af30;font:10px/1.6 ui-monospace,monospace;letter-spacing:.16em;color:#a6b5ad}.ark-topbar span:first-child{display:flex;align-items:center;gap:10px}.ark-topbar span:first-child::before{content:'';width:6px;height:6px;background:var(--ark-accent);box-shadow:0 0 12px #4ed8af66}.ark-wrap{max-width:1100px;margin:clamp(44px,8vh,100px) auto 72px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1fr);gap:clamp(30px,5vw,80px);align-items:center}.ark-header{padding-bottom:24px}.ark-emblem{width:70px;height:76px;margin-bottom:30px;color:#dfe6e2}.ark-emblem svg{display:block;width:100%;height:100%}.ark-eyebrow{font:11px/1.8 ui-monospace,monospace;letter-spacing:.22em;color:var(--ark-accent);margin:0 0 14px}.ark-title{font-size:clamp(34px,4vw,52px);font-weight:900;letter-spacing:.06em;line-height:1.3;margin:0 0 18px;white-space:nowrap}.ark-title em{font-style:normal;color:var(--ark-accent)}.ark-subtitle{font-size:13px;line-height:1.9;margin:0;color:#a5b3ab;max-width:300px}.ark-rule{width:48px;height:3px;background:var(--ark-accent);margin-top:28px}.ark-caption{font:10px/1.8 ui-monospace,monospace;letter-spacing:.13em;margin:18px 0 0;color:#71877b}
.ark-config{min-width:0}.ark-card{position:relative;border:1px solid var(--ark-line);background:linear-gradient(160deg,#141916ed,#0a0d0cf2);box-shadow:0 18px 48px #0005}.ark-card::before,.ark-card::after{content:'';position:absolute;width:14px;height:14px;pointer-events:none;border-color:var(--ark-accent);border-style:solid}.ark-card::before{left:-1px;top:-1px;border-width:2px 0 0 2px}.ark-card::after{right:-1px;bottom:-1px;border-width:0 2px 2px 0}.ark-card-head{position:relative;isolation:isolate;overflow:hidden;padding:22px 26px;border-bottom:1px solid #2f3a35;display:flex;gap:12px;align-items:center;justify-content:space-between;background:#ffffff03}.ark-contours{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.13;z-index:-1;pointer-events:none}.ark-card-head h2{font-size:15px;letter-spacing:.12em;margin:0;font-weight:600}.ark-badge{display:flex;align-items:center;gap:6px;font-size:11px;padding:5px 8px;border:1px solid #4ed8af35;background:#4ed8af0b;color:var(--ark-accent);white-space:nowrap}.ark-badge::before{content:'';width:4px;height:4px;background:currentColor}.ark-fields{padding:26px;display:grid;gap:26px}.ark-label{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;margin-bottom:10px;letter-spacing:.05em}.ark-index{font:10px/1 ui-monospace,monospace;color:var(--ark-accent)}.ark-optional{font-size:11px;font-weight:400;color:#8a948f;margin-left:auto}.ark-input{width:100%;min-width:0;min-height:46px;padding:12px 14px;border:1px solid #3e4b45;border-radius:0;background:#080d0b99;color:#f2f2f2;font:inherit;font-size:14px;transition:border-color .15s,box-shadow .15s}.ark-input::placeholder{color:#74877c;opacity:.8}.ark-input:focus-visible{outline:none;border-color:var(--ark-accent);box-shadow:0 0 0 2px #4ed8af18}.ark-input:disabled{opacity:.5}.ark-room{max-width:176px;font-family:ui-monospace,monospace;font-size:22px;letter-spacing:.3em;text-transform:uppercase}.ark-help{font-size:12px;line-height:1.8;color:#8a9890;margin:10px 0 0}.ark-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding:20px 26px;border-top:1px solid #2f3a35;background:#00000020}.ark-footnote{font-size:11px;color:#8a9890;margin:0}.ark-save{display:flex;align-items:center;justify-content:center;gap:22px;border:1px solid var(--ark-accent);border-radius:0;background:var(--ark-accent);color:#06110d;padding:12px 18px;font:inherit;font-size:13px;font-weight:700;letter-spacing:.08em;cursor:pointer;transition:background .15s}.ark-save:hover{background:#59f4ca}.ark-save:focus-visible{outline:2px solid #f2f2f2;outline-offset:4px}.ark-save:disabled{opacity:.5;cursor:wait}.ark-message{font-size:12px;line-height:1.7;padding:12px 16px;margin:16px 0 0;overflow-wrap:anywhere;border-left:2px solid var(--ark-accent);background:#10271e;color:#c9e7d8}.ark-message[data-error=true]{background:#341919;border-color:#ff5454;color:#ffd0d0}.ark-guide{margin-top:22px;display:flex;gap:12px;align-items:flex-start}.ark-guide-mark{color:var(--ark-accent);font-size:16px}.ark-guide p{margin:0;font-size:12px;line-height:1.9;color:#8a9890}.ark-guide strong{font-weight:500;color:#bdc9c2}
@media(max-width:850px){.ark-wrap{grid-template-columns:1fr;max-width:520px;margin-top:40px;gap:30px}.ark-header{padding:0}.ark-emblem{width:44px;height:48px;margin-bottom:18px}.ark-title{font-size:36px}.ark-subtitle{max-width:none}.ark-rule,.ark-caption{display:none}.ark-topbar{max-width:520px}.ark-mountains{height:210px}}
@media(max-width:480px){.ark-panel{padding:22px 20px}.ark-topbar{font-size:9px;letter-spacing:.08em}.ark-card-head,.ark-fields,.ark-footer{padding:20px}.ark-title{font-size:32px}.ark-footer{align-items:stretch;flex-direction:column}.ark-save{width:100%;justify-content:space-between}}
`;
function Emblem() {
  const rows=['XXX..XXX..XXX','XXX..XXX..XXX','XXXXXXXXXXXXX','.XXXXXXXXXXX.','..XXXXXXXXX..','..XXXXXXXXX..','..XXXX.XXXX..','..XXXX.XXXX..','..XXXXXXXXX..','..XXXXXXXXX..','..XXXXXXXXX..','.XXXXXXXXXXX.','XXXXXXXXXXXXX','XXXXXXXXXXXXX'];
  return h('svg',{viewBox:'0 0 130 140',fill:'currentColor','aria-hidden':true},rows.flatMap((row,y)=>[...row].flatMap((dot,x)=>dot==='X'?[h('circle',{key:y*13+x,cx:x*10+5,cy:y*10+5,r:2.6,fill:y>11?'#4ed8af':'currentColor'})]:[])));
}

function Panel(props) {
  const snapshot=props.useArkSettings(value=>value);
  const mirror=props.useSettingsStatus(value=>value);
  const [draft,setDraft]=useState(DEFAULT_SITE_URL);
  const [roomCode,setRoomCode]=useState('');
  const [name,setName]=useState('');
  const [dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [failed,setFailed]=useState(false);
  useEffect(()=>{if(!dirty&&snapshot.value){setDraft(snapshot.value.url??DEFAULT_SITE_URL);setRoomCode(snapshot.value.roomCode||'');setName(snapshot.value.name||'');}},[snapshot.value,dirty]);
  async function save(event) {
    event.preventDefault();setMessage('');setFailed(false);
    try {
      const url=normalizeSiteUrl(draft);setBusy(true);
      const code=roomCode.trim().toUpperCase();
      if(code&&!/^[A-Z0-9]{4}$/.test(code))throw new Error('房间号须为四位字母或数字');
      const playerName=name.trim();
      if(playerName.length>12)throw new Error('玩家名最多 12 个字符');
      const accepted=await props.save(url,code,playerName);
      if(!accepted)throw new Error('保存失败，请重试。');
      setDraft(url);setRoomCode(code);setName(playerName);setDirty(false);setMessage('已保存，下次开局生效。');
    } catch(error) {setFailed(true);setMessage(error.message||String(error));}
    finally {setBusy(false);}
  }
  const feedback=message||(mirror.error?'配置读取失败：'+mirror.error:'');
  return h('section',{className:'ark-panel'},
    h('style',null,styles),
    h('img',{className:'ark-backdrop',src:BACKDROP,alt:'','aria-hidden':true}),
    h('img',{className:'ark-mountains',src:MOUNTAINS,alt:'','aria-hidden':true}),
    h('div',{className:'ark-shade','aria-hidden':true}),
    h('div',{className:'ark-topbar'},h('span',null,'STRONGHOLD PROTOCOL'),h('span',null,'DSH / AGENT TERMINAL')),
    h('div',{className:'ark-wrap'},
      h('header',{className:'ark-header'},
        h('div',{className:'ark-emblem'},h(Emblem)),
        h('p',{className:'ark-eyebrow'},'STRONGHOLD PROTOCOL / ALLIANCE'),
        h('h1',{className:'ark-title'},'卫戍协议',h('br'),h('em',null,'盟约')),
        h('p',{className:'ark-subtitle'},'调配干员，协同布防。',h('br'),'连接游戏站，准备下一场对局。'),
        h('div',{className:'ark-rule','aria-hidden':true}),
        h('p',{className:'ark-caption'},'TACTICAL OPERATIONS / 配置终端')),
      h('div',{className:'ark-config'},
      h('form',{onSubmit:save,className:'ark-card','aria-busy':busy},
        h('div',{className:'ark-card-head'},h('img',{className:'ark-contours',src:CONTOURS,alt:'','aria-hidden':true}),h('h2',null,'作战接入'),
          h('span',{className:'ark-badge'},roomCode.trim()?'加入房间':'单人对局')),
        h('div',{className:'ark-fields'},
          h('div',null,
            h('label',{htmlFor:'ark-site-url',className:'ark-label'},h('span',{className:'ark-index','aria-hidden':true},'01'),'游戏站地址'),
            h('input',{id:'ark-site-url',className:'ark-input',value:draft,onChange:e=>{setDraft(e.target.value);setDirty(true);setMessage('');},placeholder:DEFAULT_SITE_URL,disabled:busy,spellCheck:false,autoComplete:'url','aria-describedby':'ark-site-help'}),
            h('p',{id:'ark-site-help',className:'ark-help'},'默认游戏站：',h('a',{href:DEFAULT_SITE_URL,target:'_blank',rel:'noopener noreferrer',style:{color:'var(--ark-accent)',textUnderlineOffset:3}},'ark.minyako.top'),'。留空时使用已有客户端配置。')),
          h('div',null,
            h('label',{htmlFor:'ark-room-code',className:'ark-label'},h('span',{className:'ark-index','aria-hidden':true},'02'),'房间号',h('span',{className:'ark-optional'},'可选')),
            h('input',{id:'ark-room-code',className:'ark-input ark-room',value:roomCode,onChange:e=>{setRoomCode(e.target.value.toUpperCase());setDirty(true);setMessage('');},placeholder:'AB12',disabled:busy,maxLength:4,spellCheck:false,autoComplete:'off','aria-describedby':'ark-room-help'}),
            h('p',{id:'ark-room-help',className:'ark-help'},'输入四位房间号，加入后自动准备，等待房主开始。留空创建单人局。')),
          h('div',null,
            h('label',{htmlFor:'ark-player-name',className:'ark-label'},h('span',{className:'ark-index','aria-hidden':true},'03'),'玩家名',h('span',{className:'ark-optional'},'可选')),
            h('input',{id:'ark-player-name',className:'ark-input',value:name,onChange:e=>{setName(e.target.value);setDirty(true);setMessage('');},placeholder:'蓝色大肥鱼',disabled:busy,maxLength:12,spellCheck:false,autoComplete:'off','aria-describedby':'ark-name-help'}),
            h('p',{id:'ark-name-help',className:'ark-help'},'最多 12 个字符。留空使用客户端配置；未配置时为蓝色大肥鱼。LLM 标记仍会保留。'))),
        h('div',{className:'ark-footer'},
          h('p',{className:'ark-footnote'},dirty?'有未保存的更改':'配置将在下次开局时生效'),
          h('button',{type:'submit',disabled:busy,className:'ark-save'},busy?'正在保存…':'保存配置',h('span',{'aria-hidden':true},'→')))),
      feedback?h('p',{role:failed||(!message&&mirror.error)?'alert':'status',className:'ark-message','data-error':!!(failed||(!message&&mirror.error))},feedback):null,
      h('aside',{className:'ark-guide'},h('span',{className:'ark-guide-mark','aria-hidden':true},'↗'),
        h('p',null,h('strong',null,'保存后，在对话中开始。'),h('br'),
          roomCode.trim()?'告诉 Agent：“加入配置的房间，开始对局。”':'告诉 Agent：“开一局深渊，玩到自然结束。”')))));
}
function Icon(){return h('span',{style:{display:'inline-block',width:18,height:20},'aria-hidden':true},h(Emblem));}
export function apply(ctx) {
  const scope=ctx.configForms.get('ark-play');
  ctx.effect(()=>ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:ID,inject:()=>({hooks:{arkSettings:scope,settingsStatus:ctx.configForms.describe()},save:async(url,roomCode,name)=>{if(!await scope.set('url',url))return false;if(!await scope.set('roomCode',roomCode))return false;return scope.set('name',name);}})},Panel)));
  ctx.effect(()=>ctx.slots.inject('sidebar.panellist',()=>ctx.slots.register({name:'sidebar.panellist',id:ID,order:30,label:'Ark Stronghold'},Icon)));
}
