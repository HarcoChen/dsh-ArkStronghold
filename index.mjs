import {createTools,z} from '@harco/ark-play-core';
import Schema from '@deepseek-ai/schemastery';

export const name='ark-play';
export const inject=['tools'];

// Normalize at the UI and connection boundaries, not in the serialized schema.
export {normalizeSiteUrl} from './site-url.mjs';
import {normalizeSiteUrl} from './site-url.mjs';

export const Config=Schema.object({
  url:Schema.string().default('')
    .description('游戏站链接（HTTPS / WSS）')
    .comment('例如 https://ark.harco.top，自动连接 /ws。保存后用于下一盘，当前对局继续使用原站点。留空继承环境变量或客户端配置。')
    .volatile(),
  // Existing composition/file-based setup remains available to headless users.
  configFile:Schema.string(),name:Schema.string(),headersFile:Schema.string(),
  tokenFile:Schema.string(),sessionFile:Schema.string(),token:Schema.string().role('secret'),
});

// DSH's enforced JSON-Schema subset excludes numeric/string bounds. Keep those
// enforced by the shared Zod parser immediately before tool execution.
function harnessSchema(value) {
  if(Array.isArray(value))return value.map(harnessSchema);
  if(!value||typeof value!=='object')return value;
  const keep=new Set(['type','oneOf','properties','required','additionalProperties','items','enum','const','description','title','default','examples']);
  const out={};
  for(const [k,v] of Object.entries(value)) {
    if(k==='properties')out[k]=Object.fromEntries(Object.entries(v).map(([n,s])=>[n,harnessSchema(s)]));
    else if(k==='anyOf')out.oneOf=v.map(harnessSchema);
    else if(k==='type'&&Array.isArray(v))out.oneOf=v.map(type=>({type}));
    else if(keep.has(k))out[k]=harnessSchema(v);
  }
  return out;
}

/** Mount per agent or globally: a global registration still isolates runs by executing agent. */
export function apply(ctx,config={}) {
  const runtimes=new Map();
  function options() {
    const {url,...rest}=config;
    const endpoint=normalizeSiteUrl(url&&typeof url.get==='function'?url.get():url);
    return {...Object.fromEntries(Object.entries(rest).filter(([,value])=>value!==undefined)),
      ...(endpoint?{url:endpoint}:{}),client:'dsh-plugin'};
  }
  const template=createTools(options());
  async function runtime(exec,toolName) {
    if(!exec.agent)throw new Error('Ark Play requires a DSH execution agent identity');
    const previous=runtimes.get(exec.agent);
    const next=options();
    // Read a saved URL only at a new game boundary, never during an active game.
    if(previous&&toolName==='ark_start'&&!previous.client.inCall&&
      (previous.client.result||
        (previous.settingUrl!==(next.url||'')&&!previous.client.room?.inMatch&&
          !previous.client.uncertain&&!previous.client.replaced&&!previous.client.sessionLost))) {
      await previous.close();runtimes.delete(exec.agent);
    }
    if(!runtimes.has(exec.agent)) {
      const created=createTools(next);created.settingUrl=next.url||'';
      runtimes.set(exec.agent,created);
    }
    return runtimes.get(exec.agent);
  }
  ctx.effect(()=>()=>{
    template.close().catch(()=>{});
    for(const r of runtimes.values())r.close().catch(()=>{});
    runtimes.clear();
  });
  for(const tool of template.tools) {
    const parameters=harnessSchema(z.toJSONSchema(tool.schema));
    ctx.tools.register({name:tool.name,description:tool.description,parameters,
      output:{schema:{type:'object',properties:{text:{type:'string'}},required:['text'],additionalProperties:false},
        render:(_args,value)=>[{type:'text',text:value.text}]},
      async execute(args,exec) {
        exec.signal?.throwIfAborted();
        const r=await runtime(exec,tool.name),selected=r.tools.find(t=>t.name===tool.name);
        const reply=await selected.execute(tool.schema.parse(args),exec.signal);
        if(tool.name==='ark_finish') {
          await r.close();if(runtimes.get(exec.agent)===r)runtimes.delete(exec.agent);
        }
        return reply;
      }});
  }
}
