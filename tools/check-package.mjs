// Audit the actual build/tarball boundary; no game, model, fixtures or test suite.
import {readFile,readdir,stat,mkdir,mkdtemp,rm,appendFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
if(pkg.name!=='dsh-ark-stronghold'||pkg.private||pkg.publishConfig?.access!=='public')throw new Error('Unexpected npm identity/access');
if(pkg.dsh?.manifestVersion!==1||pkg.dsh.bundle?.patch!=='./cordis.patch.yml')throw new Error('Invalid DSH bundle metadata');
if(!/name: ['"]?dsh-ark-stronghold['"]?\s*$/.test(await readFile(join(root,'cordis.patch.yml'),'utf8')))throw new Error('Bundle patch must reference the npm name');
const artwork=['bkg_01.png','bg_mountains_tiled.png','round_bg_line.png','NOTICE.md'];
const required=[...artwork.flatMap(name=>['public/'+name,'dist/public/'+name]),'dist/client.js','client.mjs','site-url.mjs','dist/index.mjs','dist/site-worker.mjs','dist/site-loader.mjs','dist/THIRD_PARTY_LICENSES.txt',
  'cordis.patch.yml','configure.mjs','LICENSE','README.md','corresponding-source/ark-play-core/src/site-worker.mjs'];
const tarballOnly=Boolean(process.argv[2]&&process.argv[2]!=='--pack');
if(!tarballOnly) {
  const built=JSON.parse(await readFile(join(root,'dist/package.json'),'utf8'));
  if(built.name!==pkg.name||built.version!==pkg.version)throw new Error('Built package identity/version is stale');
  for(const name of required)if(!(await stat(join(root,name))).size)throw new Error('Missing publish file: '+name);
  for(const folder of ['tools','dist'])for(const name of await readdir(join(root,folder)))if(name.endsWith('.mjs'))execFileSync(process.execPath,['--check',join(root,folder,name)]);
  execFileSync(process.execPath,['--check',join(root,'index.mjs')]);
  const browser=await readFile(join(root,'dist/client.js'),'utf8');
  for(const name of artwork) {
    const original=await readFile(join(root,'public',name));
    if(!original.equals(await readFile(join(root,'dist/public',name))))throw new Error('Stale bundled artwork: '+name);
    if(name.endsWith('.png')&&!browser.includes('data:image/png;base64,'+original.toString('base64')))throw new Error('Artwork not embedded in client: '+name);
  }
  if(browser.includes('https://ark.harco.top/assets/'))throw new Error('Browser still uses remote artwork');
}
const tag=process.env.RELEASE_TAG||'';
if(tag&&tag!=='v'+pkg.version)throw new Error('Release tag must equal v'+pkg.version);
if(process.env.REQUIRE_RELEASE_TAG==='true'&&!tag)throw new Error('Publishing requires running on a matching version tag');
const distTag=pkg.version.includes('-')?'next':'latest';
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,'dist_tag='+distTag+'\nversion='+pkg.version+'\ntarball='+pkg.name+'-'+pkg.version+'.tgz\n');
async function auditTarball(path) {
  const files=execFileSync('tar',['-tzf',path],{encoding:'utf8'}).trim().split('\n');
  if(files.some(p=>!p.startsWith('package/')||p.split('/').includes('..')||/(^|\/)(node_modules|results|game|\.env[^/]*|\.npmrc)(\/|$)|\.(pem|jsonl|log)$/.test(p)))throw new Error('Unexpected/private path in npm archive');
  for(const name of ['package.json',...required])if(!files.includes('package/'+name))throw new Error('npm archive omitted '+name);
  for(const name of artwork) {
    const original=execFileSync('tar',['-xOf',path,'package/public/'+name]);
    if(!original.equals(execFileSync('tar',['-xOf',path,'package/dist/public/'+name])))throw new Error('Archive artwork mismatch: '+name);
  }
  const manifest=JSON.parse(execFileSync('tar',['-xOf',path,'package/package.json'],{encoding:'utf8'}));
  if(manifest.name!==pkg.name||manifest.version!==pkg.version||manifest.main!=='./dist/index.mjs'||manifest.private||manifest.dsh?.manifestVersion!==1||manifest.dsh.bundle?.patch!=='./cordis.patch.yml')throw new Error('npm archive identity/entry mismatch');
  if(!/name: ['"]?dsh-ark-stronghold['"]?\s*$/.test(execFileSync('tar',['-xOf',path,'package/cordis.patch.yml'],{encoding:'utf8'})))throw new Error('npm archive bundle patch identity mismatch');
  const folder=await mkdtemp(join(tmpdir(),'dsh-package-audit-'));
  try {
    execFileSync('tar',['-xzf',path,'-C',folder]);
    const entry=await import(pathToFileURL(join(folder,'package/dist/index.mjs')).href);
    if(entry.name!=='ark-play'||typeof entry.apply!=='function'||!entry.inject.includes('tools'))throw new Error('Standalone published entry is invalid');
  }finally{await rm(folder,{recursive:true,force:true});}
}
if(process.argv[2]==='--pack') {
  const destination=resolve(root,process.env.PACKAGE_DIR||'results/npm');await mkdir(destination,{recursive:true});
  const report=JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',destination],{cwd:root,encoding:'utf8'}))[0];
  const path=join(destination,report.filename);await auditTarball(path);
  const bytes=await readFile(path),sha=createHash('sha256').update(bytes).digest('hex');
  await writeFile(path+'.sha256',sha+'  '+report.filename+'\n');
  console.log('Audited npm package: '+report.filename+' ('+bytes.length+' bytes), dist-tag='+distTag);
}else if(process.argv[2])await auditTarball(resolve(process.argv[2]));
console.log('Build/package contracts valid: '+pkg.name+'@'+pkg.version);
