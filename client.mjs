import {createElement as h,useEffect,useState} from 'react';
import {normalizeSiteUrl} from './site-url.mjs';

export const inject=['slots','configForms'];
const ID='dsh-ark-stronghold';
const control={padding:'10px 12px',border:'1px solid #8886',borderRadius:8,background:'transparent',color:'inherit',font:'inherit'};

function Panel(props) {
  const snapshot=props.useArkSettings(value=>value);
  const mirror=props.useSettingsStatus(value=>value);
  const [draft,setDraft]=useState('');
  const [dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>{if(!dirty&&snapshot.value)setDraft(snapshot.value.url||'');},[snapshot.value,dirty]);
  async function save(event) {
    event.preventDefault();setMessage('');
    try {
      const url=normalizeSiteUrl(draft);setBusy(true);
      const accepted=await props.save(url);
      if(!accepted)throw new Error('保存失败，请重试。');
      setDraft(url);setDirty(false);setMessage('已保存，下次开局生效。');
    } catch(error) {setMessage(error.message||String(error));}
    finally {setBusy(false);}
  }
  return h('section',{style:{padding:28,width:'100%',boxSizing:'border-box',color:'inherit'}},
    h('form',{onSubmit:save,style:{maxWidth:560,display:'grid',gap:12}},
      h('label',{htmlFor:'ark-site-url',style:{fontSize:18,fontWeight:600}},'游戏站地址'),
      h('input',{id:'ark-site-url',value:draft,onChange:e=>{setDraft(e.target.value);setDirty(true);setMessage('');},placeholder:'https://ark.harco.top',disabled:busy,spellCheck:false,autoComplete:'url',style:{...control,width:'100%',boxSizing:'border-box'}}),
      h('button',{type:'submit',disabled:busy,style:{...control,justifySelf:'start',cursor:'pointer'}},busy?'保存中…':'保存'),
      message||mirror.error?h('p',{role:'status',style:{margin:0,fontSize:13,overflowWrap:'anywhere'}},message||'配置读取失败：'+mirror.error):null));
}
function Icon(){return h('span',{'aria-hidden':true},'♜');}
export function apply(ctx) {
  const scope=ctx.configForms.get('ark-play');
  ctx.effect(()=>ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:ID,inject:()=>({hooks:{arkSettings:scope,settingsStatus:ctx.configForms.describe()},save:url=>scope.set('url',url)})},Panel)));
  ctx.effect(()=>ctx.slots.inject('sidebar.panellist',()=>ctx.slots.register({name:'sidebar.panellist',id:ID,order:30,label:'Ark Stronghold'},Icon)));
}
