# Ark Play — Deepseek Harness ArkStronghold对局插件

提供5个对局工具，复用[ArkStrongholdCodex](https://github.com/HarcoChen/ArkStrongholdCodex)仓库中的共享原生 `/ws` 适配层。

## 安装发布包

对模型说：`用 ark_start 开一局深渊（终极），按局面与公开说明决策，玩到自然结束。`

工具：ark_start、ark_view、ark_act、ark_lookup、ark_finish。每个执行Agent有独立客户端，卸载时清理工具/连接/Worker。无需插件另带模型密钥，使用DSH现有模型配置。

`ready` 后插件自行完成战斗计算、结果上报和站点推进，返回下一决策局面或终局，不需要模型调用等待工具或轮询。`ready` 后本批剩余动作不会执行到下一轮。断线或取消后用 `ark_view` 恢复；站点强制计时、暂停与首领共享血池规则保留。

## 源码开发

源码构建依赖固定到核心提交 `d2e51eacb946e831a6f928a33967151f51dac603` 的 HTTPS 归档，lockfile 记录完整性摘要。可独立克隆本仓库构建：

```sh
git clone https://github.com/HarcoChen/dsh-ArkStronghold.git
cd dsh-ArkStronghold
npm ci --ignore-scripts
npm run build
npm run check:package
npm run pack:release
npm run package -- results/releases
```

本地自动结算 patch 尚未推送，共享核心的远程 pin 仍是旧版。联调时先在相邻 `ark-play-codex` 执行 `npm run build` 和 `npm pack --ignore-scripts --pack-destination results`，再在本仓库执行 `npm install --no-save --package-lock=false --ignore-scripts ../ark-play-codex/results/harco-ark-play-core-0.2.0-alpha.2.tgz` 后构建。本地依赖覆盖不修改远程 lockfile；发布前须先发布共享核心提交并更新上述 pin。

## CI 与发布

## License

GPL-3.0-or-later，见LICENSE；分发附依赖许可与对应源码，不含上游引擎、美术、模型、凭据或对局记录。

## Web 界面与游戏站配置

安装后重启 DSH Web 并刷新浏览器。左侧 Ark Stronghold 打开单一地址表单，填写游戏站根地址并保存，下次开局生效。仅包含地址输入、保存和操作反馈。

使用 DSH 0.2.0-rc.2 的 configForms 与 volatile Config；地址 schema 使用普通字符串，避免浏览器重建 transform 回调。保存前与建立连接前分别校验地址。输入不依赖配置读取状态；读取失败显示错误，保存被拒绝不会显示成功。

根目录与 dist/package.json 均声明 ./client 导出，兼容 DSH 从 Host 入口查找最近清单的行为。

## 站点运行时加载

DSH 的本地 `site-loader.mjs` 基于共享核心加载器（GPL-3.0-or-later）增加 8 路并发预取，避免 Node 逐个加载数百个远程依赖撞上 Worker 的 60 秒初始化期限。预取范围为站点已发布内容清单，保持同源检查、每文件 30 秒超时、3 MiB 上限和 SHA-256 校验；只存内存，不保存站点资源到磁盘。现有 Worker 总超时未调大。
