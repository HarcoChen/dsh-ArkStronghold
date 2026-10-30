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
git tag v0.1.2
git push origin v0.1.2
```

Do not manually create the GitHub Release to trigger publication. A manual
workflow_dispatch run can still build only, or publish to npm when explicitly
requested on a matching version tag. Core remains pinned to its exact commit.

Multiplayer waiting is event-driven in Core: joining/readiness, other players'
turns, combat and pause/resume keep the same tool call pending until a decision,
result or error. The DSH adapter deliberately omits timeoutMs and forwards
exec.signal for cancellation. No periodic tool result or model polling is used.

The shared module loader is owned by Core and bundled beside site-worker.mjs.
PUBLISH.md is optional in the shared packager, so removing publishing notes does
not break package creation. README.md is maintained separately.

## 2026-10-30: 0.3.3 compatibility candidate

Huawei is running game 0.3.3. The prepared client is `dsh-ark-stronghold@0.1.4`,
pinning Core `6eae6865467e5df4b363ac6ee84f2314ecda4a17`. It accepts default-version
vanilla sites through app 0.3.3 and rejects historical-version rooms before ready.
Existing bundled skill and package changes are retained. README.md is unchanged.

This preparation pushes a candidate branch and runs Node 22/24 build/package CI;
it creates no tag, GitHub Release or npm publication and does not alter an installed
DSH profile. After branch CI passes, tag the exact checked commit `v0.1.4` to let
the existing publish workflow build, audit and attach both ZIP and npm artifacts.
The npm job is controlled by `NPM_PUBLISH_ENABLED` and trusted publishing.

Five gameplay tools remain. Combat metrics/replay and multiple roles are design
work only; the companion proposal is in the Codex repository's
`docs/COMBAT-AND-MULTIROLE-DESIGN.md`.

## 2026-10-30: settled-round combat metrics candidate

Current candidate: 0.1.5, pinned Core 7450e17f37138e9d3a8636b1f345e094a98b1693 (0.2.0-alpha.5).
Six shared tools now include `ark_combat({scope:'last'|'match'})`: damage, damage
taken, effective healing, shares and player DPS/HPS from completed native
simulations. Summons are credited to their operator. Missing, taken-over,
reconstructed and interrupted fields are explicit; coverage is local fields,
not a server-wide ranking. No active-round counters, frame logs or replay.
Both host skills require one read after each settled round before the next
action, and before finishing terminal review. No polling for missing metrics.

Validated: 15 Core tests; local 0.3.3 Worker counters and full compact battle
result match direct native simulation (damage 12100, taken 135, healing 135);
Worker takeover/interruption, unavailable remote fields and new-match reset.
Host build/package audits and Node 22/24 CI accompany this candidate.
No tag, Release, npm publication or installed-profile replacement in this step.
