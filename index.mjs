import {createTools,z} from '@harco/ark-play-core';

export const name='ark-play';
export const inject=['tools'];

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
  const template=createTools({...config,client:'dsh-plugin'});
  function runtime(exec) {
    if(!exec.agent)throw new Error('Ark Play requires a DSH execution agent identity');
    if(!runtimes.has(exec.agent))runtimes.set(exec.agent,createTools({...config,client:'dsh-plugin'}));
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
        const r=runtime(exec),selected=r.tools.find(t=>t.name===tool.name);
        return await selected.execute(tool.schema.parse(args),exec.signal);
      }});
  }
}
