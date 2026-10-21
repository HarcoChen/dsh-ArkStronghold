export const DEFAULT_SITE_URL='https://ark.minyako.top';

export function normalizeSiteUrl(value) {
  const input=String(value??'').trim();
  if(!input)return '';
  let url;try{url=new URL(input);}catch{throw new Error('请输入完整的游戏站网址，例如 https://ark.minyako.top');}
  if(url.username||url.password||url.search||url.hash||!['/','/ws','/ws/'].includes(url.pathname)) {
    throw new Error('游戏站地址只支持站点根路径或 /ws，不能包含账号、查询参数或片段');
  }
  const protocol={https:'wss:',http:'ws:',wss:'wss:',ws:'ws:'}[url.protocol.slice(0,-1)];
  if(!protocol)throw new Error('游戏站地址需要 https:// 或 wss://');
  if(protocol==='ws:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname)) {
    throw new Error('远程游戏站必须使用 HTTPS / WSS；HTTP / WS 仅限本机回环地址');
  }
  return protocol+'//'+url.host+'/ws';
}

