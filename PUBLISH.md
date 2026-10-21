# Build and release

The shared gameplay implementation lives at
https://github.com/ArkStrongholdRL/ark-play-core. This repository owns the DSH
Cordis tool adapter, settings page and bundled public artwork.

`@arkstrongholdrl/ark-play-core` is pinned to a complete GitHub commit archive;
package-lock.json records its integrity. No sibling checkout or local tarball
installation is needed. Update the core pin and lockfile together after the
core's CI succeeds.

```sh
npm ci --ignore-scripts
npm run build
npm run check:package
npm run pack:release
npm run package -- results/releases
```

CI runs this sequence on Node 22 and 24. The artifact includes an audited npm
archive and standalone ZIP, plus checksums. Both include bundled core runtime;
end users do not separately install Core. The ZIP includes corresponding source
for the exact core and DSH host used, including public artwork and its notice.

Release tags must match package.json. Publishing a GitHub Release runs the
publish workflow; npm publication additionally requires NPM_PUBLISH_ENABLED and
configured npm trusted publishing. This migration does not itself publish a new
version or change that setting.

The shared module loader is owned by Core and bundled beside site-worker.mjs.
PUBLISH.md is optional in the shared packager, so removing publishing notes does
not break package creation. README.md is maintained separately.
