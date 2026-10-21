# Ark Play — Deepseek Harness ArkStronghold对局插件

提供6个对局工具，复用[ArkStrongholdCodex](https://github.com/HarcoChen/ArkStrongholdCodex)仓库中的共享原生 `/ws` 适配层。

## 安装发布包

Node 22+，DSH `^0.2.0-rc.2`。npm 包名为 **`dsh-ark-stronghold`**，预发布版本使用 `next` 标签。首次发布到 npm 后可运行：

```sh
npm exec --package=dsh-ark-stronghold@next -- ark-play-configure --url wss://your-game-site/ws
dsh plugin --profile tui add dsh-ark-stronghold@next
```

目前尚未发布 npm 包。可先从 GitHub Actions 下载 `.tgz` 交给 DSH 安装，或解压独立 zip 后运行：

```sh
node configure.mjs --url wss://your-game-site/ws
dsh plugin --profile tui add /absolute/dsh-ark-stronghold
```

发布包预构建并内联共享核心，无需另装核心或执行构建。配置文件写入 `~/.config/ark-play/client.json`（0600，拒绝覆盖已有文件）。加入 profile 后重启该 profile。

对模型说：`用 ark_start 开一局深渊（终极），按局面与公开说明决策，玩到自然结束。`

工具：ark_start、ark_view、ark_act、ark_wait、ark_lookup、ark_finish。每个执行Agent有独立客户端，卸载时清理工具/连接/Worker。无需插件另带模型密钥，使用DSH现有模型配置。

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

## CI 与发布

每次 push / PR 在 Node 22、24 构建并审查实际 npm 归档，产出 `.tgz`、独立 zip 与 SHA256，保留 14 天。GitHub Release 自动附包；可选 npm OIDC 发布默认关闭，配置步骤见 [PUBLISH.md](PUBLISH.md)。DSH 包元数据就绪不代表已提交或进入市场。

## License

GPL-3.0-or-later，见LICENSE；分发附依赖许可与对应源码，不含上游引擎、美术、模型、凭据或对局记录。
