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

Release tags must match package.json. Pushing a `v*` tag runs the publish
workflow: it builds and verifies the packages, creates a GitHub Release with the
audited assets, and publishes to npm when NPM_PUBLISH_ENABLED is true and npm
trusted publishing is configured. Tags containing a hyphen create prereleases
and use the npm `next` dist-tag; stable versions use `latest`.

After updating package.json/package-lock.json, rebuilding and committing the
generated files, wait for branch CI to pass, then publish the matching commit:

```sh
git tag v0.1.1
git push origin v0.1.1
```

Do not manually create the GitHub Release to trigger publication. A manual
workflow_dispatch run can still build only, or publish to npm when explicitly
requested on a matching version tag. Core remains pinned to its exact commit.

The shared module loader is owned by Core and bundled beside site-worker.mjs.
PUBLISH.md is optional in the shared packager, so removing publishing notes does
not break package creation. README.md is maintained separately.
