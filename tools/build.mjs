import {build} from 'esbuild';
import {mkdir,copyFile,writeFile,readFile,rm,chmod,cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {copySource} from '@arkstrongholdrl/ark-play-core/build-package';
import {writeNotices} from '@arkstrongholdrl/ark-play-core/build-notices';
const root=fileURLToPath(new URL('../',import.meta.url));
const shared=dirname(fileURLToPath(import.meta.resolve('@arkstrongholdrl/ark-play-core/package.json')));
const metadata=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
await mkdir(join(root,'dist'),{recursive:true});
await rm(join(root,'dist/skills'),{recursive:true,force:true});
await cp(join(root,'skills'),join(root,'dist/skills'),{recursive:true});
await build({entryPoints:[join(root,'index.mjs')],outfile:join(root,'dist/index.mjs'),bundle:true,
  platform:'node',format:'esm',target:'node22',sourcemap:false,
  banner:{js:"import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);"}});
await rm(join(root,'dist/node_modules'),{recursive:true,force:true});
await build({entryPoints:{'site-worker':join(shared,'src/site-worker.mjs'),'site-loader':join(shared,'src/site-loader.mjs')},outdir:join(root,'dist'),
  outExtension:{'.js':'.mjs'},bundle:true,platform:'node',format:'esm',target:'node22'});
// DSH loads browser plugins through its shared module table (including React).
await build({entryPoints:[join(root,'client.mjs')],outfile:join(root,'dist/client.js'),bundle:true,
  platform:'browser',format:'cjs',target:'es2022',external:['react'],loader:{'.png':'dataurl'},
  banner:{js:'window.__ModuleLoader__.load({id:"dsh-ark-stronghold",factory:(require)=>{const module={exports:{}};const exports=module.exports;'},
  footer:{js:'return module.exports;}});'}});
// Keep the original artwork and its notice alongside the embedded client in release archives.
await rm(join(root,'dist/public'),{recursive:true,force:true});
await cp(join(root,'public'),join(root,'dist/public'),{recursive:true});
await writeNotices(join(root,'node_modules'),join(root,'dist/THIRD_PARTY_LICENSES.txt'));
await copyFile(join(root,'cordis.patch.yml'),join(root,'dist/cordis.patch.yml'));
await build({entryPoints:[join(shared,'tools/configure.mjs')],outfile:join(root,'configure.mjs'),bundle:true,platform:'node',format:'esm',target:'node22'});
await chmod(join(root,'configure.mjs'),0o755);
await rm(join(root,'corresponding-source'),{recursive:true,force:true});
await copySource(shared,join(root,'corresponding-source/ark-play-core'));
await writeFile(join(root,'dist/package.json'),JSON.stringify({name:metadata.name,version:metadata.version,type:'module',main:'./index.mjs',exports:{'.':'./index.mjs','./client':'./client.js','./package.json':'./package.json'},license:'GPL-3.0-or-later',engines:metadata.engines,dsh:metadata.dsh},null,2)+'\n');
console.log('Built standalone native plugin from pinned shared core.');
