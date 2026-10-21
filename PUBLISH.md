# 发布 DSH 插件

npm 包名为 `dsh-ark-stronghold`，当前版本 `0.2.0-alpha.1`。`dsh.manifestVersion: 1` 与 `dsh.bundle.patch` 声明原生插件；实际入口为预构建的 `dist/index.mjs`。包中附共享核心的对应源码、依赖许可与配置命令，不包含游戏引擎、资源、轨迹或凭据。构建依赖的核心归档固定提交及 lockfile 完整性摘要，运行时无需下载核心。

## 持续集成与产物

`Build and package` 在 push / PR / 手动触发时运行 Node 22、24：

```sh
npm ci --ignore-scripts
npm run build
npm run check:package
npm run pack:release
npm run package -- results/releases
```

检查版本、入口、DSH 元数据、语法与文件边界，并从实际 `.tgz` 解压加载插件入口。不连接游戏、不调用模型；这不是棋力或完整 DSH 管理流程验收。npm 包包含对应源码，安装不执行构建脚本。Actions 产物保留 14 天，含 `.tgz`、独立 zip 和 SHA256。

本地直接 `npm pack` 也会先构建和检查。打 zip 需要系统 `zip`；为避免覆盖已有产物，同一目录的同名 zip 会拒绝重建。

## GitHub Release

先修改根 `package.json` 版本，执行 `npm install --package-lock-only --ignore-scripts` 和上述构建检查，提交版本、lockfile 与 dist。打 `v<版本>` 标签并发布 GitHub Release，例如当前 `v0.2.0-alpha.1`。标签必须与包版本严格一致。

`Release and npm` 自动构建一次，将同一批 npm 包、zip 与校验文件附到 Release；已有同名资产时需先核对再处理，不自动覆盖。工作流也可手动运行，默认 `publish=false` 仅生成产物。

## 可选 npm 发布

默认不上传 npm。首次发布由包所有者在本地完成 npm 登录并审阅 `.tgz` 后运行：

```sh
npm publish results/npm/dsh-ark-stronghold-0.2.0-alpha.1.tgz --ignore-scripts --access public --tag next
```

包名尚未保留，首次发布前应再次确认可用性。请勿把登录 token 或凭据提交进仓库。

后续自动发布使用 [npm Trusted Publishing / OIDC](https://docs.npmjs.com/trusted-publishers/)，无需保存 `NPM_TOKEN`。在 npm 包设置添加 GitHub Actions trusted publisher：

- Owner：`HarcoChen`
- Repository：`dsh-ArkStronghold`
- Workflow filename：`publish.yml`
- Environment：留空（本工作流未配置 environment）
- 允许执行 `npm publish`。

再将 GitHub 仓库 Actions 变量 `NPM_PUBLISH_ENABLED` 设为 `true`。工作流使用 GitHub 托管 Ubuntu runner、Node 24 / npm 11.5.1+、`id-token: write`。仓库与包均公开时 npm 自动生成 provenance。

之后发布新版本 Release，或在匹配版本的 tag 上手动选择 `publish=true`。发布 job 下载已审查的同一份包、复核 SHA256 与归档入口，然后执行 `npm publish --ignore-scripts`。预发布版本自动使用 `next`，稳定版本使用 `latest`；npm 不允许覆盖已发布版本，同版本重复发布会失败。

首次手动发布后，不要再对同一版本开启自动发布；下一版本再使用 OIDC。npm 可分发与 DSH 元数据就绪不等于进入市场，市场收录仍需按届时平台要求提交。

## 发布说明边界

注明原生 `/ws` 单人对局，采集、保存、下载和鉴权均归网站；普通战斗真实模拟，完整实测站点 0.3.1；首领共享血池与玩法插件房间未完整验收；未实测真实 DSH 模型棋力。旧 0.1.0 包已退役。
