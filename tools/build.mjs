import {build} from 'esbuild';
import {mkdir,copyFile,writeFile,readFile,rm,chmod} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {copySource} from '@harco/ark-play-core/build-package';
import {writeNotices} from '@harco/ark-play-core/build-notices';
const root=fileURLToPath(new URL('../',import.meta.url));
const shared=dirname(fileURLToPath(import.meta.resolve('@harco/ark-play-core/package.json')));
const metadata=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
await mkdir(join(root,'dist'),{recursive:true});
await build({entryPoints:[join(root,'index.mjs')],outfile:join(root,'dist/index.mjs'),bundle:true,
  platform:'node',format:'esm',target:'node22',sourcemap:false,
  banner:{js:"import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);"}});
await build({entryPoints:[join(shared,'src/site-worker.mjs'),join(shared,'src/site-loader.mjs')],outdir:join(root,'dist'),
  outExtension:{'.js':'.mjs'},bundle:true,platform:'node',format:'esm',target:'node22'});
await writeNotices(join(root,'node_modules'),join(root,'dist/THIRD_PARTY_LICENSES.txt'));
await copyFile(join(root,'cordis.patch.yml'),join(root,'dist/cordis.patch.yml'));
await copyFile(join(shared,'tools/configure.mjs'),join(root,'configure.mjs'));
await chmod(join(root,'configure.mjs'),0o755);
await rm(join(root,'corresponding-source'),{recursive:true,force:true});
await copySource(shared,join(root,'corresponding-source/ark-play-core'));
await writeFile(join(root,'dist/package.json'),JSON.stringify({name:metadata.name,version:metadata.version,type:'module',main:'./index.mjs',license:'GPL-3.0-or-later',engines:metadata.engines,dsh:metadata.dsh},null,2)+'\n');
console.log('Built standalone native plugin from pinned shared core.');
