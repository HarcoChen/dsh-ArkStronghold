import {packageClient} from '@harco/ark-play-core/build-package';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
console.log(JSON.stringify(await packageClient({kind:'dsh',root:fileURLToPath(new URL('../',import.meta.url)),
  sharedRoot:dirname(fileURLToPath(import.meta.resolve('@harco/ark-play-core/package.json'))),output:process.argv[2]}),null,2));
